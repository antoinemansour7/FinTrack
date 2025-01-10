import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Link a CSS file for styling

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">FinTrack</h1>
                <p className="app-motto">"Track your finances, achieve your goals"</p>
            </header>
            <nav className="app-nav">
                <Link to="/signup" className="app-link">Signup</Link>
                <Link to="/login" className="app-link">Login</Link>
            </nav>
        </div>
    );
}

export default App;