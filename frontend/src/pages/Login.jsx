import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'error' or 'success'
    
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Basic validation
        if (!email || !password) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            setLoading(false);
            return;
        }

        const result = await login(email, password);
        
        if (result.success) {
            setMessage('Login successful! Redirecting...');
            setMessageType('success');
            // Navigation will happen automatically due to useEffect
            setTimeout(() => navigate('/profile'), 1000);
        } else {
            setMessage(result.message);
            setMessageType('error');
        }
        
        setLoading(false);
    };

    return (
        <div className="login">
            <h1>Login to Your Account</h1>
            
            {message && (
                <div className={messageType === 'error' ? 'error' : 'success'}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;