import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <div className="sidebar-header"><h2>Admin Panel</h2></div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
          Dashboard
        </Link>
        
        {/* Employees Module */}
        <div className="nav-group">
          <div className="nav-item group-header" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>Employees</span>
            <span>{isMenuOpen ? "▼" : "▶"}</span>
          </div>
          {isMenuOpen && (
            <div className="submenu">
              <Link to="/employees" className={`nav-item sub-item ${location.pathname === "/employees" ? "active" : ""}`}>Emp_List</Link>
              <Link to="/add-employee" className={`nav-item sub-item ${location.pathname === "/add-employee" ? "active" : ""}`}>Add Emp</Link>
            </div>
          )}
        </div>

        {/* --- NEW: Payroll / Salary Module --- */}
        <Link to="/salary" className={`nav-item ${isActive("/salary") ? "active" : ""}`}>
          Payroll
        </Link>

      </nav>
      <div className="sidebar-footer">
        <button onClick={() => { dispatch(logout()); navigate("/"); }} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;