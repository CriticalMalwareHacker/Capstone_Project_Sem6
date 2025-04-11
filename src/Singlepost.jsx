import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CommentSection } from 'react-comments-section';
import { useAuth } from './AuthContext';
import 'react-comments-section/dist/index.css';
import "./Singlepost.css";

const API_URL = "http://localhost:5000/api/posts";
const COMMENTS_URL = "http://localhost:5000/api/comments";

export default function Singlepost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_URL}/${slug}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error("Post not found");
                const data = await response.json();
                setPost(data);
                setLikeCount(data.likes?.length || 0);

                // Check if the current user has liked this post
                if (currentUser) {
                    const userLiked = data.likes?.some(likeId => likeId === currentUser._id);
                    setIsLiked(userLiked || false);
                }

                // Fetch comments for this post
                const commentsResponse = await fetch(`${COMMENTS_URL}/post/${data._id}`);
                if (commentsResponse.ok) {
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [slug, currentUser]);



    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${COMMENTS_URL}/post/${post._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (!response.ok) {
                throw new Error("Failed to post comment");
            }

            const comment = await response.json();
            setComments([comment, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const response = await fetch(`${COMMENTS_URL}/comment/${commentId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ content: replyContent })
            });

            if (!response.ok) {
                throw new Error("Failed to post reply");
            }

            const updatedComment = await response.json();

            // Update the comments array with the new reply
            setComments(comments.map(comment =>
                comment._id === commentId ? updatedComment : comment
            ));

            setReplyingTo(null);
            setReplyContent("");
        } catch (err) {
            console.error("Error posting reply:", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            const response = await fetch(`${COMMENTS_URL}/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete comment");
            }

            // Remove the deleted comment from state
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };
    const handleDeleteReply = async (commentId, replyId) => {
        if (!window.confirm("Are you sure you want to delete this reply?")) {
            return;
        }

        try {
            const response = await fetch(`${COMMENTS_URL}/comment/${commentId}/reply/${replyId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete reply");
            }

            // Update the comments state by removing the deleted reply
            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.filter(reply => reply._id !== replyId)
                    };
                }
                return comment;
            }));
        } catch (err) {
            console.error("Error deleting reply:", err);
        }
    };
    const handleLike = async () => {
        if (!currentUser) {
            // Redirect to login or show a message
            alert("Please sign in to like posts");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${post._id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to like post');
            }

            const data = await response.json();
            setLikeCount(data.likes);
            setIsLiked(data.isLiked);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section>
            <h1>{post.title}</h1>
            {post.image && (
                <div className="image-container">
                    <img src={post.image} alt={post.title} />
                </div>
            )}
            <div className="post-meta">
                <p>Author: {post.author?.username || 'Unknown'}</p>


                <p className="date">
                    {new Date(post.publishedAt).toLocaleDateString()}
                </p>
            </div>
            <div
                className="post-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="post-actions">
                <button
                    onClick={handleLike}
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                >
                    {isLiked ? '❤️ Liked' : '🤍 Like'} ({likeCount})
                </button>
            </div>
            <div className="comments-section">
                <h3>Comments</h3>

                {currentUser ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            required
                        />
                        <button type="submit">Post Comment</button>
                    </form>
                ) : (
                    <p>Please <a href="/signin">sign in</a> to leave a comment.</p>
                )}

                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <div className="comment-header">
                                    <strong>{comment.author?.username || 'Unknown'}</strong>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p>{comment.content}</p>

                                <div className="comment-actions">
                                    {currentUser && (
                                        <button
                                            onClick={() => setReplyingTo(comment._id)}
                                            className="reply-btn"
                                        >
                                            Reply
                                        </button>
                                    )}

                                    {/* Only show delete button if current user is the author */}
                                    {currentUser && currentUser._id === comment.author?._id && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="delete-comment-btn"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {/* Reply form */}
                                {replyingTo === comment._id && currentUser && (
                                    <form
                                        onSubmit={(e) => handleReplySubmit(e, comment._id)}
                                        className="reply-form"
                                    >
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write a reply..."
                                            required
                                        />
                                        <div className="reply-actions">
                                            <button type="button" onClick={() => setReplyingTo(null)}>
                                                Cancel
                                            </button>
                                            <button type="submit">Reply</button>
                                        </div>
                                    </form>
                                )}

                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="replies">
                                        {comment.replies.map((reply) => (
                                            <div key={reply._id} className="reply">
                                                <div className="comment-header">
                                                    <strong>{reply.author?.username || 'Unknown'}</strong>
                                                    <span className="comment-date">
                                                        {new Date(reply.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p>{reply.content}</p>

                                                {/* Only show delete button if current user is the author */}
                                                {currentUser && currentUser._id === reply.author?._id && (
                                                    <button
                                                        onClick={() => handleDeleteReply(comment._id, reply._id)}
                                                        className="delete-comment-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </section>
    );
}