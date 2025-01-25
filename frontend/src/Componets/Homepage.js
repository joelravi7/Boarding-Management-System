import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from "./CSS/dash.css"; // Import CSS styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling
import welcomeimage from "./assets/homemobile.png"; // Main image

import instagram from "./assets/Instagram.webp";
import facebook from "./assets/facebook.png";
import twitter from "./assets/twitter.png";
import whatsapp from "./assets/whatsapp.png";

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState(50000);
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;

  const navigate = useNavigate(); // Initialize useNavigate hook

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
            setCurrentPage(1);
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
        
          const indexOfLastRoom = currentPage * roomsPerPage;
          const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
          const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
          const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
        
          const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
          };

    const handleLoginIn = () => {
      sessionStorage.removeItem("token");
      navigate("/login", { replace: true });
    };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="body">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="/">
              LOGO
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
                <li className="nav-item">
                  <a className="nav-link" href="/staff">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/RoomList">
                    Properties
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/">
                    Blogs
                  </a>
                </li>
                <button className="getstart-button" onClick={handleLoginIn}>
                  Login
                </button>
              </ul>
            </div>
          </div>
        </nav>

        {/* Welcome Section */}
        <section id="dash">
          <div className="sector01">
            <div className="Homesector1-container">
              <div className="text-section">
                <p className="dash-Maintopic1">Effortless Boarding Management</p>
                <p className="dash-Mainpara1">
                  Streamline your boarding facility with our advanced management
                  system. Simplify guest check-ins, track room availability, and
                  optimize operations.
                </p>
                
              </div>
              <img
                src={welcomeimage}
                className="welcomeimage"
                alt="Main Visual"
              />
            </div>
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
          </div>
        </section>
      </nav>

      <div className="room-list-container">
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
    

      

      {/* Other Sections */}
      <section className="statistics-section">
        <div className="container">
          <div className="stats-left">
            <div className="stat-box">
              <h2 className="stat-value">5+</h2>
              <p className="stat-label">Years of Service</p>
            </div>
            <div className="stat-box">
              <h2 className="stat-value">10K+</h2>
              <p className="stat-label">Happy Students</p>
            </div>
            <div className="stat-box">
              <h2 className="stat-value">100+</h2>
              <p className="stat-label">Verified Listings</p>
            </div>
            <div className="stat-box">
              <h2 className="stat-value">20+</h2>
              <p className="stat-label">Universities Covered</p>
            </div>
          </div>
          <div className="stats-right">
            <h1 className="section-title">Find Your Ideal Student Housing</h1>
            <p className="section-description">
              We make it easy for university students to find affordable and
              comfortable housing near their campus. Browse verified listings
              and secure your home away from home in just a few clicks.
            </p>
            <div className="buttons">
              <button className="primary-button" onClick={handleBooking}>
                Explore Listings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*FAQ section */}
              <div className={styles['faq-section']}> 
                <section id="faq">
                  <div className="FAQ-container">
                    <h2 className={'faq-heading'}>Frequently Asked Questions</h2>
                      <div className="accordion">
                        <div className={`accordion-item mb-3`}> {/* Add bottom margin to each accordion item */}
                          <h2 className="accordion-header" id="questionOne">
                            <button 
                              className="accordion-button" 
                              type="button" 
                              data-bs-toggle="collapse" 
                              data-bs-target="#collapseOne" 
                              aria-expanded="true" 
                              aria-controls="collapseOne"
                              >
                               How do I book a room?
                            </button>
                          </h2>
      
                          <div 
                            id="collapseOne" 
                            className="accordion-collapse collapse show" 
                            aria-labelledby="questionOne" 
                            data-bs-parent="#faqAccordion"
                          >
                            <div className="accordion-body">
                            You can book a room by clicking the "Book a Room" button and filling out your details.
                            </div>
                          </div>
                        </div>
      
      
                        <div className={`accordion-item mb-3`}> {/* Add bottom margin to each accordion item */}
                          <h2 className="accordion-header" id="questionTwo">
                            <button 
                              className="accordion-button" 
                              type="button" 
                              data-bs-toggle="collapse" 
                              data-bs-target="#collapseTwo" 
                              aria-expanded="false" 
                              aria-controls="collapseTwo"
                            >
                              Question 2?
                            </button>
                          </h2>
                          <div 
                            id="collapseTwo" 
                            className="accordion-collapse collapse" 
                            aria-labelledby="questionTwo" 
                            data-bs-parent="#faqAccordion"
                            >
                            <div className="accordion-body">
                              Answer to question 2.
                            </div>
                          </div>
                        </div>
                        {/* Add more accordion items as needed */}
                      </div>
                    </div>
                  </section>
                </div>

      {/* Footer Section */}
      <section id="contact">
        <div className={styles.footer}>
          <footer>
            <div id="footer_content" className="container">
              <div id="footer_contacts"></div>

              <div className="row">
                <div className="col-md-4">
                  <h3>Contact</h3>
                  <ul className="list-unstyled">
                    <li>Email: support@boardingmanagement.com</li>
                    <li>Phone: +123-456-7890</li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <div className="soci">
                    <h3>Socials</h3>
                    <div id="footer_social_media">
                      <a href="#" className="footer-link" id="instagram">
                        <img
                          src={instagram}
                          className="footer-link"
                          id="instagram"
                        />
                      </a>
                      <a href="#" className="footer-link" id="facebook">
                        <img src={whatsapp} className="footer-link" id="Facebook" />
                      </a>
                      <a href="#" className="footer-link" id="whatsapp">
                        <img src={facebook} className="footer-link" id="whatapp" />
                      </a>
                      <a href="#" className="footer-link" id="twitter">
                        <img src={twitter} className="footer-link" id="twitter" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="footer_copyright" className="text-center">
              &copy; 2025 Boarding Management. All rights reserved.
            </div>
          </footer>
        </div>
      </section>
    </>
  );
};

export default HomePage;
