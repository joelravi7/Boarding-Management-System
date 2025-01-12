import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";


function AdminDashboard() {
  const location = useLocation();
  const message1 = location.state?.message || "";
  
  
  const [activeSection, setActiveSection] = useState(null);

  const [rooms, setRooms] = useState([]);  // State for rooms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
 
  const [selectedRoom, setSelectedRoom] = useState(null);  // Track the selected room
 const [activeImageIndex, setActiveImageIndex] = useState(0); // Track active image index for carousel

  const token = sessionStorage.getItem("token"); // Assuming token is storedSession

  

  // Fetch rooms data when the room section is active
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8070/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.length > 0) {
        setRooms(response.data); // Update with the room data from the response
      } else {
        setError("No rooms found.");
      }
    } catch (err) {
      setError("Failed to fetch rooms: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    
      if (activeSection === "room") {
      fetchRooms();
    }
  }, [activeSection,  fetchRooms]);  

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

 

  const handleRoomClick = (room) => {
    setSelectedRoom((prevRoom) =>
      prevRoom && prevRoom._id === room._id ? null : room // Toggle room details
    );
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index); // Change the main image based on the clicked thumbnail
  };

  

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeSection === "staff" ? "active" : ""}`}
                  onClick={() => handleSectionClick("staff")}
                >
                  Staff Management
                </button>
              </li>
              
              <li className="nav-item">
                <button
                  className={`nav-link ${activeSection === "room" ? "active" : ""}`}
                  onClick={() => handleSectionClick("room")}
                >
                  Room Management
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeSection === "customer" ? "active" : ""}`}
                  onClick={() => handleSectionClick("customer")}
                >
                  Feedback Management
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {message1 && <div className="nav-link text-danger">{message1}</div>}

        

          {/* Room Management Section */}
          {activeSection === "room" && (
            <section id="room-management" className="mb-4">
              <h3>Room Management</h3>
              {loading ? (
                <p>Loading rooms...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Type</th>
                      <th>Location</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length > 0 ? (
                      rooms.map((room) => (
                        <React.Fragment key={room._id}>
                          <tr onClick={() => handleRoomClick(room)} style={{ cursor: 'pointer' }}>
                            <td>{room.roomType} - {room.ownerName || "N/A"}</td>
                            <td>{room.roomAddress}</td>
                            <td>{room.price}</td>
                          </tr>

                          {/* Display room details in an accordion-style row */}
                          {selectedRoom && selectedRoom._id === room._id && (
                            <tr>
                              <td colSpan="3">
                                <div className="accordion" id={`accordionRoom${room._id}`}>
                                  <div className="accordion-item">
                                    <div
                                      id={`collapseRoom${room._id}`}
                                      className="accordion-collapse collapse show"
                                      aria-labelledby={`headingRoom${room._id}`}
                                      data-bs-parent={`#accordionRoom${room._id}`}
                                    >
                                      <div id="roomImageCarousel" className="carousel slide" data-bs-ride="false">
                                          <div className="carousel-inner">
                                            <div className="carousel-item active">
                                              <img
                                                src={`http://localhost:8070${room.images[activeImageIndex]}`}
                                                alt={`Room ${activeImageIndex + 1}`}
                                                className="d-block w-100"
                                                style={{ maxWidth: '400px', maxHeight: '200px', margin: 'auto', borderRadius: '10px', marginTop: '15px'}} // Custom image size
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
                                      <div className="accordion-body">
                                        <p><strong>Owner Name:</strong> {room.ownerName || "N/A"}</p>
                                        <p><strong>Owner Contact:</strong> {room.ownerContactNumber || "N/A"}</p>
                                        <p><strong>Room Type:</strong> {room.roomType || "N/A"}</p>
                                        <p><strong>Room Address:</strong> {room.roomAddress || "N/A"}</p>
                                        <p><strong>Price:</strong> {room.price || "N/A"}</p>
                                        <p><strong>Description:</strong> {room.description || "N/A"}</p>
                                        <button className="btn btn-danger"  >Delete Room</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No rooms found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
