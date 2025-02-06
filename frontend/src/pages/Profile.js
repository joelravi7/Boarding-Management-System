import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Add this line
import "../Componets/CSS/Profile.css";


function LoggedCustomer() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [updatedRoomData, setUpdatedRoomData] = useState({
    roomType: "",
    roomAddress: "",
    price: "",
    description: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

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
    fetchRooms(); // Fetch rooms after customer details are fetched
  }, [navigate]);
  

  // Fetch rooms
  const fetchRooms = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to access your rooms.");
      setAlertType("danger");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8070/Room/myrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load rooms.");
      setAlertType("danger");
    }
  };

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

  const deleteRoom = async (roomId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to delete a room.");
      setAlertType("danger");
      return;
    }

    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        const response = await axios.delete(`http://localhost:8070/Room/deleteroom/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
        setMessage(response.data.message || "Room deleted successfully.");
        setAlertType("success");
      } catch (err) {
        setMessage(err.response?.data?.error || "Failed to delete room.");
        setAlertType("danger");
      }
    }
  };

  const updateRoom = async (roomId, formData) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to update a room.");
      setAlertType("danger");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/Room/updateroom/${roomId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Room updated successfully!");
        fetchRooms(); // Reload rooms after update
        setSelectedRoom(null); // Close the update form

   
      } else {
        console.error("Update failed:", data.error);
        alert(`Failed to update room: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during update:", error);
      alert("An error occurred while updating the room.");
    }
  };

  const handleRoomUpdate = (room) => {
    setSelectedRoom(room);
    setUpdatedRoomData({
      roomType: room.roomType,
      roomAddress: room.roomAddress,
      price: room.price,
      description: room.description,
      images: room.images, // Keep track of existing images
    });
    setImagePreviews([]); // Start with no previews for new uploads
     // Open the modal for room update
     const modal = new window.bootstrap.Modal(document.getElementById('roomUpdateModal'));
     modal.show();
  };



  const handleRoomFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add new image files to FormData
    imagePreviews.forEach((preview) => {
      if (preview.file) {
        formData.append("images", preview.file);
      }
    });

    // Include a list of existing images to keep
    const imagesToKeep = updatedRoomData.images;
    formData.append("keepImages", JSON.stringify(imagesToKeep));

    // Include other room data
    for (const key in updatedRoomData) {
      if (key !== "images") {
        formData.append(key, updatedRoomData[key]);
      }
    }

    updateRoom(selectedRoom._id, formData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Ensure total images (existing + new) do not exceed 10
    if (updatedRoomData.images.length + imagePreviews.length + newImagePreviews.length > 10) {
      alert("You can upload up to 10 images only.");
      return;
    }

    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
  };

  const handleImageDelete = (index, isExisting) => {
    if (isExisting) {
      // Remove from existing images
      const updatedImages = updatedRoomData.images.filter((_, i) => i !== index);
      setUpdatedRoomData((prevData) => ({ ...prevData, images: updatedImages }));
    } else {
      // Remove from new image previews
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
             
              {sessionStorage.getItem("token") && (
                  <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="LoggedCustomer-container d-flex flex-wrap justify-content-between p-3">
      <div className="customer-details-container w-45 p-3">
          <h2>My Details</h2>
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

        <div className="my-rooms-container w-45 p-3">
          <h2>My Rooms</h2>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room._id} className="room-card p-3 mb-3 border rounded d-flex align-items-center">
                <div className="image-carousel me-3" style={{ width: "200px" }}>
                  <div className="image-display">
                    <img
                      src={`http://localhost:8070${room.images[0]}`}
                      alt="Room"
                      className="card-img-top"
                      style={{ height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  </div>
                </div>
                <div className="room-details">
                  <h3>A <strong>{room.roomType}</strong> Listed - {room.roomAddress}</h3>
                  <p className="room-price"><strong>Price</strong> Rs {room.price.toLocaleString()} / month</p>
                  <p><strong>Description</strong>{room.description}</p>
                  
                    <p>
                      <strong>Status:</strong>{" "}
                      {room.isVerified ? (
                        <>
                          <span className="badge bg-success">Verified</span>
                          <span className="ms-2">Your room is listed.</span>
                        </>
                      ) : (
                        <>
                          <span className="badge bg-warning text-dark">Unverified</span>
                          <span className="ms-2">Verification takes 3 working days.</span>
                        </>
                      )}
                    </p>

                  <div className="d-flex justify-content-start">
                    <button className="btn btn-warning me-2" onClick={() => handleRoomUpdate(room)}><strong>Update Room</strong></button>
                    <button className="btn btn-danger" onClick={() => deleteRoom(room._id)}><strong>Delete Room</strong></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms available.</p>
          )}

        </div>
      

      {/* Modal for Room Update Form */}
      <div className="modal fade" id="roomUpdateModal" tabIndex="-1" aria-labelledby="roomUpdateModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="roomUpdateModalLabel">Update Room</h5>
             
    
            </div>
            <div className="modal-body">
              <form onSubmit={handleRoomFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Room Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedRoomData.roomType}
                    onChange={(e) =>
                      setUpdatedRoomData({ ...updatedRoomData, roomType: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Room Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedRoomData.roomAddress}
                    onChange={(e) =>
                      setUpdatedRoomData({ ...updatedRoomData, roomAddress: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedRoomData.price}
                    onChange={(e) =>
                      setUpdatedRoomData({ ...updatedRoomData, price: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={updatedRoomData.description}
                    onChange={(e) =>
                      setUpdatedRoomData({ ...updatedRoomData, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Room Images</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div className="image-previews mt-3">
                    {updatedRoomData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img
                          src={`http://localhost:8070${image}`}
                          alt={`Room image ${index + 1}`}
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleImageDelete(index, true)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleImageDelete(index, false)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Update Room</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      </nav>
    </>
  );
}

export default LoggedCustomer;
