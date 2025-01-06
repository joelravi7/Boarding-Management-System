import React, { useState } from "react";
import axios from "axios";

function AddRoom() {
  const [roomAddress, setRoomAddress] = useState("");
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerContactNumber, setOwnerContactNumber] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }

    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add a room.");
      return;
    }

    if (
      !roomAddress ||
      !roomType ||
      !price ||
      !ownerName ||
      !ownerContactNumber ||
      images.length < 1 ||
      images.length > 10 ||
      !description
    ) {
      alert("Please fill out all required fields and upload between 1 and 10 images.");
      return;
    }

    const formData = new FormData();
    formData.append("roomAddress", roomAddress);
    formData.append("roomType", roomType);
    formData.append("price", price);
    formData.append("isNegotiable", isNegotiable.toString());
    formData.append("ownerName", ownerName);
    formData.append("ownerContactNumber", ownerContactNumber);
    formData.append("description", description);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("http://localhost:8070/addroom", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);

      // Reset form fields
      setRoomAddress("");
      setRoomType("");
      setPrice("");
      setIsNegotiable(false);
      setOwnerName("");
      setOwnerContactNumber("");
      setImages([]);
      setDescription("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error adding the room. Please try again later.";
      alert(errorMessage);
    }
  };

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
           <li className="nav-item"><a className="nav-link" href="/staff">Maintenance</a></li>
           <li className="nav-item"><a className="nav-link" href="/profile">Profile</a></li>
           <li className="nav-item"><a className="nav-link" href="/Login">Logout</a></li>
         </ul>
       </div>
     </div>
   </nav>

    <div className="Registration-container">
      <h2 className="mt-4">Add a Room</h2>
      <p>
        Please fill out the form below to add a room. Provide accurate details to ensure better
        visibility for prospective tenants.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="roomType" className="form-label">
              Room Type <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              id="roomType"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Single">Single Room</option>
              <option value="Double">Double Room</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="ownerName" className="form-label">
              Owner Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="ownerName"
              placeholder="Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="ownerContactNumber" className="form-label">
              Owner Contact Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              id="ownerContactNumber"
              placeholder="Contact Number"
              value={ownerContactNumber}
              onChange={(e) => setOwnerContactNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="roomAddress" className="form-label">
              Room Location <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="roomAddress"
              placeholder="Enter the room address (add Land Marks)"
              value={roomAddress}
              onChange={(e) => setRoomAddress(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Room Description<span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="5"
            placeholder="Provide a description for the room"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="price" className="form-label">
              Price (per month) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="price"
              placeholder="Enter the price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Price Negotiable</label>
            <div>
              <input
                type="radio"
                id="negotiableYes"
                name="negotiable"
                value="true"
                checked={isNegotiable === true}
                onChange={() => setIsNegotiable(true)}
              />
              <label htmlFor="negotiableYes" className="ms-2">
                Yes
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="negotiableNo"
                name="negotiable"
                value="false"
                checked={isNegotiable === false}
                onChange={() => setIsNegotiable(false)}
              />
              <label htmlFor="negotiableNo" className="ms-2">
                No
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="images" className="form-label">
              Room Photos (1-10 images) <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            <div className="mt-2">
              {images.length > 0 &&
                images.map((image, index) => (
                  <div key={index} className="d-flex align-items-center">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Room Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Room
        </button>
      </form>
    </div>
    </>
  );
}

export default AddRoom;
