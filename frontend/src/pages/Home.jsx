import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import BookCard from '../components/BookCard'; // Import the BookCard component
import '../styles/Home.css'; // Import custom styles for Home

const Home = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [page, setPage] = useState(1); // Current page for search results
    const [totalPages, setTotalPages] = useState(0); // Total pages for search results
    const [inputPage, setInputPage] = useState(1); // State for page number input
    const observer = useRef(); // Reference for the Intersection Observer

    useEffect(() => {
        fetchFeaturedBooks(); // Fetch featured books on component mount
    }, []); // Fetch books only once on component mount

    const fetchFeaturedBooks = async () => {
        try {
            setLoading(true); // Set loading to true
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10&startIndex=${(page - 1) * 10}`); // Fetch featured books
            setBooks(response.data.items); // Set books to the featured books
            setTotalPages(Math.ceil(response.data.totalItems / 10)); // Calculate total pages
        } catch (error) {
            console.error('Error fetching featured books:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const fetchSearchResults = async (searchTerm, page) => {
        try {
            setLoading(true); // Set loading to true
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=10&startIndex=${(page - 1) * 10}`);
            setBooks(response.data.items); // Set books to the search results
            setTotalPages(Math.ceil(response.data.totalItems / 10)); // Calculate total pages
        } catch (error) {
            console.error('Error searching books:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page
        await fetchSearchResults(searchTerm, 1); // Fetch first page of search results
    };

    const handlePageChange = (newPage) => {
        setPage(newPage); // Update current page
        fetchSearchResults(searchTerm, newPage); // Fetch books for the new page
    };

    const handleInputPageChange = (e) => {
        const value = e.target.value;
        if (value > 0 && value <= totalPages) {
            setInputPage(value); // Update input page number
        }
    };

    const goToPage = () => {
        if (inputPage > 0 && inputPage <= totalPages) {
            handlePageChange(inputPage); // Navigate to the entered page
        }
    };

    // Intersection Observer to detect when to load more books
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        };

        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                loadMoreBooks(); // Load more books when the last book is in view
            }
        };

        const observerInstance = new IntersectionObserver(callback, options);
        if (observer.current) {
            observerInstance.observe(observer.current);
        }

        return () => {
            if (observer.current) {
                observerInstance.unobserve(observer.current);
            }
        };
    }, [observer, searchTerm]); // Re-run when searchTerm changes

    const loadMoreBooks = () => {
        if (searchTerm) {
            setPage(prevPage => prevPage + 1); // Increment page number
            fetchSearchResults(searchTerm, page + 1); // Fetch next page of search results
        }
    };

    return (
        <div className="home">
            <h1 className="featured-header">Featured Books</h1>
            <div className="search-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search for books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            {loading ? ( // Show loading spinner while fetching
                <LoadingSpinner />
            ) : (
                <div className="book-list">
                    {books && books.length > 0 ? (
                        books.map((book) => (
                            <BookCard key={book.id} book={book} /> // Use the BookCard component
                        ))
                    ) : (
                        <p>No books found.</p> // Message when no books are available
                    )}
                    <div ref={observer} /> {/* This div will be observed for scrolling */}
                </div>
            )}
            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
            <div className="pagination-controls">
                <input
                    type="number"
                    value={inputPage}
                    onChange={handleInputPageChange}
                    min="1"
                    max={totalPages}
                    placeholder="Page number"
                />
                <button onClick={goToPage}>Go</button>
            </div>
        </div>
    );
};

export default Home;