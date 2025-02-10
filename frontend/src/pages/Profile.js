import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Add this line
import "../Componets/CSS/Profile.css";


function LoggedCustomer() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");


  

  useEffect(() => {
    // Check if the token exists in sessionstorage
    const token = sessionStorage.getItem("token");
  
    if (!token) {
      navigate("/login"); // Redirect if token does not exist
      return;
    }
  
    // Fetch customer details if token exists
    async function fetchCustomerDetails() {
      try {
        const response = await axios.get("http://localhost:8070/customer/display", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setCustomer(response.data);
        } else {
          // If the response is not successful, redirect to login
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching customer details", err);
        navigate("/login"); // Redirect if error occurs
      }
    }
  
    fetchCustomerDetails();
   
  }, [navigate]);
  

  

  const handleCustomerUpdate = () => {
    if (customer && customer._id) {
      navigate(`/update-customer/${customer._id}`);
    } else {
      alert("Customer details not found.");
    }
  };

  const handleCustomerDelete = () => {
    if (customer && window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete(`http://localhost:8070/customer/delete/${customer._id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        })
        .then(() => {
          alert("Account deleted successfully!");
          sessionStorage.removeItem("token");
          navigate("/register");
        })
        .catch((err) => {
          console.error("Error deleting account:", err.message);
          alert("Error deleting account: " + err.message);
        });
    }
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

      <div className="LoggedCustomer-container d-flex flex-wrap justify-content-center p-3">
      <div className="customer-details-container w-45 p-3">
          <h2>My Profile</h2>
          {customer ? (
            <div className="CustomerBox">
                  <p><strong>First Name:</strong> {customer.name}</p>
                  <p><strong>Last Name:</strong> {customer.Lname || "N/A"}</p>
                  <p><strong>Date of Birth:</strong> {customer.DOB || "N/A"}</p>
                  <p><strong>Gender:</strong> {customer.Gender || "N/A"}</p>
                  <p><strong>Phone Number 1:</strong> {customer.Phonenumber1 || "N/A"}</p>
                  <p><strong>Phone Number 2:</strong> {customer.Phonenumber2 || "N/A"}</p>
                  <p><strong>Email:</strong> {customer.email || "N/A"}</p>
                  <p><strong>Address:</strong> {customer.Address || "N/A"}</p>
                
             
              <button type="button" className="btn btn-warning me-2" onClick={handleCustomerUpdate}><strong>Update Customer</strong></button>
              <button type="button" className="btn btn-danger" onClick={handleCustomerDelete}><strong>Delete Account</strong></button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
        


        
      
      

             
    
            
            
        
      
      </nav>
    </>
  );
}

export default LoggedCustomer;
