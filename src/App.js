import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage'; // Make sure to import your HomePage
import Register from './components/Register';
import UserLogin from './components/UserLogin';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AddingBus from './components/AddingBus';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-login" element={<UserLogin />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/adding-bus" element={<AddingBus />} />
                <Route path="/select-seat" element={<SeatSelection />} />
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </Router>
    );
};

export default App;
