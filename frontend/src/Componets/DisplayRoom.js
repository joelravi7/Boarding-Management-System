import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CSS/DisplayRoom.css';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState(50000);
  const [locationFilter, setLocationFilter] = useState("");
  
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
      // If the user is logged in, navigate to the booking page or perform another action
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

  // Filter function
  const applyFilters = () => {
    const filtered = rooms.filter((room) => {
      const isPriceValid = room.price <= priceFilter;
      const isLocationValid = locationFilter
        ? room.roomAddress.toLowerCase().includes(locationFilter.toLowerCase())
        : true;
      
      return isPriceValid && isLocationValid ;
    });
    setFilteredRooms(filtered);
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

  // Logout function
  const handleLogout = () => {
    // Remove token fromsessionStorage
  sessionStorage.removeItem("token");
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg">
                 <div className="container">
                 <a className="navbar-brand" href="/">LOGO</a>
                   <a className="navbar-brand" href="/">
                     
                   </a>
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
                     <li className="nav-item"><a className="nav-link" href="/staff">About </a></li>
                       <li className="nav-item"><a className="nav-link" href="/AddRoom">Post Add</a></li>
                       <li className="nav-item"><a className="nav-link" href="/Profile">Profile</a></li>
                       <li className="nav-item"><a className="nav-link" href="/">Blogs</a></li>
                       {sessionStorage.getItem("token") && (
                        <li className="nav-item">
                          <button className="nav-link" onClick={handleLogout}>Logout</button>
                        </li>
                          )}      
                     </ul>
                   </div>
                 </div>
               </nav>
         
    <div className="room-list-container">
      <h2 className="title">
        Featured <span className="highlight">Properties</span>
      </h2>

      {/* Filter Options */}
      <div className="filters">
        <div className="filter-item">
          <label>Max Price (Rs.):</label>
          <input
            type="range"
            min="1000"
            max="100000"
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


      {/* Room Grid */}
      <div className="room-grid">
        {filteredRooms.length === 0 ? (
          <div className="no-results">No rooms match your criteria.</div>
        ) : (
          filteredRooms.map((room) => (
            <div className="room-card" key={room._id}>
              <img
                src={`http://localhost:8070${room.images[0]}`}
                alt="Room"
                className="room-image"
              />
              <div className="room-info">
                <h5><strong>{room.roomType} Room</strong> - {room.roomAddress}</h5>
                <p className="room-price">Rs {room.price.toLocaleString()}</p>
              </div>
              <button className="btn btn-primary mt-auto" onClick={() => handleBooking(room)}>Book Now</button>

            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>›</button>
      </div>
    </div>
    </>
  );
}

export default RoomList;
