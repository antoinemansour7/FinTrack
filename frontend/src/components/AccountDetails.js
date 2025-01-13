import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AccountDetails = () => {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const userId = localStorage.getItem('userId'); // Get the userId from localStorage
                const response = await axios.get('http://localhost:3000/api/plaid/accounts', {
                    params: { userId },
                });
                setAccounts(response.data); // Update the state with account data
            } catch (error) {
                setError('Failed to fetch account details');
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

    return (
        <div className="account-details-container">
            <h2>Bank Accounts</h2>
            {error && <p className="error-message">{error}</p>}
            <ul>
                {accounts.map((account) => (
                    <li key={account.account_id} className="account-item">
                        <h3>{account.name}</h3>
                        <p>Type: {account.subtype}</p>
                        <p>Balance: ${account.balances.available || account.balances.current}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccountDetails;