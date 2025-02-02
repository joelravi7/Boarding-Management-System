import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

function AdminDashboard() {
  const location = useLocation();
  const message1 = location.state?.message || "";

  const [activeSection, setActiveSection] = useState(null);
  const [unverifiedRooms, setUnverifiedRooms] = useState([]);
  const [verifiedRooms, setVerifiedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8070/rooms");
        const roomsData = response.data;

        const verified = roomsData.filter((room) => room.isVerified);
        const unverified = roomsData.filter((room) => !room.isVerified);

        setVerifiedRooms(verified);
        setUnverifiedRooms(unverified);
        setLoading(false);
      } catch (error) {
        setError("Error fetching rooms. Please try again later.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom((prevRoom) =>
      prevRoom && prevRoom._id === room._id ? null : room
    );
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  const handleVerification = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8070/Room/verify/${id}`, { isVerified: true });

      if (response.status === 200) {
        setUnverifiedRooms((prevRooms) => prevRooms.filter((room) => room._id !== id));
        setVerifiedRooms((prevRooms) => [
          ...prevRooms,
          unverifiedRooms.find((room) => room._id === id),
        ]);
      } else {
        alert("Failed to update room status.");
      }
    } catch (err) {
      alert("Error updating room status: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <button className={`nav-link ${activeSection === "staff" ? "active" : ""}`} onClick={() => handleSectionClick("staff")}>
                  Staff Management
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeSection === "room" ? "active" : ""}`} onClick={() => handleSectionClick("room")}>
                  Room Management {unverifiedRooms.length > 0 && (
                    <span className="badge bg-danger ms-2">{unverifiedRooms.length}</span>
                  )}
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeSection === "customer" ? "active" : ""}`} onClick={() => handleSectionClick("customer")}>
                  Feedback Management
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {message1 && <div className="nav-link text-danger">{message1}</div>}

          {/* Notification for unverified rooms */}
          {unverifiedRooms.length > 0 && (
            <div className="alert alert-warning text-center">
              ⚠️ There are {unverifiedRooms.length} unverified rooms waiting for approval.
            </div>
          )}

          {/* Room Management Section */}
          {activeSection === "room" && (
            <section id="room-management" className="mb-4">
              <h3>Room Management</h3>

              {/* Unverified Rooms */}
              <h4>Unverified Rooms</h4>
              {unverifiedRooms.length === 0 ? (
                <p>No unverified rooms available.</p>
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
                    {unverifiedRooms.map((room) => (
                      <React.Fragment key={room._id}>
                        <tr onClick={() => handleRoomClick(room)} style={{ cursor: 'pointer' }}>
                          <td>{room.roomType} - {room.ownerName || "N/A"}</td>
                          <td>{room.roomAddress}</td>
                          <td>Rs {room.price.toLocaleString()}</td>
                        </tr>
                        {selectedRoom?._id === room._id && (
                          <tr>
                            <td colSpan="3">
                              <div className="accordion-body">
                                <img src={`http://localhost:8070${room.images[activeImageIndex]}`} alt={`Room ${activeImageIndex + 1}`} className="d-block w-100" style={{ maxWidth: '400px', maxHeight: '200px', margin: 'auto', borderRadius: '10px', marginTop: '15px' }} />
                                <div className="row mt-3 justify-content-center">
                                  {room.images.map((image, index) => (
                                    <div key={index} className="col-1">
                                      <img src={`http://localhost:8070${image}`} alt={`Thumbnail ${index + 1}`} className="img-thumbnail" onClick={() => handleThumbnailClick(index)} />
                                    </div>
                                  ))}
                                </div>
                                <p><strong>Owner Name:</strong> {room.ownerName || "N/A"}</p>
                                <p><strong>Owner Contact:</strong> {room.ownerContactNumber || "N/A"}</p>
                                <p><strong>Description:</strong> {room.description || "N/A"}</p>
                                <button onClick={() => handleVerification(room._id)} className="approve-btn">Approve ✅</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Verified Rooms */}
              <h4>Verified Rooms</h4>
              {verifiedRooms.length === 0 ? (
                <p>No verified rooms available.</p>
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
                    {verifiedRooms.map((room) => (
                      <tr key={room._id}>
                        <td>{room.roomType} - {room.ownerName || "N/A"}</td>
                        <td>{room.roomAddress}</td>
                        <td>Rs {room.price.toLocaleString()}</td>
                      </tr>
                    ))}
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
