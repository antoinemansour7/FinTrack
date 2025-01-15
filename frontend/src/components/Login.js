import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styling/Login.css'; // Updated to match the new file path

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                username,
                password,
            });
            const { token, userId } = response.data; // Extract userId from backend response
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId); // Save userId to localStorage
            setMessage({ text: "Login successful!", type: "success" });
            navigate('/home'); // Redirect to homepage
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || "Invalid credentials", 
                type: "error" 
            });
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome Back</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label className="input-label">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Sign In
                </button>
            </form>
            {message && (
                <p className={`login-message ${message.type}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default Login;