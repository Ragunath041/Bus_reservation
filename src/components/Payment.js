import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/HomePage.css'; 

const Payment = () => {
    const { state } = useLocation();
    const { busDetails, selectedSeats } = state || {};
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateCardDetails = () => {
        // Basic validation for card details
        if (!/^\d{16}$/.test(cardNumber)) {
            setErrorMessage('Card number must be 16 digits.');
            return false;
        }
        if (!/^\d{3}$/.test(cvv)) {
            setErrorMessage('CVV must be 3 digits.');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth) || !/^\d{4}$/.test(expiryYear)) {
            setErrorMessage('Invalid expiry date.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateCardDetails()) return; // Validate card details before proceeding

        const ticketDetails = {
            name,
            busName: busDetails.busname,
            source: busDetails.source,
            destination: busDetails.destination,
            bookedSeats: selectedSeats.join(', '),
            date: busDetails.date
        };

        // Create and download the .txt file
        const fileContent = `Name: ${ticketDetails.name}\nBus Name: ${ticketDetails.busName}\nSource: ${ticketDetails.source}\nDestination: ${ticketDetails.destination}\nBooked Seats: ${ticketDetails.bookedSeats}\nDate: ${ticketDetails.date}`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'ticket_details.txt';
        link.click();
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h2 className="text-primary mb-4">Payment</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '500px' }}>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Card Number:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3" style={{ display: 'flex', gap: '10px' }}>
                    <div className="flex-fill">
                        <label className="form-label">Expiry Month:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={expiryMonth} 
                            onChange={(e) => setExpiryMonth(e.target.value)} 
                            required 
                            placeholder="MM" 
                        />
                    </div>
                    <div className="flex-fill">
                        <label className="form-label">Expiry Year:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={expiryYear} 
                            onChange={(e) => setExpiryYear(e.target.value)} 
                            required 
                            placeholder="YYYY" 
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">CVV:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={cvv} 
                        onChange={(e) => setCvv(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit Payment</button>
            </form>
        </div>
    );
};

export default Payment;
