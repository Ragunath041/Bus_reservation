import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; 

const SeatSelection = () => {
    const location = useLocation();
    const { busDetails, userName } = location.state; // Access bus details and userName passed from LandingPage
    const { source, destination } = busDetails;
    const totalSeats = 40; // Total number of seats
    const [selectedSeats, setSelectedSeats] = useState([]);
    const navigate = useNavigate();

    const handleSeatChange = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }
        // Navigate to the Payment component with the selected seats, bus details, and user name
        navigate('/payment', {
            state: { selectedSeats, busDetails, userName }, // Pass userName to Payment
        });
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h2 className="text-primary mb-4">Select Seats for {source} to {destination}</h2>
            <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '600px' }}>
                <div className="seat-grid mb-3">
                    {Array.from({ length: totalSeats }).map((_, index) => {
                        const seatId = index + 1;
                        return (
                            <label key={seatId} className={`seat-label ${selectedSeats.includes(seatId) ? 'selected' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedSeats.includes(seatId)}
                                    onChange={() => handleSeatChange(seatId)}
                                />
                                {seatId}
                            </label>
                        );
                    })}
                </div>
                <button type="submit" className="btn btn-primary w-100">Confirm Ticket</button>
            </form>
        </div>
    );
};

export default SeatSelection;
