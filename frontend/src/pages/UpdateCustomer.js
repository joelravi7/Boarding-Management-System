import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function UpdateCustomer() {
  const [customer, setCustomer] = useState({
    name: "",
    Lname: "",
    DOB: "",
    Gender: "",
    Phonenumber1: "",
    Phonenumber2: "",
    Address: "",
    email: "",
    password: "", // For password
    confirmPassword: "", // For password confirmation
  });
  const [error, setError] = useState(null); // For error state
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCustomerData() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("You are not logged in!");
        navigate("/login");
        return;
      }

      try {
        // Fetch customer data from the backend
        const response = await axios.get(`http://localhost:8070/customer/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "Customer fetched successfully") {
          setCustomer(response.data.customer);
        } else {
          setError("Customer details not found.");
          alert("Customer details not found.");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error.message);
        setError("Failed to load customer details.");
        alert("Failed to load customer details.");
      }
    }

    fetchCustomerData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You are not logged in!");
      navigate("/login");
      return;
    }

    if (customer.password !== customer.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
  const updatedCustomer = { ...customer };
  delete updatedCustomer.confirmPassword;

  const response = await axios.put(`http://localhost:8070/customer/update/${id}`, updatedCustomer, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response.data); // Log response for debugging
  if (response.status === 200) {
    alert("Details updated successfully!");
    navigate("/profile");
  } else {
    alert("Failed to update details.");
  }
} catch (error) {
  console.error("Error updating customer details:", error.message);
  alert("Failed to update details.");
}

  };

  

  return (
    < nav className="body">
      {/* Navigation Bar */}
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
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/Rooms">Rooms</a></li>
              <li className="nav-item"><a className="nav-link" href="/staff">Staff</a></li>
              <li className="nav-item"><a className="nav-link" href="/maintenance">Maintenance</a></li>
              <li className="nav-item"><a className="nav-link" href="/Profile">Profile</a></li>
              
            </ul>
          </div>
        </div>
      </nav>

    <div className="updateRegistration-container">
      <h2 className="mt-4">Update Your Account</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="Lname" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="Lname"
              name="Lname"
              value={customer.Lname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="DOB" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control"
              id="DOB"
              name="DOB"
              value={customer.DOB}
              onChange={handleChange}
             
            />
          </div>
          <div className="col">
            <label htmlFor="Gender" className="form-label">
              Gender
            </label>
            <select
              id="Gender"
              name="Gender"
              value={customer.Gender}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="Phonenumber1" className="form-label">
              Phone Number 1
            </label>
            <input
              type="text"
              className="form-control"
              id="Phonenumber1"
              name="Phonenumber1"
              value={customer.Phonenumber1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="Phonenumber2" className="form-label">
              Phone Number 2
            </label>
            <input
              type="text"
              className="form-control"
              id="Phonenumber2"
              name="Phonenumber2"
              value={customer.Phonenumber2 || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="Address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="Address"
            name="Address"
            value={customer.Address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={customer.password}
              onChange={handleChange}
            />
          </div>

          <div className="col">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={customer.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Update
        </button>
      </form>
    </div>
    </nav>
  );
}

export default UpdateCustomer;
