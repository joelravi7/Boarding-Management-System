import React from "react";
import { useLocation } from "react-router-dom"; // Access state passed from login
import { useNavigate } from "react-router-dom"; // Navigation hook
import styles from "./CSS/dash.css"; // Import CSS styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling
import welcomeimage from "./assets/homemobile.png"; 


import one from './assets/one.png';
import two from './assets/two.png';
import three from './assets/three.png';

import instagram from './assets/Instagram.webp';
import facebook from './assets/facebook.png';
import twitter from './assets/twitter.png'
import whatsapp from './assets/whatsapp.png'

const HomePage = () => {
  const location = useLocation(); // Access the state passed from login page
  const { state } = location || {}; // Safely handle undefined state
  const message = state?.message || null; // Default to null if undefined

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle "Submit Your Case" button click
  const handleBooking = () => {
    navigate("/RoomList"); // Navigate to the Addrom page
  };

  // Logout function
  const handleLogout = () => {
    // Remove token fromsessionStorage
  sessionStorage.removeItem("token");
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  const handleAddPosts= () => {
    navigate("/AddRoom"); // Navigate to the Addrom page
  };
  
  return (
    <>
    < nav className="body">
      
        {/* Navigation Bar and Welcome Section Combined */}
        <div className="navbar navbar-expand-lg">
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
                  <a className="nav-link" href="/AddRoom">Post add</a>
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
                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
                  <section id="dash">
                    <div  className="sector01">
                      <div className="Homesector1-container ">
                        <div className="text-section">
                          <p className="dash-Maintopic1">Effortless Boarding Management</p>
                          <p className="dash-Mainpara1">
                             Streamline your boarding facility with our advanced management system. 
                               Simplify guest check-ins, track room availability, and optimize operations.
                          </p>
                          
                          <button className="Login-button" onClick={handleBooking}>
                          Discover
                          </button>
        
                        </div>
                        <img src={welcomeimage} className="welcomeimage" alt="Main Visual" />
                      </div>
                    </div>
                  </section>

            {/* Process Section */}
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
                    comfortable housing near their campus. Browse verified listings and
                    secure your home away from home in just a few clicks.
                  </p>
                  <div className="buttons">
                  <button className="primary-button" onClick={handleBooking}>Explore Listings</button>
                  <button className="secondary-button" onClick={handleAddPosts}>Add Post</button>

                    
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


        
          {/*Footer section */}
          <section id="contact">
            <div className={styles.footer}> {/* Corrected className for custom CSS */}
              <footer>
                <div id="footer_content" className="container">
                  <div id="footer_contacts">
                    </div>
              
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
                              <img src={instagram} className="footer-link"  id="instagram" />
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="#" className="footer-link" id="facebook">
                              <img src={whatsapp} className="footer-link"  id="Facebook" />
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" className="footer-link" id="whatsapp">
                              <img src={facebook} className="footer-link"  id="whatapp" />
                                <i className="fa-brands fa-whatsapp"></i>
                            </a>
                            <a href="#" className="footer-link" id="twitter">
                              <img src={twitter} className="footer-link"  id="twitter" />
                                <i className="fa-brands fa-twitter"></i>
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
      </nav>         
    </>
  );
};

export default HomePage;
