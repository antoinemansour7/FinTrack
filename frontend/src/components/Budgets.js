import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import '../styling/Budgets.css';

const Budgets = () => {
    const [budgets, setBudgets] = useState({
        'Food & Dining': { limit: 500, spent: 0 },
        'Shopping': { limit: 300, spent: 0 },
        'Transportation': { limit: 200, spent: 0 },
        'Entertainment': { limit: 150, spent: 0 },
        'Bills & Utilities': { limit: 1000, spent: 0 }
    });

    useEffect(() => {
        const calculateSpending = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3000/api/plaid/transactions?userId=${userId}`);
                
                const currentMonth = new Date().getMonth();
                const monthlyTransactions = response.data.filter(tx => 
                    new Date(tx.date).getMonth() === currentMonth
                );

                const newBudgets = { ...budgets };
                monthlyTransactions.forEach(tx => {
                    const category = tx.category?.[0] || 'Other';
                    if (newBudgets[category]) {
                        newBudgets[category].spent += Math.abs(tx.amount);
                    }
                });

                setBudgets(newBudgets);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        calculateSpending();
    }, []);

    const handleUpdateBudget = (category, newLimit) => {
        setBudgets(prev => ({
            ...prev,
            [category]: { ...prev[category], limit: parseInt(newLimit) }
        }));
    };

    return (
        <Layout>
            <div className="budgets-container">
                <div className="budget-header">
                    <h1>Monthly Budgets</h1>
                    <p>Track your spending against monthly budget limits</p>
                </div>

                <div className="budget-grid">
                    {Object.entries(budgets).map(([category, { limit, spent }]) => (
                        <div key={category} className="budget-card">
                            <div className="budget-info">
                                <h3>{category}</h3>
                                <div className="budget-amount">
                                    <span>${spent.toFixed(2)}</span>
                                    <span className="limit">of ${limit}</span>
                                </div>
                            </div>
                            
                            <Progress 
                                percent={(spent/limit) * 100}
                                status={spent > limit ? "exception" : "active"}
                            />

                            <div className="budget-actions">
                                <input 
                                    type="number"
                                    value={limit}
                                    onChange={(e) => handleUpdateBudget(category, e.target.value)}
                                    className="budget-input"
                                />
                                <button className="update-btn">Update</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="budget-summary">
                    <h2>Budget Summary</h2>
                    <div className="summary-stats">
                        <div className="stat">
                            <h3>Total Budget</h3>
                            <p>${Object.values(budgets).reduce((acc, { limit }) => acc + limit, 0)}</p>
                        </div>
                        <div className="stat">
                            <h3>Total Spent</h3>
                            <p>${Object.values(budgets).reduce((acc, { spent }) => acc + spent, 0).toFixed(2)}</p>
                        </div>
                        <div className="stat">
                            <h3>Remaining</h3>
                            <p>${(
                                Object.values(budgets).reduce((acc, { limit }) => acc + limit, 0) -
                                Object.values(budgets).reduce((acc, { spent }) => acc + spent, 0)
                            ).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Budgets;
