import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployees,
  deleteEmployee,
  fetchEmployeeStats,
} from "../features/employees/employeeSlice";
import Sidebar from "../components/Sidebar";
import Charts from "../components/Charts";
import StatCard from "../components/StatCard";
import ConfirmationModal from "../components/ConfirmationModal"; // Import Modal
import { downloadCSV } from "../utils/exportToCSV.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { list, loading, stats, totalPages, currentPage } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchEmployees({ page: 1, search }));
      dispatch(fetchEmployeeStats());
    }, 500);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  // Handle Delete Click (Open Modal)
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  // Confirm Delete Action
  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteEmployee(deleteId)).then(() => {
        dispatch(fetchEmployees({ page: currentPage, search }));
        dispatch(fetchEmployeeStats());
        setIsModalOpen(false);
        setDeleteId(null);
      });
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchEmployees({ page: newPage, search }));
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h2>Dashboard Overview</h2>
        </div>

        <div className="stats-grid">
          <StatCard title="Total Employees" value={stats.totalEmployees} />
          <StatCard title="Total Salary" value={`₹${stats.totalSalary.toLocaleString()}`} />
          <StatCard title="Avg Salary" value={`₹${stats.averageSalary}`} />
          <StatCard title="Top Earner" value={stats.highestPaidEmployee || "N/A"} />
        </div>

        <div className="card">
          <h3>Analytics</h3>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Charts />
          </div>
        </div>

        <div className="card">
          <div className="page-header" style={{ marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
            <h3>Employee Directory</h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: "#10b981", color: "white" }} 
                onClick={() => downloadCSV(list, "Salary_Report.csv")}
              >
                ⬇ Export Report
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/add-employee")}>
                + Add Employee
              </button>
            </div>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: "center" }}>Loading...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: "center" }}>No records found.</td></tr>
                ) : (
                  list.map((emp) => (
                    <tr key={emp.id}>
                      <td><strong>{emp.name}</strong><br /><small style={{ color: "var(--secondary)" }}>{emp.email}</small></td>
                      <td><span className="badge">{emp.role}</span></td>
                      <td>₹{emp.salary.toLocaleString()}</td>
                      <td>
                        <button className="btn btn-edit btn-sm" onClick={() => navigate("/add-employee", { state: { employee: emp } })}>Edit</button>
                        <button className="btn btn-delete btn-sm" onClick={() => handleDeleteClick(emp.id)}>Del</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;