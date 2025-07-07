import React, { useState } from 'react';
import '../styles/StarRating.css'; // Import CSS for styling

const StarRating = ({ rating, onRatingChange, disabled = false, size = 'medium' }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const stars = [1, 2, 3, 4, 5]; // Array for 5 stars

    const handleStarClick = (starValue) => {
        if (disabled) return;
        
        setIsAnimating(true);
        onRatingChange(starValue);
        
        // Reset animation after a short delay
        setTimeout(() => setIsAnimating(false), 200);
    };

    const handleStarHover = (starValue) => {
        if (disabled) return;
        setHoveredRating(starValue);
    };

    const handleMouseLeave = () => {
        if (disabled) return;
        setHoveredRating(0);
    };

    const handleKeyPress = (e, starValue) => {
        if (disabled) return;
        
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStarClick(starValue);
        }
    };

    const getStarClass = (starValue) => {
        const baseClass = 'star';
        const classes = [baseClass];
        
        if (disabled) {
            classes.push('disabled');
        }
        
        if (isAnimating && starValue <= rating) {
            classes.push('animating');
        }
        
        const displayRating = hoveredRating || rating;
        if (starValue <= displayRating) {
            classes.push('filled');
        }
        
        if (hoveredRating > 0 && starValue <= hoveredRating) {
            classes.push('hovered');
        }
        
        classes.push(size);
        
        return classes.join(' ');
    };

    const getRatingText = () => {
        const displayRating = hoveredRating || rating;
        const texts = {
            0: 'No rating',
            1: 'Poor',
            2: 'Fair', 
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        return texts[displayRating] || 'No rating';
    };

    return (
        <div 
            className={`star-rating ${disabled ? 'disabled' : ''} ${size}`}
            onMouseLeave={handleMouseLeave}
            role="radiogroup"
            aria-label="Rate this book"
        >
            <div className="stars-container">
                {stars.map((star) => (
                    <span
                        key={star}
                        className={getStarClass(star)}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onKeyPress={(e) => handleKeyPress(e, star)}
                        tabIndex={disabled ? -1 : 0}
                        role="radio"
                        aria-checked={star <= rating}
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    >
                        ★
                    </span>
                ))}
                {disabled && (
                    <div className="disabled-overlay">
                        <span className="disabled-icon">🔒</span>
                    </div>
                )}
            </div>
            
            <div className="rating-feedback">
                <span className="rating-text">{getRatingText()}</span>
                {(hoveredRating > 0 || rating > 0) && (
                    <span className="rating-value">
                        ({hoveredRating || rating}/5)
                    </span>
                )}
            </div>
            
            {isAnimating && (
                <div className="rating-animation">
                    <span className="animation-text">✨ Rated!</span>
                </div>
            )}
        </div>
    );
};

export default StarRating; 