import React, { useState } from 'react';
import './styling/App.css';
import Signup from './components/Signup';
import Chat from './components/Chat';
import Login from './components/Login';
import Home from './components/Home';
import logo from './logo.jpg';
import { useNavigate, Routes, Route } from 'react-router-dom';
import FinancialInsights from './components/FinancialInsights';
import PrivateRoute from './components/PrivateRoute';
import Insights from './components/Insights';  // Add this import
import Budgets from './components/Budgets';    // Add this import

function App() {
    const [activeComponent, setActiveComponent] = useState(null);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/home');
    };

    const toggleChat = () => {
        setIsChatVisible((prev) => !prev);
    };

    const renderLandingPage = () => (
        <div className="landing-page">
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
                        <p>Monitor and categorize your spending automatically.</p>
                    </div>
                    <div className="feature-box">
                        <h3>Banking Security</h3>
                        <p>Bank-level encryption keeps your data safe.</p>
                    </div>
                    <div className="feature-box">
                        <h3>Smart Goals</h3>
                        <p>Set and achieve your financial milestones.</p>
                    </div>
                    <div className="feature-box">
                        <h3>AI Assistant</h3>
                        <p>Get personalized financial advice with our AI chat assistant.</p>
                    </div>
                </div>
            </div>

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
                    <Route path="/home" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route path="/insights" element={
                        <PrivateRoute>
                            <Insights />
                        </PrivateRoute>
                    } />
                    <Route path="/budgets" element={
                        <PrivateRoute>
                            <Budgets />
                        </PrivateRoute>
                    } />
                </Routes>
            </main>
            <footer className="app-footer">
                <p className="faq-text">FAQs</p>
            </footer>

            {/* Chat Icon and Chat Component */}
            <div className="chat-icon" onClick={toggleChat}>
                💬
            </div>
            {isChatVisible && <Chat />}
        </div>
    );
}

export default App;