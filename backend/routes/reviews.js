const express = require('express');
const passport = require('passport');
const Review = require('../models/Review');
const router = express.Router();

// Submit a new review or update an existing one
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { bookId, rating, content } = req.body;
    const userId = req.user.id;

    try {
        // Check if a review already exists for this user and book
        let review = await Review.findOne({ bookId, userId });

        if (review) {
            // Update the existing review
            review.rating = rating;
            review.content = content;
            await review.save();
            return res.status(200).json(review);
        } else {
            // Create a new review
            const newReview = new Review({ bookId, userId, rating, content });
            await newReview.save();
            return res.status(201).json(newReview);
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get reviews for a specific book
router.get('/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId', 'username');
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;