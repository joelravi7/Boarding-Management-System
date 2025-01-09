// Importing necessary libraries
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";


function AdminDashboard() {
  const location = useLocation();

  // Extract message and alertType from location state
  const message = location.state?.message || "";
  const alertType = location.state?.alertType || "";

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (message) {
      // Optionally, you could add logic to auto-dismiss the alert after some time
      console.log("Welcome message displayed:", message);
    }
  }, [message]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Navigation */}
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
                  className={`nav-link ${activeSection === "customer" ? "active" : ""}`}
                  onClick={() => handleSectionClick("customer")}
                >
                  Customer Management
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
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        {message && (
                
                  <div className="nav-link text-danger">{message}</div>
               
              )}

          {/* Overview Panel */}
          {activeSection === null && (
            <section className="row mb-4">
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title">Total Staff</h5>
                    <p className="card-text display-6">12</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title">Total Customers</h5>
                    <p className="card-text display-6">30</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title">Total Rooms</h5>
                    <p className="card-text display-6">15</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Management Sections */}
          {activeSection === "staff" && (
            <section id="staff-management" className="mb-4">
              <h3>Staff Management</h3>
              <button className="btn btn-primary mb-3">Add Staff</button>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>john@example.com</td>
                    <td>Manager</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                  {/* Add more staff rows here */}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "customer" && (
            <section id="customer-management" className="mb-4">
              <h3>Customer Management</h3>
              <button className="btn btn-primary mb-3">Add Customer</button>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Assigned Room</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jane Smith</td>
                    <td>+123456789</td>
                    <td>Room 101</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                  {/* Add more customer rows here */}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "room" && (
            <section id="room-management">
              <h3>Room Management</h3>
              <button className="btn btn-primary mb-3">Add Room</button>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>101</td>
                    <td>Occupied</td>
                    <td>Jane Smith</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                  {/* Add more room rows here */}
                </tbody>
              </table>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
