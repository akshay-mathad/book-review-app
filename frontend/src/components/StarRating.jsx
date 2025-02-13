import React from 'react';
import './StarRating.css'; // Import CSS for styling

const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5]; // Array for 5 stars

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''}`}
                    onClick={() => onRatingChange(star)} // Set rating on click
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating; 