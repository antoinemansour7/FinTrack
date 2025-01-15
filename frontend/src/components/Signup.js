import React, { useState } from 'react';
import axios from 'axios';
import '../styling/Signup.css'; // Ensure this path is correct for the CSS file

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
        <div className="signup-container">
            <h2 className="signup-title">Signup</h2>
            <form onSubmit={handleSignup} className="signup-form">
                <div className="input-group">
                    <label htmlFor="username" className="input-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="signup-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="signup-input"
                    />
                </div>
                <button type="submit" className="signup-button">Signup</button>
            </form>
            {message && (
                <p className={`signup-message ${message.includes("successful") ? "success" : "error"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Signup;