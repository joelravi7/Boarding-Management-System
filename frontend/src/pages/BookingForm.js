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

  return (
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
                Payment successful! Take a screenshot of the details below.
              </div>

              {/* Display Room and Renter Details */}
              <div className="d-flex gap-4">
                <div className="section1">
                  <h3>Room Details</h3>
                  <p><strong>Room Type:</strong> {room.roomType}</p>
                  <p><strong>Owner Name:</strong> {room.ownerName}</p>
                  <p><strong>Owner Contact Number:</strong> {room.ownerContactNumber || "N/A"}</p>
                  <p><strong>Room Address:</strong> {room.roomAddress || "N/A"}</p>
                  <p><strong>Located City:</strong> {room.roomCity || "N/A"}</p>
                  <p><strong>Negotiable:</strong> {room.isNegotiable ? "Yes" : "No"}</p>
                  <p><strong>Price: Rs.</strong> {room.price.toLocaleString()} /month</p>
                </div>

                <div className="section2">
                  <h3>Renter Details</h3>
                  <p><strong>Buyer Name:</strong> {formData.buyerName}</p>
                  <p><strong>Buyer Contact Number:</strong> {formData.buyerContactNumber}</p>
                  <p><strong>Buyer NIC:</strong> {formData.buyerNIC}</p>
                  <p><strong>Buying Duration:</strong> {formData.buyingDuration}</p>
                </div>
              </div>
              <button
                className="btn btn-dark w-100 mt-3"
                onClick={() => navigate("/dash")}
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookForm;
