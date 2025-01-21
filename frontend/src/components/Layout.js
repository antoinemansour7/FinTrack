import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styling/Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="app-layout">
            <header className="top-header">
                <div className="header-content">
                    <div className="left-section">
                        <h1 className="app-logo">FinTrack</h1>
                        <nav className="main-nav">
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                <i className="fas fa-home"></i>
                                Dashboard
                            </Link>
                            <Link to="/insights" className={`nav-link ${isActive('/insights') ? 'active' : ''}`}>
                                <i className="fas fa-chart-pie"></i>
                                Insights
                            </Link>
                            <Link to="/transactions" className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}>
                                <i className="fas fa-exchange-alt"></i>
                                Transactions
                            </Link>
                            <Link to="/budgets" className={`nav-link ${isActive('/budgets') ? 'active' : ''}`}>
                                <i className="fas fa-wallet"></i>
                                Budgets
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="right-section">
                        <div className="search-container">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className="notification-btn">
                            <i className="fas fa-bell"></i>
                        </button>
                        <div className="profile-section">
                            <button 
                                className="profile-btn" 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <img src="https://via.placeholder.com/32" alt="Profile" />
                                <span>John Doe</span>
                                <i className="fas fa-chevron-down"></i>
                            </button>
                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <a href="/profile"><i className="fas fa-user"></i> Profile</a>
                                    <a href="/settings"><i className="fas fa-cog"></i> Settings</a>
                                    <button onClick={handleSignOut}>
                                        <i className="fas fa-sign-out-alt"></i> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-container">
                {children}
            </main>
        </div>
    );
};

export default Layout;
