import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/HomePage.css'; 

const AddingBus = () => {
    const [busName, setBusName] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [busTime, setBusTime] = useState('');
    const [busDate, setBusDate] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();

        // Data to send to the backend
        const busDetails = {
            busName,
            source,
            destination,
            bus_time: busTime,
            bus_date: busDate,
        };

        // Send data to the backend (Flask API)
        fetch('http://localhost:5000/add-bus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(busDetails),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Bus details added successfully') {
                setMessage('Bus details added successfully!');
                // Clear the form
                setBusName('');
                setSource('');
                setDestination('');
                setBusTime('');
                setBusDate('');
            } else {
                setMessage('Failed to add bus details. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessage('An error occurred while adding bus details.');
        });
    };

    const handleLogout = () => {
        // Here you can clear user data or handle logout logic if needed
        navigate('/'); // Redirect to home page
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="w-100 d-flex justify-content-between">
                <h2 className="text-primary mb-4">Add New Bus</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                <div className="mb-3">
                    <label className="form-label">Bus Name:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={busName} 
                        onChange={(e) => setBusName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Source:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={source} 
                        onChange={(e) => setSource(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Destination:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Time:</label>
                    <input 
                        type="time" 
                        className="form-control" 
                        value={busTime} 
                        onChange={(e) => setBusTime(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date:</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={busDate} 
                        onChange={(e) => setBusDate(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Bus</button>
            </form>
            {message && <p className="text-success mt-3">{message}</p>}
        </div>
    );
};

export default AddingBus;
