const moment = require('moment');

class FinancialInsightsService {
    static analyzeSpending(transactions) {
        return [{
            message: "Here's your spending overview",
            changePercent: 0
        }];
    }

    static generateSavingsRecommendations(transactions, monthlyIncome) {
        return [{
            message: "Savings Opportunity Found",
            suggestion: "Start tracking your expenses to identify savings opportunities"
        }];
    }

    static checkBudgetStatus(transactions, budgets) {
        return budgets.map(budget => ({
            category: budget.category,
            status: 'on-track',
            percentUsed: 0,
            spent: 0,
            budgeted: budget.amount,
            message: "Budget tracking started"
        }));
    }
}

module.exports = FinancialInsightsService;
