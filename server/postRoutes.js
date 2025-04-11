const express = require('express');
const multer = require('multer');
const path = require('path');
const { Post } = require('./models');
const { authMiddleware } = require('./authRoutes');
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        return cb(null, `post_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Allow only images
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
}).single('image');
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Post Controller Functions
// In postRoutes.js, update the getAllPosts function
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username'
                },
                options: { sort: { createdAt: -1 } }
            })
            .populate('likes', '_id'); // Populate likes with just the user IDs

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const createPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            const { title, content, slug } = req.body;

            // Check if slug exists
            const existingPost = await Post.findOne({ slug });
            if (existingPost) {
                return res.status(400).json({ message: 'A post with this slug already exists' });
            }

            const post = new Post({
                title,
                content,
                slug,
                author: req.user._id,
                imagePath: req.file ? `/uploads/images/${req.file.filename}` : null
            });

            await post.save();
            res.status(201).json(post);
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
};


const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id })
            .populate('author', 'username')
            .sort({ publishedAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the user is the author
            if (post.author.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this post' });
            }

            const { title, content } = req.body;

            // Update fields
            post.title = title || post.title;
            post.content = content || post.content;

            // Update image if provided
            if (req.file) {
                post.imagePath = `/uploads/images/${req.file.filename}`;
            }

            await post.save();
            res.json(post);
        } catch (error) {
            console.error('Update post error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
};



const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Routes
router.get('/user', authMiddleware, getUserPosts);
router.get('/id/:id', authMiddleware, getPostById); // Specific route for fetching by ID
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.get('/:slug', getPostBySlug); // Generic route for fetching by slug
router.get('/', getAllPosts);
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has already liked the post
        const index = post.likes.indexOf(req.user._id);

        if (index === -1) {
            // Like the post
            post.likes.push(req.user._id);
        } else {
            // Unlike the post
            post.likes.splice(index, 1);
        }

        await post.save();

        res.json({
            likes: post.likes.length,
            isLiked: post.likes.includes(req.user._id)
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;


// Add these functions to your postRoutes.js

// Get posts by current user


// Update post

// Delete post


// Add these routes


// Get post by ID
