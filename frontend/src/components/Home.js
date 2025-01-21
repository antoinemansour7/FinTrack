import React, { useEffect, useState, useRef } from 'react';
import Layout from './Layout';
import PlaidLinkComponent from './PlaidLinkComponent';
import AccountDetails from './AccountDetails';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Home.css';
import { Link } from 'react-router-dom';

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
        <Layout>
            <div className="dashboard-grid">
                <div className="welcome-section">
                    <h1>Welcome Back</h1>
                    <p>Here's your financial overview</p>
                </div>

                <div className="quick-stats">
                    <div className="stat-card">
                        <AccountDetails view="total" />
                    </div>
                </div>

                <div className="main-grid">
                    <div className="transactions-card">
                        <div className="card-header">
                            <h2>Recent Transactions</h2>
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

                    <div className="accounts-card">
                        <div className="card-header">
                            <h2>Connected Accounts</h2>
                            <PlaidLinkComponent />
                        </div>
                        <AccountDetails view="detailed" />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;