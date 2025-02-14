import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                if (error.response) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URI}/auth/profile`, { username, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile">
            <h1>User Profile</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handleUpdateProfile}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;