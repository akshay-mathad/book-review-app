import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
    const { user, updateProfile, loading: authLoading } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'error' or 'success'

    // Update form when user data changes
    React.useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const validateForm = () => {
        if (!username || !email) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            return false;
        }

        if (username.length < 3) {
            setMessage('Username must be at least 3 characters long');
            setMessageType('error');
            return false;
        }

        return true;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await updateProfile({ username, email });
        
        setMessage(result.message);
        setMessageType(result.success ? 'success' : 'error');
        setLoading(false);
    };

    const handleReset = () => {
        setUsername(user?.username || '');
        setEmail(user?.email || '');
        setMessage('');
    };

    if (authLoading || !user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh' 
            }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="profile">
            <h1>User Profile</h1>
            
            <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                border: '1px solid #dee2e6'
            }}>
                <h3>Account Information</h3>
                <p><strong>User ID:</strong> {user._id}</p>
                <p><strong>Account Created:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>

            {message && (
                <div className={messageType === 'error' ? 'error' : 'success'}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input 
                        id="username"
                        type="text" 
                        placeholder="Username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        disabled={loading}
                        minLength={3}
                    />
                </div>
                
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
                        id="email"
                        type="email" 
                        placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleReset}
                        disabled={loading}
                        style={{ backgroundColor: '#6c757d' }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;