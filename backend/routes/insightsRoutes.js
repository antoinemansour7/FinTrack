const express = require('express');
const router = express.Router();
const FinancialInsightsService = require('../services/financialInsights');
const User = require('../models/User');
const plaidClient = require('../config/plaid');

router.get('/insights', async (req, res) => {
    const { userId } = req.query;

    try {
        // Temporary mock data until Plaid integration is complete
        const mockInsights = {
            spendingInsights: [
                { message: "Your spending is on track", changePercent: 0 }
            ],
            savingsRecommendations: [
                { message: "Potential savings found", suggestion: "Track your expenses" }
            ],
            budgetStatus: [
                {
                    category: "General",
                    status: "on-track",
                    percentUsed: 0,
                    spent: 0,
                    budgeted: 1000,
                    message: "Budget tracking started"
                }
            ]
        };

        res.json(mockInsights);
    } catch (error) {
        console.error('Error generating insights:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

router.post('/budgets', async (req, res) => {
    const { userId, category, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add or update budget
        if (!user.budgets) user.budgets = [];
        const existingBudgetIndex = user.budgets.findIndex(b => b.category === category);
        
        if (existingBudgetIndex >= 0) {
            user.budgets[existingBudgetIndex].amount = amount;
        } else {
            user.budgets.push({ category, amount });
        }

        await user.save();
        res.json(user.budgets);

    } catch (error) {
        console.error('Error setting budget:', error);
        res.status(500).json({ error: 'Failed to set budget' });
    }
});

module.exports = router;
