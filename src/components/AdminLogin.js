import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; 

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Hardcoded credentials
        const hardcodedUsername = 'admin';
        const hardcodedPassword = 'admin@123';

        // Check if entered credentials match hardcoded ones
        if (username === hardcodedUsername && password === hardcodedPassword) {
            // Redirect to Adding Bus page
            navigate('/adding-bus'); // Make sure to create this route
        } else {
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h2 className="text-primary mb-4">Admin Login</h2>
            <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
