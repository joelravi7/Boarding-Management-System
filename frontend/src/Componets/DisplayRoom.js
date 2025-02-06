import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Navigation hooks
import axios from "axios";
import searchIcon from "./assets/searchimage.png";
import './CSS/DisplayRoom.css';

function RoomList() {
  const location = useLocation();
  const { state } = location || {};
  const message = state?.message || null;
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState(50000);
  const [locationFilter, setLocationFilter] = useState("");
  const [locations, setLocations] = useState([]); // For dropdown suggestions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const uniqueRoomTypes = [...new Set(rooms.map((room) => room.roomType))]; // Extract unique room types
  const roomsPerPage = 8; // Display 8 rooms per page
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
      navigate("/Bookroom", { state: { room } });
    }
  };

 useEffect(() => {
         const fetchRoomsAndLocations = async () => {
           try {
             const response = await axios.get("http://localhost:8070/rooms");
             const verifiedRooms = response.data.filter((room) => room.isVerified); // Ensure filtering
             setRooms(verifiedRooms);
             setFilteredRooms(verifiedRooms);
           
             // Extract unique locations for the dropdown
             const uniqueLocations = [...new Set(verifiedRooms.map((room) => room.roomAddress))];
             setLocations(uniqueLocations);
             
             setLoading(false);
           } catch (error) {
             setError("Error fetching rooms. Please try again later.");
             setLoading(false);
           }
         };
         
                fetchRoomsAndLocations();
              }, []);
      
       const applyFilters = () => {
         const filtered = rooms.filter((room) => {
           const isPriceValid =
           priceFilter === 4000
           ? room.price < 10000
           : priceFilter === 12000
           ? room.price >= 10000 && room.price <= 15000
           : priceFilter === 20000
           ? room.price > 15000
           : true;
 
       const isLocationValid = locationFilter
       ? room.roomAddress.toLowerCase().startsWith(locationFilter.toLowerCase())
       : true;
   
       const isPropertyTypeValid = propertyTypeFilter
         ? room.roomType.toLowerCase() === propertyTypeFilter.toLowerCase()
         : true;
   
      
       return isPriceValid && isLocationValid && isPropertyTypeValid;
       });
       
         setFilteredRooms(filtered);
         setCurrentPage(1); // Reset to the first page
       };
     
       const indexOfLastRoom = currentPage * roomsPerPage;
       const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
       const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
       const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
     
       const handlePageChange = (pageNumber) => {
         setCurrentPage(pageNumber);
       };

 

  return (
    <>
      

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
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
                <a className="nav-link" href="/dash">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/AddRoom">Post Add</a>
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
                  <button className="nav-link" onClick={() => navigate("/login", { replace: true })}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="room-list-container2">
                  <div className="filter-bar2">
                    <div className="filter-item">
                      <label htmlFor="location">Location</label>
                      <select
                        id="location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      >
                        <option value="">All Locations</option>
                          {locations.map((location, index) => (
                            <option key={index} value={location}>
                              {location}
                            </option>
                          ))}
                      </select>
                    </div>
                
                    <div className="filter-item">
                      <label htmlFor="propertyType">Property Type</label>
                        <select
                          id="propertyType"
                          value={propertyTypeFilter}
                          onChange={(e) => setPropertyTypeFilter(e.target.value)}
                        >
                        <option value="">Select Property Type</option>
                          {uniqueRoomTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                          ))}
                        </select>
                      </div>
                
                      <div className="filter-item">
                        <label htmlFor="priceRange">Price Range</label>
                          <select
                            id="priceRange"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(Number(e.target.value))}
                          >
                            <option value="">All</option>
                            <option value={4000}>Below Rs.10,000 / month</option>
                            <option value={12000}>Rs.10,000 - Rs.15,000 / month</option>
                            <option value={20000}>Above Rs.15,000 / month</option>
                          </select>
                        </div>
                
                        <button className="filter-search-btn" onClick={applyFilters}>
                          <img src={searchIcon} alt="Search" className="search-icon" />
                        </button>
                  </div>
              
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
          

        
     
    </>
  );
}

export default RoomList;
