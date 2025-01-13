import React from 'react';
import PlaidLinkComponent from './PlaidLinkComponent'; // Import PlaidLinkComponent
import { useNavigate } from 'react-router-dom'; // For navigation

const Home = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="home-container">
            <h1>Welcome to FinTrack!</h1>
            <p>Connect your bank account to track your finances easily.</p>
            {/* Add the PlaidLinkComponent here */}
            <div className="plaid-link-container">
                <PlaidLinkComponent />
            </div>
            {/* Sign Out Button */}
            <button onClick={handleSignOut} className="signout-button">
                Sign Out
            </button>
        </div>
    );
};

export default Home;