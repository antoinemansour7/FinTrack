import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
    const location = useLocation(); // Get the current route

    return (
        <div className="app-container">
            {/* Conditionally render the header only on the root route */}
            {location.pathname === '/' && (
                <header className="app-header">
                    <h1 className="app-title">FinTrack</h1>
                    <p className="app-motto">"Track your finances, achieve your goals"</p>
                </header>
            )}
            <main>
                <Routes>
                    {/* Root Route - Landing Page */}
                    <Route
                        path="/"
                        element={
                            <div className="landing-page">
                                <div className="landing-buttons">
                                    <button className="landing-button">
                                        <Link to="/signup" className="landing-link">
                                            Signup
                                        </Link>
                                    </button>
                                    <button className="landing-button">
                                        <Link to="/login" className="landing-link">
                                            Login
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        }
                    />
                    {/* Additional Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App;