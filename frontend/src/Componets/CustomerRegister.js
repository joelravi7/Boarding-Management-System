import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './CSS/Register.css'

function Addmember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Lname, setLName] = useState("");
  const [DOB, setDOB] = useState("");
  const [Gender, setGender] = useState("");
  const [Phonenumber1, setPhonenumber1] = useState("");
  const [Phonenumber2, setPhonenumber2] = useState("");
  const [Address, setAddress] = useState("");

  const navigate = useNavigate();

  function sendData(e) {
    e.preventDefault();

    // Check if required fields are filled
    if (!name || !Phonenumber1 || !email || !password) {
      alert("Please fill out all required fields (Name, Phone Number, Email, and Password).");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const newCustomer = {
      name,
      email,
      password,
      Lname,
      DOB,
      Gender,
      Phonenumber1,
      Phonenumber2,
      Address,
    };

    axios
      .post("http://localhost:8070/register", newCustomer)
      .then(() => {
        alert("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setLName("");
        setDOB("");
        setGender("");
        setPhonenumber1("");
        setPhonenumber2("");
        setAddress("");
        navigate("/Login");
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        alert(err.response ? err.response.data.error : "An error occurred");
      });
  }

  return (
    <>
    {/* Navigation Bar*/}
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <a className="navbar-brand" href="/">
          
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
              <a className="nav-link" href="/therapists">
                Therapists
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Profile">
                Profile
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Resources
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/blogs">
                    Blogs
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#faq">
                    FAQ
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#contact">
                    Contact Us
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Login">
                Log In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>





    <div className="Registration-container">
      
        <h2 className="mt-4">Sign Up</h2>
        <form onSubmit={sendData}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="firstname" className="form-label">
                First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="First name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="Lastname" className="form-label">
                Last Name (opt)
              </label>
              <input
                type="text"
                className="form-control"
                id="Lastname"
                placeholder="Last name"
                onChange={(e) => setLName(e.target.value)}
                value={Lname}
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="Phonenumber1" className="form-label">
                Phone Number 1 <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="Phonenumber1"
                placeholder="Phone number"
                onChange={(e) => setPhonenumber1(e.target.value)}
                value={Phonenumber1}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="useremail" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="useremail"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="userpassword" className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="userpassword"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <Link to="/Login" className="text-primary">
             Log in Now
            </Link>
          </p>
        </div>
      
    </div>
  </>
  );
}

export default Addmember;
