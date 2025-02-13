const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Assuming you have a Book model

// Get books with pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to 10 books per page
    try {
        const books = await Book.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalBooks = await Book.countDocuments();
        res.json({ books, totalPages: Math.ceil(totalBooks / limit) });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router; 