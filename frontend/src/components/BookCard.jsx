import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BookCard.css"; // Import styles for the book card

const BookCard = ({ book }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = async (e) => {
    e.preventDefault();
    if (navigating) return;
    
    setNavigating(true);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      navigate(`/book/${book.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setNavigating(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails(e);
    }
  };

  return (
    <div 
      className={`book-card ${navigating ? 'navigating' : ''}`}
      onClick={handleViewDetails}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.volumeInfo.title}`}
    >
      <div className="book-info">
        <h2>{book.volumeInfo.title}</h2>
        <p>
          Authors:{" "}
          {book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown"}
        </p>
        {book.volumeInfo.publishedDate && (
          <p className="publish-date">
            Published: {book.volumeInfo.publishedDate}
          </p>
        )}
        {book.volumeInfo.averageRating && (
          <p className="rating">
            Rating: {'★'.repeat(Math.floor(book.volumeInfo.averageRating))}
            {'☆'.repeat(5 - Math.floor(book.volumeInfo.averageRating))}
            ({book.volumeInfo.averageRating})
          </p>
        )}
        <button 
          className={`view-details ${navigating ? 'loading' : ''}`}
          onClick={handleViewDetails}
          disabled={navigating}
          aria-label={`View details for ${book.volumeInfo.title}`}
        >
          {navigating ? (
            <>
              <span className="spinner">🔄</span>
              Loading...
            </>
          ) : (
            'View Details'
          )}
        </button>
      </div>
      
      <div className="book-image-container">
        {imageLoading && !imageError && (
          <div className="image-loader">
            <div className="image-placeholder">
              <span>📖</span>
              Loading...
            </div>
          </div>
        )}
        
        <img
          src={
            book.volumeInfo.imageLinks && !imageError
              ? book.volumeInfo.imageLinks.thumbnail
              : "/placeholder-book.png"
          }
          alt={book.volumeInfo.title}
          className={`book-cover ${imageLoading ? 'loading' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
        
        {imageError && (
          <div className="image-error">
            <span>📚</span>
            <small>No image</small>
          </div>
        )}
      </div>
      
      {navigating && (
        <div className="navigation-overlay">
          <div className="navigation-spinner">🔄</div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
