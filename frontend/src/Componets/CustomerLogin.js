import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './CSS/CustomerLogin.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // For bootstrap alert type
  const navigate = useNavigate(); // Use navigate for redirection

  // Check if a token exists when the component mounts (for auto-login behavior)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dash", { replace: true });
    }
  }, [navigate]);

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8070/login", { email, password });
      setMessage(`Welcome back, ${response.data.username}!`);
      setAlertType("success"); // Set alert type to success
      localStorage.setItem("token", response.data.token); // Save the token in localStorage
      // Pass success message to /dash page
      navigate("/dash", { state: { message: `Welcome , ${response.data.username}!`, alertType: "success" } });
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed!");
      setAlertType("danger"); // Set alert type to danger
    }
  };

  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <>
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
              <li className="nav-item"><a className="nav-link" href="/register">Register</a></li>
              {/* Conditionally render the Logout button if the user is logged in */}
              {localStorage.getItem("token") && (
                <li className="nav-item">
                  <button className="nav-link btn btn-danger" onClick={handleLogout}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="Registration-container">
        <h2 className="mt-4">Login</h2>
        <form onSubmit={handleLogin} className="w-60 mt-4">
          <div className="mb-3">
            <label htmlFor="email" className="Loginform-label">Email:</label>
            <input
              type="email"
              className="Loginform-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="Loginform-label">Password:</label>
            <input
              type="password"
              className="Loginform-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="Loginbtn btn-primary w-100">Login</button>
        </form>

        {/* Show the alert message based on login status */}
        {message && (
          <div className={`alert alert-${alertType} mt-4`} role="alert">
            {message}
          </div>
        )}
        <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
