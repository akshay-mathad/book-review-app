import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import StarRating from "../components/StarRating";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchBookDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      setBook(response.data.volumeInfo);
      await fetchReviews();
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Error fetching book details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URI}/reviews/${id}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Don't show error for reviews as it's not critical
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const validateReview = () => {
    if (rating === 0) {
      setReviewError("Please select a rating");
      return false;
    }
    if (!content.trim()) {
      setReviewError("Please write a review");
      return false;
    }
    if (content.trim().length < 10) {
      setReviewError("Review must be at least 10 characters long");
      return false;
    }
    return true;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!validateReview()) {
      return;
    }

    setReviewLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URI}/reviews`,
        { bookId: id, rating, content: content.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setContent("");
      setRating(0);
      setReviewSuccess("Review submitted successfully!");
      
      // Refresh reviews after successful submission
      await fetchReviews();
      
      // Clear success message after 3 seconds
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review. Please try again.";
      setReviewError(errorMessage);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // Clear rating error when user selects a rating
    if (reviewError === "Please select a rating") {
      setReviewError("");
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // Clear content error when user starts typing
    if (reviewError.includes("review")) {
      setReviewError("");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column'
      }}>
        <LoadingSpinner />
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details">
        <div className="error" style={{ textAlign: 'center', padding: '2rem' }}>
          {error}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No book details available.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details">
      <div className="book-section">
        <div className="book-data">
          <h1>{book.title}</h1>
          <h2>Authors: {book.authors ? book.authors.join(", ") : "Unknown"}</h2>
          <p>
            <strong>Description:</strong>{" "}
            {book.description ? book.description : "No description available."}
          </p>
          {book.publishedDate && (
            <p><strong>Published:</strong> {book.publishedDate}</p>
          )}
          {book.pageCount && (
            <p><strong>Pages:</strong> {book.pageCount}</p>
          )}
        </div>
        <img
          src={
            book.imageLinks ? book.imageLinks.thumbnail : "/placeholder-book.png"
          }
          alt={book.title}
          className="book-cover"
          onError={(e) => {
            e.target.src = "/placeholder-book.png";
          }}
        />
      </div>

      <div className="reviews-section">
        <h2>Reviews {reviewsLoading && <span style={{ fontSize: '0.8em' }}>🔄</span>}</h2>
        
        {reviewsLoading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <LoadingSpinner />
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <div className="review-header">
                <strong>{review.userId?.username || 'Anonymous'}</strong>
                <span className="review-rating">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
              </div>
              <p className="review-content">{review.content}</p>
              <small className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this book!</p>
        )}
      </div>

      {isAuthenticated ? (
        <div className="review-form-section">
          <h3>Write a Review</h3>
          
          {reviewSuccess && (
            <div className="success">{reviewSuccess}</div>
          )}
          
          {reviewError && (
            <div className="error">{reviewError}</div>
          )}

          <form onSubmit={handleSubmitReview}>
            <div className="rating-section">
              <label>Rating:</label>
              <StarRating 
                rating={rating} 
                onRatingChange={handleRatingChange}
                disabled={reviewLoading}
              />
            </div>
            
            <div className="content-section">
              <label htmlFor="review-content">Your Review:</label>
              <textarea
                id="review-content"
                value={content}
                onChange={handleContentChange}
                placeholder="Write your review here... (minimum 10 characters)"
                required
                disabled={reviewLoading}
                rows={4}
              />
              <small style={{ color: '#6c757d' }}>
                {content.length}/10 characters minimum
              </small>
            </div>
            
            <button 
              type="submit" 
              disabled={reviewLoading || !rating || !content.trim()}
              className="submit-review-btn"
            >
              {reviewLoading ? (
                <>
                  <span style={{ marginRight: '0.5rem' }}>🔄</span>
                  Submitting Review...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="auth-prompt">
          <p>Please <a href="/login">log in</a> to write a review.</p>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
