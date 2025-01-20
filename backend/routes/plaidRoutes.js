const express = require('express');
const plaidClient = require('../config/plaid'); // Import Plaid client configuration
const User = require('../models/User'); // Import User model if needed

const router = express.Router();

router.post('/exchange-public-token', async (req, res) => {
    const { public_token, userId } = req.body;

    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token, // Exchange the public token with Plaid
        });

        const plaidAccessToken = response.data.access_token;
        const plaidItemId = response.data.item_id;

        console.log('Access Token:', plaidAccessToken);
        console.log('Item ID:', plaidItemId);

        // Update the user's document in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                plaidAccessToken,
                plaidItemId,
            },
            { new: true } // Return the updated document after the update
        );

        console.log("Updated User:", updatedUser);

        // Respond with the tokens or success message
        res.json({ access_token: plaidAccessToken, item_id: plaidItemId });
    } catch (error) {
        console.error("Error exchanging public token:", error.response?.data || error);
        res.status(500).json({ error: "Failed to exchange public token" });
    }
});


router.post('/link-token', async (req, res) => {
    const { userId } = req.body; // Assume the frontend sends the userId

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: userId, // Use the userId from the request
            },
            client_name: 'FinTrack', // Your app's name
            products: ['auth', 'transactions'], // Specify Plaid products
            country_codes: ['US'], // Supported country codes
            language: 'en', // Language preference
        });

        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error('Error creating link token:', error.response?.data || error);
        res.status(500).json({ error: 'Failed to create link token' });
    }
});


router.get('/accounts', async (req, res) => {
    const { userId } = req.query; // Get userId from query parameters

    try {
        const user = await User.findById(userId);
        if (!user || !user.plaidAccessToken) {
            return res.status(404).json({ error: 'User or access token not found' });
        }

        const response = await plaidClient.accountsGet({
            access_token: user.plaidAccessToken,
        });

        res.json(response.data.accounts); // Return account data to the frontend
    } catch (error) {
        console.error('Error fetching accounts:', error.response?.data || error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});


router.get('/transactions', async (req, res) => {
    const { userId, startDate, endDate } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user || !user.plaidAccessToken) {
            return res.status(404).json({ error: 'User or access token not found' });
        }

        // Fetch transactions from Plaid
        const response = await plaidClient.transactionsGet({
            access_token: user.plaidAccessToken,
            start_date: startDate || '2023-01-01', // Provide default start date if not specified
            end_date: endDate || new Date().toISOString().split('T')[0], // Default to today's date
            options: {
                count: 100, // Limit to 100 transactions
                offset: 0, // Start from the first transaction
            },
        });

        // Map transactions to include only relevant fields, including logo_url
        const transactions = response.data.transactions.map((transaction) => ({
            transaction_id: transaction.transaction_id,
            name: transaction.name,
            date: transaction.date,
            amount: transaction.amount,
            logo_url: transaction.logo_url, // Add logo URL
            iso_currency_code: transaction.iso_currency_code,
        }));

        res.json(transactions); // Return transactions to the frontend
    } catch (error) {
        console.error('Error fetching transactions:', error.response?.data || error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;

