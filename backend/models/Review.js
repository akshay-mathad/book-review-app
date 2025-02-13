const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema); 