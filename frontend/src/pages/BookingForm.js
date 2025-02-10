import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Componets/CSS/BookingForm.css";

function BookForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room } = location.state || {}; // Retrieve room details from state

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerContactNumber: "",
    buyerNIC: "",
    buyingDuration: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (!room) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">Booking Form</h2>
        <div className="alert alert-danger">
          Room details are missing. Please go back and select a room.
        </div>
      </div>
    );
  }

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle payment input changes
  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.buyerName || !formData.buyerContactNumber || !formData.buyerNIC) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8070/room/book",
        {
          roomId: room._id,
          buyerName: formData.buyerName,
          buyerContactNumber: formData.buyerContactNumber,
          buyerNIC: formData.buyerNIC,
          buyingDuration: formData.buyingDuration,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setBookingConfirmed(true); // Show the payment section
      }
    } catch (err) {
      console.error("Error booking room:", err.response?.data || err.message);
      setError(err.response?.data?.error || "An error occurred while booking the room.");
    }
  };

  // Handle Payment
  const handlePayment = (e) => {
    e.preventDefault();

    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      setError("Please enter all payment details.");
      return;
    }

    if (paymentData.cardNumber.length < 16 || paymentData.cvv.length < 3) {
      setError("Invalid payment details. Please enter valid values.");
      return;
    }

    setPaymentCompleted(true);
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
    <nav className="navbar navbar-expand-lg ">
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
                  <li className="nav-item">
                    <button className="dropdown-item" onClick={handleLogout}><strong>Logout</strong></button>
                  </li>
                )}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    <div className="billing-container mt-3">
      <h2 className="text-center mb-4">Book Room - {room.roomType}</h2>

      {/* Flexbox container */}
      <div className="d-flex justify-content-center align-items-start gap-3">
        {/* Left Side - Room Details */}
        <div className="card p-2 shadow flex-grow-2">
          <div className="image-carousel d-flex justify-content-center mb-3">
            <img
              src={`http://localhost:8070${room.images[0]}`}
              alt="Room"
              className="card-img-top"
              style={{ height: "200px", width: "100%", objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
          <h6>
            <strong>Price: Rs.</strong> {room.price.toLocaleString()} /month
          </h6>
          <p>
            <strong>Owner:</strong> {room.ownerName}
          </p>
        </div>

        {/* Right Side */}
        <div className="card p-4 shadow flex-grow-1">
          {/* Booking Form */}
          {!bookingConfirmed ? (
            <>
              <h4 className="text-center mb-3">Booking Form</h4>
              <form onSubmit={handleBooking}>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Buyer Name</label>
                  <input
                    type="text"
                    name="buyerName"
                    className="form-control"
                    value={formData.buyerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Buyer Contact Number</label>
                  <input
                    type="text"
                    name="buyerContactNumber"
                    className="form-control"
                    value={formData.buyerContactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Buyer NIC</label>
                  <input
                    type="text"
                    name="buyerNIC"
                    className="form-control"
                    value={formData.buyerNIC}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Rental Period - Months</label>
                  <input
                    type="text"
                    name="buyingDuration"
                    
                    className="form-control"
                    value={formData.buyingDuration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Confirm Booking
                </button>
              </form>
            </>
          ) : !paymentCompleted ? (
            <>
              <h4 className="text-center mb-3">Enter Payment Details</h4>
              <p><strong>Amount to Pay:</strong> Rs. 500</p>
              <form onSubmit={handlePayment}>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    className="form-control"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="Enter 16-digit card number"
                    required
                  />
                </div>

                <div className="mb-3 d-flex gap-2">
                  <div>
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      className="form-control"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      className="form-control"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      placeholder="3-digit code"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Pay Now
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="alert alert-success text-center">
                Payment successful! 
              </div>

              <button
                className="btn btn-warning w-50 justify-content-center mt-2"
                onClick={() => navigate("/MyRoom")}
              >
                View Your Room Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    
      </>
  );
}

export default BookForm;
