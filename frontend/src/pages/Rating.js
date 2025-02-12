import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS
import "../Componets/CSS/Profile.css";

function LoggedCustomer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    buyerRating: "",
    ratingdescription: "", // Add ratingdescription to formData state
    roomId: "", // Add roomId to formData state
  });

  useEffect(() => {
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
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8070/Room/mybooking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load rooms.");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle room rating submission
  const handleRateRoom = async (e) => {
    e.preventDefault();

    if (!formData.buyerRating || !formData.ratingdescription) {
      setError("Please provide both a rating and a description.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8070/room/rate",
        {
          roomId: formData.roomId, // Use roomId from formData
          buyerRating: formData.buyerRating,
          ratingdescription: formData.ratingdescription, // Send the rating description
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Thank you for rating the room!");
        // Reset form after successful submission
        setFormData({ buyerRating: "", ratingdescription: "", roomId: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while submitting the rating.");
    }
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, buyerRating: rating });
  };
  
  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="body">
        <nav className="navbar navbar-expand-lg">
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
                <li className="nav-item"><a className="nav-link" href="/dash">Dashboard</a></li>
                <li className="nav-item"><a className="nav-link" href="/AddRoom">Post Add</a></li>
                <li className="nav-item"><a className="nav-link" href="/RoomList">Properties</a></li>
                <li className="nav-item"><a className="nav-link" href="/Userroom">About Us</a></li>
                <li className="nav-item"><a className="nav-link" href="/maintenance">Blogs</a></li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="profileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Account
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                    <li><a className="dropdown-item" href="/profile">View Profile</a></li>
                    <li><a className="dropdown-item" href="/MyRoom">My Room</a></li>
                    <li><a className="dropdown-item" href="/MyListings">My Listings</a></li>
                    <li><a className="dropdown-item" href="/MyListings">Rate Us</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      {sessionStorage.getItem("token") && (
                        <button className="dropdown-item" onClick={handleLogout}><strong>Logout</strong></button>
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
                    <img
                      src={`http://localhost:8070${room.images[0]}`}
                      alt="Room"
                      className="card-img-top"
                      style={{ height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  </div>
                  <div className="room-details">
                    <h3><strong>{room.roomType}</strong> - {room.roomCity}</h3>
                    <p><strong>Posted On</strong>- {room.createdAt}</p>
                    <p><strong>Owner Name</strong> {room.ownerName}</p>
                    <p><strong>Owner Contact Number</strong> {room.ownerContactNumber}</p>
                    <p className="room-price"><strong>Price</strong> Rs {room.price.toLocaleString()} / month</p>
                    <p><strong>Description</strong> {room.description}</p>
                    <p><strong>Address</strong> {room.roomAddress}</p>
                    <p><strong>Booked Date</strong> {room.createdAt}</p>
                    <p><strong>Duration</strong> {room.buyingDuration} Months</p>

                    <button 
                      className="btn btn-primary mt-2" 
                      data-bs-toggle="modal" 
                      data-bs-target="#rateRoomModal"
                      onClick={() => setFormData({ ...formData, roomId: room._id })} // Set roomId in formData
                    >
                      Rate this room
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No rooms available.</p>
            )}
          </div>
        </div>
      </nav>

      {/* Rating Modal */}
      <div className="modal fade" id="rateRoomModal" tabIndex="-1" aria-labelledby="rateRoomModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="rateRoomModalLabel">Rate Room</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRateRoom}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        onClick={() => handleRatingChange(index + 1)}
                        style={{
                          fontSize: "30px",
                          cursor: "pointer",
                          color: index < formData.buyerRating ? "#FFD700" : "#D3D3D3", // Filled or empty stars
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating Description</label>
                  <textarea
                    name="ratingdescription"
                    className="form-control"
                    value={formData.ratingdescription}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Submit Rating</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoggedCustomer;
