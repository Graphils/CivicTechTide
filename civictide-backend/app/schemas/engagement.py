from pydantic import BaseModel
from datetime import datetime


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    content: str
    user_id: int
    report_id: int
    author_name: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class VoteOut(BaseModel):
    report_id: int
    vote_count: int
    user_has_voted: bool
