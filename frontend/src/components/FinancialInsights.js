import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styling/FinancialInsights.css';

const FinancialInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBudget, setNewBudget] = useState({ category: '', amount: '' });

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(
                `http://localhost:3000/api/insights/insights?userId=${userId}`
            );
            setInsights(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load insights');
            setLoading(false);
        }
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            await axios.post('http://localhost:3000/api/insights/budgets', {
                userId,
                ...newBudget,
                amount: Number(newBudget.amount)
            });
            setNewBudget({ category: '', amount: '' });
            fetchInsights(); // Refresh insights
        } catch (err) {
            setError('Failed to set budget');
        }
    };

    if (loading) return <div className="loading">Loading insights...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!insights) return null;

    return (
        <div className="insights-container">
            <section className="insights-section">
                <h3>Spending Insights</h3>
                <div className="insights-grid">
                    {insights.spendingInsights.map((insight, index) => (
                        <div key={index} className="insight-card">
                            <i className={`fas fa-chart-line ${insight.changePercent > 0 ? 'increase' : 'decrease'}`} />
                            <p>{insight.message}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="insights-section">
                <h3>Savings Opportunities</h3>
                <div className="insights-grid">
                    {insights.savingsRecommendations.map((rec, index) => (
                        <div key={index} className="insight-card">
                            <i className="fas fa-piggy-bank" />
                            <p>{rec.message}</p>
                            <p className="recommendation">{rec.suggestion}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="insights-section">
                <h3>Budget Status</h3>
                <div className="budgets-grid">
                    {insights.budgetStatus.map((budget, index) => (
                        <div key={index} className={`budget-card ${budget.status}`}>
                            <h4>{budget.category}</h4>
                            <div className="progress-bar">
                                <div 
                                    className="progress" 
                                    style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                                />
                            </div>
                            <p>{budget.message}</p>
                            <p className="budget-details">
                                Spent: ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="insights-section">
                <h3>Set New Budget</h3>
                <form onSubmit={handleBudgetSubmit} className="budget-form">
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={newBudget.category}
                            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={newBudget.amount}
                            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="primary-button">Set Budget</button>
                </form>
            </section>
        </div>
    );
};

export default FinancialInsights;
