import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './CSS/Bookroom.css'; // Ensure the CSS is linked here

function BookRoomPage() {
  const location = useLocation();
  const { room } = location.state || {}; // Get room details from navigation state

  
  const [paymentOption, setPaymentOption] = useState("physical"); // Default to physical payment
  const [agreeToTerms, setAgreeToTerms] = useState(false); // Track if user agrees to terms
  const [activeImageIndex, setActiveImageIndex] = useState(0); // Track active image index for carousel

  

  
  
  const handlePaymentOptionChange = (e) => {
    setPaymentOption(e.target.value);
  };

  const handleAgreeToTermsChange = (e) => {
    setAgreeToTerms(e.target.checked); // Update the agreement state
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index); // Change the main image based on the clicked thumbnail
  };

  if (!room) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">Room Details</h2>
        <div className="alert alert-danger">Room details not available. Please go back and select a room.</div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="/dash">Dashboard</a></li>
              <li className="nav-item"><a className="nav-link" href="/RoomList">Rooms</a></li>
              <li className="nav-item"><a className="nav-link" href="/staff">Staff</a></li>
              <li className="nav-item"><a className="nav-link" href="/">Support</a></li>
              <li className="nav-item"><a className="nav-link" href="/profile">Profile</a></li>
              <li className="nav-item"><a className="nav-link" href="/Login">Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="containerbody">
        <h2 className="text-center mb-4">Book Room</h2>
        <div className="card">
        <div className="card-body">
        <h5 className="card-title">{room.roomType} Room for Rent - {room.roomAddress}</h5>
          {/* Main Image Carousel */}
          <div id="roomImageCarousel" className="carousel slide" data-bs-ride="false">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={`http://localhost:8070${room.images[activeImageIndex]}`}
                  alt={`Room ${activeImageIndex + 1}`}
                  className="d-block w-100"
                  style={{ maxWidth: '400px', maxHeight: '350px', margin: 'auto', borderRadius: '10px', marginTop: '10px'}} // Custom image size
                />
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="row mt-3 justify-content-center">
            {room.images.map((image, index) => (
              <div key={index} className="col-1">
                <img
                  src={`http://localhost:8070${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="img-thumbnail"
                  onClick={() => handleThumbnailClick(index)} // Set active image on thumbnail click
                  
                />
              </div>
            ))}
          </div>

          {/* Card Body Content */}
          <h5 className="card-title"><strong>Price:</strong> Rs.{room.price} / month</h5>
          <p className="card-text">{room.description}</p>
          <p className="card-text"><strong>Owner:</strong> {room.ownerName} ({room.ownerContactNumber})</p>
          <p className="card-text"><strong>Negotiable:</strong> {room.isNegotiable ? "Yes" : "No"}</p>

          

        

          {/* Payment Option Radio Buttons */}
          <div className="form-group mt-4">

            <div className="form-check">
              <input
                type="radio"
                id="physicalPayment"
                name="paymentOption"
                value="physical"
                className="form-check-input"
                checked={paymentOption === "physical"}
                onChange={handlePaymentOptionChange}
              />
              <label className="form-check-label" htmlFor="physicalPayment">Pay After Checking Room Physically</label>
            </div>
          </div>

          {/* Display additional message based on payment option */}
          {paymentOption === "physical" && (
            <div className="alert alert-info mt-3">
              <p><strong>We kindly request you to visit the room for a physical check to ensure it meets your 
                requirements before making any payment.</strong></p>
              <p>If the room meets your needs, you may proceed with the payment in person.</p>
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={agreeToTerms}
              onChange={handleAgreeToTermsChange}
            />
            <label className="form-check-label">
              I agree to the <strong >Terms and Conditions</strong>
            </label>
          </div>


         

          {/* Disable booking button if terms are not agreed */}
          <button
            className="btn btn-primary mt-3"
            disabled={!agreeToTerms}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default BookRoomPage;
