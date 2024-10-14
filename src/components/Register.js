import React, { useState } from 'react';
import '../styles/HomePage.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        return regex.test(email);
    };

    const validatePassword = (password) => {
        // Basic password strength validation (at least 6 characters)
        return password.length >= 6;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation to check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        // Email validation
        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        // Password strength validation
        if (!validatePassword(password)) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        // Data to send to the backend
        const registrationData = {
            username,
            email,
            password,
        };

        // Send data to backend (Flask API)
        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'User registered successfully') {
                setSuccessMessage('Registration successful!');
                setErrorMessage('');
                // Clear form fields
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage(data.message);
                setSuccessMessage('');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setErrorMessage('An error occurred during registration. Please try again.');
            setSuccessMessage('');
        });

        setErrorMessage('');  // Clear error message after successful validation
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h2 className="text-primary mb-4">Register</h2>
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
                    <label className="form-label">Email:</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
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
                <div className="mb-3">
                    <label className="form-label">Confirm Password:</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
        </div>
    );
};

export default Register;
