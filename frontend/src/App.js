import React, { useState } from 'react';
import './styling/App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home'; // Import Home component
import logo from './logo.jpg'; // Import your logo
import { useNavigate, Routes, Route } from 'react-router-dom';

function App() {
    const [activeComponent, setActiveComponent] = useState(null); // Manage active component
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/home'); // Redirect to home on successful login
    };

    const renderLandingPage = () => (
        <div className="landing-page">
            {/* Left Section */}
            <div className="landing-left">
                <div className="logo-title-container">
                    <img src={logo} alt="FinTrack Logo" className="normal-logo" />
                    <h1 className="landing-title">FinTrack</h1>
                </div>
                <p className="landing-description">
                    Take control of your finances with intelligent tracking, 
                    smart insights, and personalized recommendations.
                </p>

                <h2 className="section-title">Why Choose FinTrack?</h2>
                <div className="features-grid">
                    <div className="feature-box">
                        <h3>Expense Tracking</h3>
                        <p>Monitor and categorize your spending automatically</p>
                    </div>
                    <div className="feature-box">
                        <h3>Banking Security</h3>
                        <p>Bank-level encryption keeps your data safe</p>
                    </div>
                    <div className="feature-box">
                        <h3>Smart Goals</h3>
                        <p>Set and achieve your financial milestones</p>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="landing-right">
                <div className="landing-buttons">
                    <button
                        onClick={() => setActiveComponent('signup')}
                        className={`primary-button ${activeComponent === 'signup' ? 'button-active' : 'button-inactive'}`}
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => setActiveComponent('login')}
                        className={`secondary-button ${activeComponent === 'login' ? 'button-active' : 'button-inactive'}`}
                    >
                        Sign In
                    </button>
                </div>
                <div className="active-component-container">
                    {activeComponent === 'signup' && <Signup />}
                    {activeComponent === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
                </div>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <main className="main-content">
                <Routes>
                    <Route path="/" element={renderLandingPage()} />
                    <Route path="/home" element={<Home />} /> {/* Add Home Route */}
                </Routes>
            </main>
            <footer className="app-footer">
                <p className="faq-text">FAQs</p>
            </footer>
        </div>
    );
}

export default App;