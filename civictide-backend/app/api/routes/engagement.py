from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.database import get_db
from app.models.engagement import Vote, Comment
from app.models.report import Report
from app.models.user import User
from app.schemas.engagement import CommentCreate, CommentOut, VoteOut
from app.core.security import get_current_user

router = APIRouter(prefix="/engagement", tags=["Engagement"])


# ── Votes ──────────────────────────────────────────────

@router.post("/reports/{report_id}/vote", response_model=VoteOut)
def toggle_vote(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Toggle vote on a report — upvote if not voted, remove if already voted."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    existing_vote = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.report_id == report_id
    ).first()

    if existing_vote:
        # Remove vote
        db.delete(existing_vote)
        db.commit()
        user_has_voted = False
    else:
        # Add vote
        vote = Vote(user_id=current_user.id, report_id=report_id)
        db.add(vote)
        db.commit()
        user_has_voted = True

    vote_count = db.query(Vote).filter(Vote.report_id == report_id).count()
    return VoteOut(report_id=report_id, vote_count=vote_count, user_has_voted=user_has_voted)


@router.get("/reports/{report_id}/votes", response_model=VoteOut)
def get_votes(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get vote count and whether current user has voted."""
    vote_count = db.query(Vote).filter(Vote.report_id == report_id).count()
    user_has_voted = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.report_id == report_id
    ).first() is not None
    return VoteOut(report_id=report_id, vote_count=vote_count, user_has_voted=user_has_voted)


# ── Comments ───────────────────────────────────────────

@router.get("/reports/{report_id}/comments", response_model=list[CommentOut])
def get_comments(report_id: int, db: Session = Depends(get_db)):
    """Get all comments for a report — public."""
    comments = db.query(Comment).filter(Comment.report_id == report_id).order_by(Comment.created_at.asc()).all()
    result = []
    for c in comments:
        data = CommentOut.model_validate(c)
        data.author_name = c.user.full_name if c.user else "Anonymous"
        result.append(data)
    return result


@router.post("/reports/{report_id}/comments", response_model=CommentOut, status_code=201)
def add_comment(
    report_id: int,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a comment to a report."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    comment = Comment(
        content=payload.content,
        user_id=current_user.id,
        report_id=report_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    data = CommentOut.model_validate(comment)
    data.author_name = current_user.full_name
    return data


@router.delete("/comments/{comment_id}", status_code=204)
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete your own comment."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(comment)
    db.commit()
