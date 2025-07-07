import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout, loading } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <nav>
                <div className="nav-container">
                    <Link to="/" className="nav-brand">Book Reviews</Link>
                    <div className="nav-loading">Loading...</div>
                </div>
            </nav>
        );
    }

    return (
        <nav>
            <div className="nav-container">
                <Link to="/" className="nav-brand">Book Reviews</Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    {!isAuthenticated ? (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/profile">Profile</Link></li>
                            <li>
                                <span className="user-welcome">Welcome, {user?.username || 'User'}!</span>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    className="logout-btn"
                                    title="Logout"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;