import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; 

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            username,
            password,
        };

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Login successful') {
                navigate('/landing');
            } else {
                setErrorMessage(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        });
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h2 className="text-primary mb-4">User Login</h2>
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
            <p className="mt-3">
                Don't have an account? <button className="btn btn-link" onClick={() => navigate('/register')}>Register here</button>
            </p>
        </div>
    );
};

export default UserLogin;
