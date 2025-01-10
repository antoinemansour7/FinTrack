import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './components/Signup';
import Login from './components/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
);