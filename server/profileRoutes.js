// Add this to your server-side routes (e.g., in a profileRoutes.js file)
const express = require('express');
const multer = require('multer');
const path = require('path');
const { User } = require('./models');
const { authMiddleware } = require('./authRoutes');
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
    destination: './uploads/profile',
    filename: (req, file, cb) => {
        return cb(null, `${req.user._id}_${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
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
});

// Upload profile avatar
router.post('/avatar', authMiddleware, (req, res) => {
    upload.single('avatar')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const avatarUrl = `/uploads/profile/${req.file.filename}`;

            // Update user with avatar URL
            await User.findByIdAndUpdate(req.user._id, { avatarUrl });

            res.json({ avatarUrl });
        } catch (error) {
            console.error('Avatar upload error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Upload cover image
router.post('/cover', authMiddleware, (req, res) => {
    upload.single('coverImage')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const coverImageUrl = `/uploads/profile/${req.file.filename}`;

            // Update user with cover image URL
            await User.findByIdAndUpdate(req.user._id, { coverImage: coverImageUrl });

            res.json({ coverImageUrl });
        } catch (error) {
            console.error('Cover image upload error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { bio, website } = req.body;

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { bio, website },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
// Add saved posts functionality
router.post('/saved', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        // Check if user has this post saved
        const user = await User.findById(userId);
        const savedPosts = user.savedPosts || [];

        // Check if post is already saved
        const postIndex = savedPosts.indexOf(postId);
        let isSaved = false;

        if (postIndex > -1) {
            // Post is already saved, so remove it
            savedPosts.splice(postIndex, 1);
        } else {
            // Post is not saved, so add it
            savedPosts.push(postId);
            isSaved = true;
        }

        // Update user with saved posts
        await User.findByIdAndUpdate(userId, { savedPosts });

        res.json({ success: true, isSaved });
    } catch (error) {
        console.error('Save post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check if a post is saved
router.get('/saved/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const savedPosts = user.savedPosts || [];

        const isSaved = savedPosts.includes(postId);

        res.json({ isSaved });
    } catch (error) {
        console.error('Check saved post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all saved posts
router.get('/saved', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        const savedPosts = user.savedPosts || [];

        // Fetch full post data
        const posts = await Post.find({ _id: { $in: savedPosts } })
            .populate('author', 'username')
            .sort({ publishedAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Get saved posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
