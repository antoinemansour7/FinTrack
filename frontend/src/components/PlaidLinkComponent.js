import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLinkComponent = () => {
    const [linkToken, setLinkToken] = useState(null);

    // Fetch link_token from your backend
    useEffect(() => {
        axios.post('http://localhost:3000/api/plaid/link-token', {
            userId: 'unique_user_id', // Replace with actual user ID
        })
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
            // Send publicToken to your backend to exchange for access_token
            axios.post('http://localhost:3000/api/plaid/exchange-public-token', {
                public_token: publicToken,
                userId: 'unique_user_id', // Replace with actual user ID
            })
            .then((response) => {
                console.log('Access Token and Item ID:', response.data);
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