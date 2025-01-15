import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './styling/App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import logo from './logo.jpg'; // Import your logo

function App() {
    const renderLandingPage = () => (
        <div className="landing-page">
            {/* Left Section */}
            <div className="landing-left">
                <div className="logo-container">
                    <img src={logo} alt="FinTrack Logo" className="normal-logo" />
                </div>
                <h1 className="landing-title">FinTrack</h1>
                <p className="landing-description">
                    Master your financial future with FinTrack. Track expenses, set goals, and gain insights to achieve financial freedom!
                </p>

                <h2 className="section-title">Why Choose FinTrack?</h2>
                <div className="features-grid">
                    <div className="feature-box">
                        <h3>Smart Expense Tracking</h3>
                        <p>Automatically categorize and analyze your spending patterns.</p>
                    </div>
                    <div className="feature-box">
                        <h3>Secure Banking Integration</h3>
                        <p>Seamlessly connect your bank account with military-grade security.</p>
                    </div>
                    <div className="feature-box">
                        <h3>Custom Financial Goal Setting</h3>
                        <p>Create and track custom financial goals to suit your needs.</p>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="landing-right">
                <div className="dynamic-diagram">[Dynamic Diagrams Placeholder]</div>
                <div className="landing-buttons">
                    <Link to="/signup" className="primary-button">Get Started</Link>
                    <Link to="/login" className="secondary-button">Sign In</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <main className="main-content">
                <Routes>
                    <Route path="/" element={renderLandingPage()} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <footer className="app-footer">
                <p className="faq-text">FAQs</p>
            </footer>
        </div>
    );
}

export default App;