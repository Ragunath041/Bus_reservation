import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const LandingPage = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    // Fetch available buses from the backend
    fetch("http://localhost:5000/search-buses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source, destination, date }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch buses");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Buses fetched:", data); // Debugging log
        if (data.buses && data.buses.length > 0) {
          setBuses(data.buses);
          setMessage("");
        } else {
          setMessage("No buses found for the selected route and date.");
          setBuses([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching buses:", error);
        setMessage("An error occurred while searching for buses.");
        setBuses([]);
      });
  };

  const handleLogout = () => {
    // Here you can clear user data or handle logout logic if needed
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="w-100 d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Search Buses</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <form
        onSubmit={handleSearch}
        className="w-100"
        style={{ maxWidth: "400px" }}
      >
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
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Search
        </button>
      </form>

      {message && <p className="text-danger mt-3">{message}</p>}

      {buses.length > 0 && (
        <div className="mt-4">
          <h3>Available Buses</h3>
          <ul className="list-group">
            {buses.map((bus) => (
              <li
                key={bus.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {bus.busname}
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate(`/select-seat`, { state: { busDetails: bus } })
                  }
                >
                  Select Bus
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
