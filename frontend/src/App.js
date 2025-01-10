import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import PlaidLinkComponent from './components/PlaidLinkComponent';
import Home from './components/Home'; // Import Home component

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
                                    <Link to="/signup" className="landing-link">Signup</Link>
                                    <Link to="/login" className="landing-link">Login</Link>
                                </div>
                            </div>
                        }
                    />
                    {/* Additional Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/plaid-link" element={<PlaidLinkComponent />} />
                    <Route path="/home" element={<Home />} /> {/* Add Home route */}
                </Routes>
            </main>
        </div>
    );
}

export default App;