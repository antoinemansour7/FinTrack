const express = require('express');
const plaidClient = require('../config/plaid'); // Import Plaid client configuration
const User = require('../models/User'); // Import User model if needed

const router = express.Router();

router.post('/exchange-public-token', async (req, res) => {
    const { public_token, userId } = req.body;

    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const access_token = response.data.access_token;
        const item_id = response.data.item_id;

        console.log('Access Token:', access_token);
        console.log('Item ID:', item_id);

        // Save access_token and item_id to the database for the logged-in user
        await User.findByIdAndUpdate(userId, {
            plaidAccessToken: access_token,
            plaidItemId: item_id,
        });

        res.json({ access_token, item_id });
    } catch (error) {
        console.error('Error exchanging public token:', error.response?.data || error);
        res.status(500).json({ error: 'Failed to exchange public token' });
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
module.exports = router;