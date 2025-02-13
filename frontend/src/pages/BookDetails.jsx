import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating"; // Import StarRating component
import "../styles/BookDetails.css"; // Import specific styles for BookDetails

const BookDetails = () => {
  const { id } = useParams(); // Assuming the id is the Google Books ID
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookDetails = useCallback(async () => {
    try {
      // Fetch book details from Google Books API
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      setBook(response.data.volumeInfo);
      await fetchReviews(); // Call fetchReviews after setting book details
    } catch (err) {
      setError("Error fetching book details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/${id}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/reviews",
      { bookId: id, rating, content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setContent("");
    setRating(0);
    await fetchReviews(); // Refresh reviews
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>No book details available.</div>; // Handle case where book is not found

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
        </div>
        <img
          src={
            book.imageLinks ? book.imageLinks.thumbnail : "No image available"
          }
          alt={book.title}
          className="book-cover"
        />
      </div>
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review._id} className="review">
          <p>
            <strong>{review.userId.username}</strong>: {review.content} (Rating:{" "}
            {review.rating})
          </p>
        </div>
      ))}

      {isAuthenticated ? (
        <form onSubmit={handleSubmitReview}>
          <StarRating rating={rating} onRatingChange={setRating} />{" "}
          {/* Star rating component */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a review..."
            required
          ></textarea>
          <button type="submit">Submit Review</button>
        </form>
      ) : (
        <p>Please log in to write a review.</p>
      )}
    </div>
  );
};

export default BookDetails;
