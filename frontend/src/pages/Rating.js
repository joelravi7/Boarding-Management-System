import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Add this line
import "../Componets/CSS/Profile.css";


function LoggedCustomer() {
 
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
 
  const [selectedBuyer, setSelectedBuyer] = useState(null);


 
  useEffect(() => {
    // Check if the token exists in sessionstorage
    const token = sessionStorage.getItem("token");
  
    if (!token) {
      navigate("/login"); // Redirect if token does not exist
      return;
    }
  
    
    fetchRooms(); // Fetch rooms after customer details are fetched
  }, [navigate]);
  

  // Fetch rooms
  const fetchRooms = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to access your rooms.");
      setAlertType("danger");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8070/Room/mybooking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load rooms.");
      setAlertType("danger");
    }
  };

  const handleViewBuyerInfo = (room) => {
    setSelectedBuyer(room);
    const buyerInfoModal = new window.bootstrap.Modal(document.getElementById("buyerInfoModal"));
    buyerInfoModal.show();
  };

  // Logout function
  const handleLogout = () => {
    // Remove token from sessionstorage
    sessionStorage.removeItem("token");
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <>
    < nav className="body">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
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
                <a className="nav-link" href="/dash">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/AddRoom">Post Add</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="/RoomList">Properties</a>
                </li>
              <li className="nav-item">
                <a className="nav-link" href="/Userroom">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/maintenance">Blogs</a>
              </li>
              
              {/* Dropdown Menu */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="profileDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Profile
                </a>
                <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                  <li><a className="dropdown-item" href="/profile">View Profile</a></li>
                  <li><a className="dropdown-item" href="/Roomrating">My Room</a></li>
                  <li><a className="dropdown-item" href="/MyListings">My Listings</a></li>
                  <li><a className="dropdown-item" href="/MyListings">Rate Us</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                  {sessionStorage.getItem("token") && (
                  <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                )}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="LoggedCustomer-container d-flex flex-wrap justify-content-center p-3">
      

        <div className="my-rooms-container w-45 p-3">
          <h2>My Room</h2>
          {rooms.length > 0 ? (
        rooms.map((room) => (
            <div key={room._id} className="room-card p-3 mb-3 border rounded d-flex align-items-center">
            <div className="image-carousel me-3" style={{ width: "200px" }}>
                <div className="image-display">
                <img
                    src={`http://localhost:8070${room.images[0]}`}
                    alt="Room"
                    className="card-img-top"
                    style={{ height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px" }}
                />
                </div>
            </div>
            <div className="room-details">
                <h3><strong>{room.roomType}</strong> - {room.roomCity}</h3>
                <p><strong>Posted On</strong>- {room.createdAt}</p>
                <p><strong>owner Name </strong>{room.ownerName}</p>
                <p><strong>owner Contact Number </strong>{room.ownerContactNumber}</p>
                <p className="room-price"><strong>Price</strong> Rs {room.price.toLocaleString()} / month</p>
                <p><strong>Description </strong>{room.description}</p>
                <p><strong>Address </strong>{room.roomAddress}</p>
                <p><strong>Booked Date </strong>{room.createdAt}</p>
                <p><strong>Duration </strong>{room.buyingDuration} Months</p>
        

        <div className="d-flex justify-content-start mt-2">
        
        </div>
      </div>
    </div>
  ))
) : (
  <p>No rooms available.</p>
)}


        </div>
      
      

      
      </div>
      
      </nav>
    </>
  );
}

export default LoggedCustomer;
