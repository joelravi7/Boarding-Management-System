import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CSS/DisplayRoom.css';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState(10000);
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();

  const handleBooking = (room) => {
    navigate("/Bookroom", { state: { room } });
  };

  const handlePriceChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  const applyFilters = () => {
    const filtered = rooms.filter((room) => {
      const isPriceValid = priceFilter > 0 ? room.price <= priceFilter : true;
      const isLocationValid = locationFilter
        ? room.roomAddress.toLowerCase().includes(locationFilter.toLowerCase())
        : true;
      return isPriceValid && isLocationValid;
    });
    setFilteredRooms(filtered);
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

  useEffect(() => {
    applyFilters();
  }, [priceFilter, locationFilter]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
        
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="/dash">Dashboard</a></li>
              <li className="nav-item"><a className="nav-link" href="/AddRoom">Add Rooms</a></li>
              <li className="nav-item"><a className="nav-link" href="/staff">Staff</a></li>
              <li className="nav-item"><a className="nav-link" href="/maintenance">Maintenance</a></li>
              <li className="nav-item"><a className="nav-link" href="/profile">Profile</a></li>
              <li className="nav-item"><a className="nav-link" href="/Login">Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <h2 className="text-center mb-4">Available Rooms</h2>
        <div className="row">
          {/* Filter Panel */}
          <div className="col-md-3 mb-4">
            <div className="filter-section p-2 border rounded shadow-sm">
              <h6>Filters</h6>
              <div className="mb-3">
                <label htmlFor="priceFilter" className="form-label">Max Price (Rs.):</label>
                <input
                  type="range"
                  id="priceFilter"
                  className="form-range"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  min="1000"
                  max="50000"
                  step="500"
                />
                <div className="text-center">
                  <strong>Rs. {priceFilter}</strong>
                </div>
              </div>
              <div>
                <label htmlFor="locationFilter" className="form-label">Location:</label>
                <input
                  type="text"
                  id="locationFilter"
                  className="form-control"
                  value={locationFilter}
                  onChange={handleLocationChange}
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          {/* Room Cards */}
          <div className="col-md-9">
            {filteredRooms.length === 0 ? (
              <div className="alert alert-warning text-center">No rooms match the filter criteria.</div>
            ) : (
              <div className="row">
                {filteredRooms.map((room) => (
                  <div className="col-md-4 mb-4" key={room._id}>
                    <div className="card shadow-sm h-100">
                      <img
                        src={`http://localhost:8070${room.images[0]}`}
                        className="card-img-top"
                        alt="Room"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{room.roomType} - {room.roomAddress}</h5>
                        <p className="card-text">{room.description.slice(0, 100)}...</p>
                        <p className="card-text"><strong>Price:</strong> Rs. {room.price} / month</p>
                        <p className="card-text"><strong>Owner:</strong> {room.ownerName}</p>
                        <button
                          className="btn btn-primary mt-auto"
                          onClick={() => handleBooking(room)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomList;
