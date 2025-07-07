import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'error' or 'success'
    
    const navigate = useNavigate();
    const { signup, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        if (!username || !email || !password || !confirmPassword) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            return false;
        }

        if (username.length < 3) {
            setMessage('Username must be at least 3 characters long');
            setMessageType('error');
            return false;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setMessageType('error');
            return false;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return false;
        }

        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await signup(username, email, password);
        
        if (result.success) {
            setMessage(result.message);
            setMessageType('success');
            // Redirect to login after successful signup
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setMessage(result.message);
            setMessageType('error');
        }
        
        setLoading(false);
    };

    return (
        <div className="signup">
            <h1>Create Your Account</h1>
            
            {message && (
                <div className={messageType === 'error' ? 'error' : 'success'}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSignup}>
                <input 
                    type="text" 
                    placeholder="Username (min 3 characters)" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    disabled={loading}
                    minLength={3}
                />
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
                    placeholder="Password (min 6 characters)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={loading}
                    minLength={6}
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Signup;