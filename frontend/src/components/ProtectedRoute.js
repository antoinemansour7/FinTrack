import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        // Save attempted path for redirect after login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Token exists, render protected content
    return children;
};

export default ProtectedRoute;