const express = require('express');
const { Comment, Post } = require('./models');
const { authMiddleware } = require('./authRoutes');
const router = express.Router();

// Create a new comment
router.post('/post/:postId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;

        // Validate post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create comment
        const comment = new Comment({
            content,
            author: req.user._id,
            post: postId
        });

        // Save comment
        await comment.save();

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        // Populate author details
        await comment.populate('author', 'username');

        res.status(201).json(comment);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        const comments = await Comment.find({ post: postId })
            .populate('author', 'username')
            .populate('replies.author', 'username')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a comment
router.put('/comment/:commentId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const commentId = req.params.commentId;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this comment' });
        }

        comment.content = content;
        await comment.save();

        res.json(comment);
    } catch (error) {
        console.error('Update comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/comment/:commentId/reply', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const commentId = req.params.commentId;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Add reply
        comment.replies.push({
            content,
            author: req.user._id,
            createdAt: Date.now()
        });

        await comment.save();

        // Populate author details
        await comment.populate('author', 'username');
        await comment.populate('replies.author', 'username');

        res.status(201).json(comment);
    } catch (error) {
        console.error('Create reply error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a comment
router.delete('/comment/:commentId', authMiddleware, async (req, res) => {
    try {
        const commentId = req.params.commentId;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove comment from post's comments array
        await Post.findByIdAndUpdate(
            comment.post,
            { $pull: { comments: commentId } }
        );

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        res.json({ message: 'Comment removed' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/comment/:commentId/reply/:replyId', authMiddleware, async (req, res) => {
    try {
        const { commentId, replyId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Find the reply
        const reply = comment.replies.id(replyId);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if user is the author of the reply
        if (reply.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this reply' });
        }

        // Remove the reply
        comment.replies.pull(replyId);
        await comment.save();

        res.json({ message: 'Reply removed' });
    } catch (error) {
        console.error('Delete reply error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
