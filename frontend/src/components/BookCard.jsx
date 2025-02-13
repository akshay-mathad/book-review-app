import React from "react";
import "../styles/BookCard.css"; // Import styles for the book card

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-info">
        <h2>{book.volumeInfo.title}</h2>
        <p>
          Authors:{" "}
          {book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown"}
        </p>
        <a href={`/book/${book.id}`} className="view-details">
          View Details
        </a>
      </div>
      <img
        src={
          book.volumeInfo.imageLinks
            ? book.volumeInfo.imageLinks.thumbnail
            : "No image available"
        }
        alt={book.volumeInfo.title}
        className="book-cover"
      />
    </div>
  );
};

export default BookCard;
