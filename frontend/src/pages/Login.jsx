import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URI}/auth/login`, { email, password });
            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.token); // Store the token
            setErrorMessage('');
            navigate('/profile'); // Redirect to profile page after successful login
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response) {
                setErrorMessage(error.response.data.message); // Set error message from response
            } else {
                setErrorMessage('An error occurred. Please try again.'); // Generic error message
            }
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message */}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;