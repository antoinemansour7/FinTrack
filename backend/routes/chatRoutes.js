const OpenAI = require('openai');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const plaidClient = require('../config/plaid');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Helper function to analyze financial data
const analyzeFinancialData = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.plaidAccessToken) return null;

        // Get transactions
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endDate = now.toISOString().split('T')[0];

        const transactionsResponse = await plaidClient.transactionsGet({
            access_token: user.plaidAccessToken,
            start_date: startDate,
            end_date: endDate
        });

        const transactions = transactionsResponse.data.transactions;

        // Get accounts
        const accountsResponse = await plaidClient.accountsGet({
            access_token: user.plaidAccessToken
        });

        const accounts = accountsResponse.data.accounts;

        // Calculate key metrics
        const totalBalance = accounts.reduce((sum, account) => sum + account.balances.current, 0);
        const monthlySpending = transactions.reduce((sum, trans) => sum + (trans.amount > 0 ? trans.amount : 0), 0);
        const monthlyIncome = transactions.reduce((sum, trans) => sum + (trans.amount < 0 ? Math.abs(trans.amount) : 0), 0);

        // Categorize spending
        const categories = transactions.reduce((acc, trans) => {
            if (trans.amount > 0) {
                const category = trans.category?.[0] || 'Other';
                acc[category] = (acc[category] || 0) + trans.amount;
            }
            return acc;
        }, {});

        return {
            totalBalance,
            monthlySpending,
            monthlyIncome,
            categories,
            transactions: transactions.slice(0, 10), // Last 10 transactions
            accountCount: accounts.length
        };
    } catch (error) {
        console.error('Error analyzing financial data:', error);
        return null;
    }
};

router.post('/chat', async (req, res) => {
    const { message, userId } = req.body;

    try {
        let systemMessage = {
            role: 'system',
            content: 'You are the FinTrack assistant. Your role is to help users manage their finances by answering questions about financial tracking, budgeting, and app usage.'
        };

        let context = '';

        // If userId is provided, get personalized financial data
        if (userId) {
            const financialData = await analyzeFinancialData(userId);
            if (financialData) {
                context = `
                    User's current financial status:
                    - Total balance across accounts: $${financialData.totalBalance.toFixed(2)}
                    - This month's spending: $${financialData.monthlySpending.toFixed(2)}
                    - This month's income: $${financialData.monthlyIncome.toFixed(2)}
                    - Number of connected accounts: ${financialData.accountCount}
                    - Top spending categories: ${Object.entries(financialData.categories)
                        .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)}`)
                        .join(', ')}
                    - Recent transactions: ${financialData.transactions
                        .map(t => `${t.name}: $${t.amount.toFixed(2)}`)
                        .join(', ')}
                `;
                systemMessage.content += ` You have access to the user's financial data. ${context}`;
            }
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                systemMessage,
                { role: 'user', content: message }
            ],
        });

        const reply = response.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: 'Failed to process chat request.' });
    }
});

module.exports = router;

