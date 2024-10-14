import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; 

const HomePage = () => {
    const navigate = useNavigate();

    const handleAdminLogin = () => {
        navigate('/admin-login');
    };

    const handleUserLogin = () => {
        navigate('/user-login');
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="title">Bus Reservation System</h1>
            <div className="button-container d-flex flex-column align-items-center">
                <button className="btn btn-primary mb-3" onClick={handleAdminLogin}>
                    Admin Login
                </button>
                <button className="btn btn-success" onClick={handleUserLogin}>
                    User Login
                </button>
            </div>
        </div>
    );
};

export default HomePage;
