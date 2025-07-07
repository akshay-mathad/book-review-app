import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import BookCard from '../components/BookCard'; // Import the BookCard component
import '../styles/Home.css'; // Import custom styles for Home

const Home = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Main loading state
    const [searchLoading, setSearchLoading] = useState(false); // Search button loading
    const [paginationLoading, setPaginationLoading] = useState(false); // Pagination loading
    const [goToPageLoading, setGoToPageLoading] = useState(false); // Go to page loading
    const [page, setPage] = useState(1); // Current page for search results
    const [totalPages, setTotalPages] = useState(0); // Total pages for search results
    const [inputPage, setInputPage] = useState(1); // State for page number input
    const [error, setError] = useState(''); // Error state
    const observer = useRef(); // Reference for the Intersection Observer

    useEffect(() => {
        fetchFeaturedBooks(); // Fetch featured books on component mount
    }, []); // Fetch books only once on component mount

    const fetchFeaturedBooks = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10&startIndex=${(page - 1) * 10}`);
            setBooks(response.data.items || []);
            setTotalPages(Math.ceil((response.data.totalItems || 0) / 10));
        } catch (error) {
            console.error('Error fetching featured books:', error);
            setError('Failed to load books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchResults = async (searchTerm, page, isPagination = false) => {
        try {
            if (isPagination) {
                setPaginationLoading(true);
            } else {
                setLoading(true);
            }
            setError('');
            
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=10&startIndex=${(page - 1) * 10}`);
            setBooks(response.data.items || []);
            setTotalPages(Math.ceil((response.data.totalItems || 0) / 10));
        } catch (error) {
            console.error('Error searching books:', error);
            setError('Search failed. Please try again.');
        } finally {
            if (isPagination) {
                setPaginationLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setError('Please enter a search term');
            return;
        }
        
        setSearchLoading(true);
        setPage(1);
        setInputPage(1);
        
        try {
            await fetchSearchResults(searchTerm, 1);
        } finally {
            setSearchLoading(false);
        }
    };

    const handlePageChange = async (newPage) => {
        if (newPage < 1 || newPage > totalPages || paginationLoading) return;
        
        setPage(newPage);
        setInputPage(newPage);
        
        if (searchTerm) {
            await fetchSearchResults(searchTerm, newPage, true);
        } else {
            setPaginationLoading(true);
            try {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10&startIndex=${(newPage - 1) * 10}`);
                setBooks(response.data.items || []);
            } catch (error) {
                console.error('Error fetching page:', error);
                setError('Failed to load page. Please try again.');
            } finally {
                setPaginationLoading(false);
            }
        }
    };

    const handleInputPageChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setInputPage(value);
        }
    };

    const goToPage = async () => {
        if (inputPage < 1 || inputPage > totalPages || goToPageLoading) return;
        
        setGoToPageLoading(true);
        try {
            await handlePageChange(inputPage);
        } finally {
            setGoToPageLoading(false);
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
            if (entries[0].isIntersecting && !loading && !paginationLoading) {
                loadMoreBooks();
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
    }, [observer, searchTerm, loading, paginationLoading]);

    const loadMoreBooks = () => {
        if (searchTerm && page < totalPages) {
            handlePageChange(page + 1);
        }
    };

    return (
        <div className="home">
            <h1 className="featured-header"><b>BOOKS</b></h1>
            
            {error && (
                <div className="error" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {error}
                    <button 
                        onClick={() => setError('')} 
                        style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="search-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search for books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={searchLoading || loading}
                    />
                    <button 
                        type="submit" 
                        disabled={searchLoading || loading || !searchTerm.trim()}
                    >
                        {searchLoading ? (
                            <>
                                <span style={{ marginRight: '0.5rem' }}>🔄</span>
                                Searching...
                            </>
                        ) : (
                            'Search'
                        )}
                    </button>
                </form>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="book-list">
                    {books && books.length > 0 ? (
                        books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))
                    ) : (
                        <p>No books found.</p>
                    )}
                    <div ref={observer} />
                </div>
            )}

            {paginationLoading && (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <LoadingSpinner />
                    <p>Loading page...</p>
                </div>
            )}

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1 || paginationLoading || loading}
                >
                    {paginationLoading && page > 1 ? '⏳' : ''} Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === totalPages || paginationLoading || loading}
                >
                    Next {paginationLoading && page < totalPages ? '⏳' : ''}
                </button>
            </div>

            <div className="pagination-controls">
                <input
                    type="number"
                    value={inputPage}
                    onChange={handleInputPageChange}
                    min="1"
                    max={totalPages}
                    placeholder="Page number"
                    disabled={goToPageLoading || loading}
                />
                <button 
                    onClick={goToPage}
                    disabled={goToPageLoading || loading || inputPage < 1 || inputPage > totalPages}
                >
                    {goToPageLoading ? (
                        <>
                            <span style={{ marginRight: '0.5rem' }}>🔄</span>
                            Going...
                        </>
                    ) : (
                        'Go'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Home;