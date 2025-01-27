import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2';
import '../styling/Insights.css';

const Insights = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorySpending, setCategorySpending] = useState({});
    const [monthlySpending, setMonthlySpending] = useState({});

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3000/api/plaid/transactions?userId=${userId}`);
                const txns = response.data;
                
                // Calculate category spending
                const categories = txns.reduce((acc, tx) => {
                    const category = tx.category?.[0] || 'Other';
                    acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
                    return acc;
                }, {});

                // Calculate monthly spending
                const monthly = txns.reduce((acc, tx) => {
                    const month = new Date(tx.date).toLocaleString('default', { month: 'long' });
                    acc[month] = (acc[month] || 0) + Math.abs(tx.amount);
                    return acc;
                }, {});

                setTransactions(txns);
                setCategorySpending(categories);
                setMonthlySpending(monthly);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const categoryChartData = {
        labels: Object.keys(categorySpending),
        datasets: [{
            data: Object.values(categorySpending),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
            ]
        }]
    };

    const monthlyChartData = {
        labels: Object.keys(monthlySpending),
        datasets: [{
            label: 'Monthly Spending',
            data: Object.values(monthlySpending),
            fill: false,
            borderColor: '#36A2EB',
            tension: 0.1
        }]
    };

    if (loading) return <Layout><div>Loading insights...</div></Layout>;

    return (
        <Layout>
            <div className="insights-container">
                <div className="insight-card">
                    <h2>Spending by Category</h2>
                    <div className="chart-container">
                        <Doughnut data={categoryChartData} />
                    </div>
                    <div className="insights-summary">
                        {Object.entries(categorySpending)
                            .sort(([,a], [,b]) => b - a)
                            .map(([category, amount]) => (
                                <div key={category} className="category-item">
                                    <span>{category}</span>
                                    <span>${amount.toFixed(2)}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="insight-card">
                    <h2>Monthly Spending Trends</h2>
                    <div className="chart-container">
                        <Line data={monthlyChartData} />
                    </div>
                </div>

                <div className="insight-card">
                    <h2>Key Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h3>Average Transaction</h3>
                            <p>${(transactions.reduce((acc, tx) => acc + Math.abs(tx.amount), 0) / transactions.length).toFixed(2)}</p>
                        </div>
                        <div className="stat-item">
                            <h3>Largest Expense</h3>
                            <p>${Math.max(...transactions.map(tx => Math.abs(tx.amount))).toFixed(2)}</p>
                        </div>
                        <div className="stat-item">
                            <h3>Total Transactions</h3>
                            <p>{transactions.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Insights;
