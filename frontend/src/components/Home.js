import React from 'react';
import PlaidLinkComponent from './PlaidLinkComponent'; // Import PlaidLinkComponent
import AccountDetails from './AccountDetails'; // Import AccountDetails
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('userId'); // Remove userId
        navigate('/login'); // Redirect to login
    };

    return (
        <div className="home-container">
            <h1>Welcome to FinTrack!</h1>
            <p>Connect your bank account to track your finances easily.</p>
            <div className="plaid-link-container">
                <PlaidLinkComponent />
            </div>
            <AccountDetails /> {/* Display bank account details */}
            <button onClick={handleSignOut} className="signout-button">
                Sign Out
            </button>
        </div>
    );
};

export default Home;