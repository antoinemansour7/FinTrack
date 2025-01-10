const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config(); // Load environment variables

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV], // sandbox, development, or production
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, // Use the Client ID from .env
            'PLAID-SECRET': process.env.PLAID_SECRET,       // Use the Secret from .env
        },
    },
});

const plaidClient = new PlaidApi(configuration);

module.exports = plaidClient;