import { useEffect, useState } from 'react'
import { ThumbsUp, MessageCircle, Send, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { useAuthStore } from '../../hooks/useAuthStore'
import { formatRelative } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ── Types ──────────────────────────────────────────────

interface VoteState {
  vote_count: number
  user_has_voted: boolean
}

interface Comment {
  id: number
  content: string
  user_id: number
  author_name: string
  created_at: string
}

// ── Vote Button ────────────────────────────────────────

export function VoteButton({ reportId }: { reportId: number }) {
  const { isAuthenticated, user } = useAuthStore()
  const [voteState, setVoteState] = useState<VoteState>({ vote_count: 0, user_has_voted: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    api.get(`/engagement/reports/${reportId}/votes`)
      .then(res => setVoteState(res.data))
      .catch(() => {})
  }, [reportId, isAuthenticated])

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to upvote reports')
      return
    }
    setLoading(true)
    try {
      const res = await api.post(`/engagement/reports/${reportId}/vote`)
      setVoteState(res.data)
      toast.success(res.data.user_has_voted ? '👍 Upvoted!' : 'Vote removed')
    } catch {
      toast.error('Failed to vote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 border-2
        ${voteState.user_has_voted
          ? 'bg-wave text-white border-wave shadow-glow'
          : 'bg-white text-ocean border-blue-100 hover:border-wave hover:text-wave'}`}
      style={{ fontFamily: 'Syne, sans-serif' }}
    >
      <ThumbsUp size={16} className={voteState.user_has_voted ? 'fill-white' : ''} />
      <span>{voteState.vote_count}</span>
      <span>{voteState.user_has_voted ? 'Upvoted' : 'Upvote'}</span>
    </button>
  )
}

// ── Comments Section ───────────────────────────────────

export function CommentsSection({ reportId }: { reportId: number }) {
  const { isAuthenticated, user } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadComments = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/engagement/reports/${reportId}/comments`)
      setComments(res.data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadComments() }, [reportId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    if (!isAuthenticated) {
      toast.error('Please log in to comment')
      return
    }
    setSubmitting(true)
    try {
      await api.post(`/engagement/reports/${reportId}/comments`, { content: newComment.trim() })
      setNewComment('')
      toast.success('Comment added!')
      loadComments()
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await api.delete(`/engagement/comments/${commentId}`)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div className="card">
      {/* Header */}
      <h2 className="section-title mb-5 flex items-center gap-2">
        <MessageCircle size={18} className="text-wave" />
        Comments
        <span className="text-sm font-normal text-ocean/40">({comments.length})</span>
      </h2>

      {/* Comment input */}
      {isAuthenticated ? (
        <div className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-wave flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ fontFamily: 'Syne, sans-serif' }}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Add a comment..."
              className="input flex-1 py-2.5"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              className="btn-primary px-4 py-2.5"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-foam rounded-xl px-4 py-3 mb-6 text-sm text-ocean/60 text-center">
          <a href="/login" className="text-wave font-semibold hover:underline">Sign in</a> to leave a comment
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 bg-blue-50 rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-blue-50 rounded w-24 mb-2" />
                <div className="h-3 bg-blue-50 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-ocean/30">
          <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No comments yet — be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-foam border border-blue-100 flex items-center justify-center text-wave text-sm font-bold shrink-0" style={{ fontFamily: 'Syne, sans-serif' }}>
                {comment.author_name?.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 bg-foam rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-ocean" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {comment.author_name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ocean/40">{formatRelative(comment.created_at)}</span>
                    {(user?.id === comment.user_id || user?.is_admin) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-ocean/70 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
