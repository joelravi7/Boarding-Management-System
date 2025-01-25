import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Navigation hooks
import axios from "axios";

import './CSS/DisplayRoom.css';

function RoomList() {
  const location = useLocation();
  const { state } = location || {};
  const message = state?.message || null;
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState(50000);
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8; // Display 8 rooms per page
  const navigate = useNavigate();
  

  const handleBooking = (room) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      const proceed = window.confirm(
        "You need to log in before booking a room. Do you want to proceed to the login page?"
      );
      if (proceed) {
        navigate("/Login", { state: { room } });
      }
    } else {
      navigate("/Bookroom", { state: { room } });
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8070/rooms");
        setRooms(response.data);
        setFilteredRooms(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching rooms. Please try again later.");
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const applyFilters = () => {
    const filtered = rooms.filter((room) => {
      const isPriceValid = room.price <= priceFilter;
      const isLocationValid = locationFilter
        ? room.roomAddress.toLowerCase().includes(locationFilter.toLowerCase())
        : true;

      return isPriceValid && isLocationValid;
    });
    setFilteredRooms(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  useEffect(() => {
    applyFilters();
  }, [priceFilter, locationFilter]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 

  return (
    <>
      

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="/">LOGO</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/AddRoom">Post Add</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Userroom">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/maintenance">Blogs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
              {message && (
                <li className="nav-item">
                  <div className="nav-link text-danger">{message}</div>
                </li>
              )}
              {sessionStorage.getItem("token") && (
                <li className="nav-item">
                  <button className="nav-link" onClick={() => navigate("/login", { replace: true })}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Room Listings */}
      <div className="room-list-container">
        <div className="filters">
          <div className="filter-item">
            <label>Max Price (Rs.):</label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            />
            <span>Rs. {priceFilter.toLocaleString()}</span>
          </div>
          <div className="filter-item">
            <label>Location:</label>
            <input
              type="text"
              placeholder="Enter location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="room-grid">
          {currentRooms.length === 0 ? (
            <div className="no-results">No rooms match your criteria.</div>
          ) : (
            currentRooms.map((room) => (
              <div className="room-card" key={room._id}>
                <img
                  src={`http://localhost:8070${room.images[0]}`}
                  alt="Room"
                  className="room-image"
                  onClick={() => handleBooking(room)}
                />
                <div className="room-info">
                  <h5>{room.roomType} Room - {room.roomAddress}</h5>
                  <p className="room-price">Rs {room.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`page-button ${currentPage === pageNumber ? "active" : ""}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default RoomList;
