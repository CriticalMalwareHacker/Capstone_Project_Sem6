const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { router: authRouter, authMiddleware } = require('../server/authRoutes');
const postRoutes = require('../server/postRoutes');
const commentRoutes = require('../server/commentRoutes');

// Initialize express
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// For file uploads, you'll need to use a cloud storage service like Cloudinary
// instead of local file storage, as Vercel doesn't support persistent file storage

// Export the Express API
module.exports = app;