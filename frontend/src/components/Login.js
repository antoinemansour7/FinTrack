import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // New CSS file for shared styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });
            setMessage("Login successful!");
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="auth-form">
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
                <button type="submit" className="auth-button">Login</button>
            </form>
            <p className="auth-message">{message}</p>
        </div>
    );
};

export default Login;