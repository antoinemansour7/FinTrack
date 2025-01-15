import React, { useState } from 'react';
import axios from 'axios';
import '../styling/Auth.css'; // Adjust to the relative location of Auth.css

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', {
                username,
                password,
            });
            setMessage("Signup successful! Please login.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="auth-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                />
                <button type="submit" className="auth-button">Signup</button>
            </form>
            <p className="auth-message">{message}</p>
        </div>
    );
};

export default Signup;