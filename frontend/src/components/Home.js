import React, { useEffect, useState, useRef } from 'react';
import PlaidLinkComponent from './PlaidLinkComponent';
import AccountDetails from './AccountDetails';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [displayedTransactions, setDisplayedTransactions] = useState(10);
    const transactionRef = useRef(null);
    const [error, setError] = useState('');

    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('userId'); // Remove userId
        navigate('/'); // Redirect to login
    };

    const formatAmount = (amount, type = 'neutral') => {
        const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return (
            <span className={`amount ${type}`}>
                {amount < 0 ? '- ' + formattedAmount : formattedAmount}
            </span>
        );
    };

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && displayedTransactions < transactions.length) {
            setDisplayedTransactions(prev => prev + 10);
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not authenticated');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/plaid/transactions?userId=${userId}`);
                setTransactions(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch transactions');
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-content">
                    <h1 className="dashboard-logo">FinTrack</h1>
                    <button onClick={handleSignOut} className="signout-button">
                        <i className="fas fa-sign-out-alt"></i>
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <div className="welcome-text">
                        <h2 className="section-title">Your Financial Overview</h2>
                        <p>Track your wealth, achieve your goals</p>
                    </div>
                    <div className="plaid-link-wrapper">
                        <PlaidLinkComponent />
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card feature-box">
                        <div className="stat-header">
                            <i className="fas fa-wallet"></i>
                            <h3 className="section-title">Total Balance</h3>
                        </div>
                        <AccountDetails view="total" />
                    </div>
                    
                    <div className="stat-card feature-box">
    <div className="stat-header">
        <i className="fas fa-chart-line"></i>
        <h3 className="section-title">Recent Activity</h3>
    </div>
    <div className="transactions-container" onScroll={handleScroll} ref={transactionRef}>
        {transactions.length > 0 ? (
            <div className="transactions-list">
                {transactions.slice(0, displayedTransactions).map((transaction) => (
                    <div key={transaction.transaction_id} className="transaction-item">
                        <div className="transaction-icon">
                            {transaction.logo_url ? (
                                <img
                                    src={transaction.logo_url}
                                    alt={transaction.name}
                                    className="transaction-logo"
                                />
                            ) : (
                                <i
                                    className={`fas ${
                                        transaction.amount < 0
                                            ? 'fa-arrow-down expense'
                                            : 'fa-arrow-up income'
                                    }`}
                                ></i>
                            )}
                        </div>
                        <div className="transaction-details">
                            <p className="transaction-name">{transaction.name}</p>
                            <p className="transaction-date">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        <div className="transaction-amount">
                            {transaction.amount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: transaction.iso_currency_code || 'USD',
                            })}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="empty-state">
                <i className="fas fa-receipt"></i>
                <p>{error || 'No transactions yet'}</p>
            </div>
        )}
    </div>
</div>
                </div>

                <div className="accounts-section feature-box">
                    <div className="section-header">
                        <div className="header-title">
                            <i className="fas fa-university"></i>
                            <h3 className="section-title">Connected Accounts</h3>
                        </div>
                    </div>
                    <div className="accounts-grid">
                        <AccountDetails view="detailed" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;