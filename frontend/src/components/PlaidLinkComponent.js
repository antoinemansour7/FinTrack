import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLinkComponent = () => {
    const [linkToken, setLinkToken] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage
        axios
            .post('http://localhost:3000/api/plaid/link-token', { userId })
            .then((response) => {
                setLinkToken(response.data.link_token);
            })
            .catch((error) => {
                console.error('Error fetching link token:', error);
            });
    }, []);

    const { open, ready } = usePlaidLink({
        token: linkToken, // The link_token from your backend
        onSuccess: (publicToken, metadata) => {
            console.log('Public Token:', publicToken);
    
            // Retrieve userId from localStorage
            const userId = localStorage.getItem('userId');
    
            // Send publicToken and userId to your backend
            axios.post('http://localhost:3000/api/plaid/exchange-public-token', {
                public_token: publicToken,
                userId: userId, // Use actual user ID from localStorage
            })
            .then((response) => {
                console.log('Access Token and Item ID:', response.data);
    
                // Optional: Store access_token for future use, if needed
                localStorage.setItem('plaidAccessToken', response.data.access_token);
            })
            .catch((error) => {
                console.error('Error exchanging public token:', error);
            });
        },
    });

    return (
        <div>
            {linkToken ? (
                <button onClick={() => open()} disabled={!ready}>
                    Connect Bank Account
                </button>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PlaidLinkComponent;