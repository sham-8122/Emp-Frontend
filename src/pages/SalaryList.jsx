import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../features/employees/employeeSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TableSkeleton from "../components/TableSkeleton";

const SalaryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, totalPages, currentPage } = useSelector((state) => state.employees);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch employees (reusing existing logic)
    const timer = setTimeout(() => {
      dispatch(fetchEmployees({ page: 1, search }));
    }, 500);
    return () => clearTimeout(timer);
  }, [search, dispatch]);

  const renderProfileImage = (path) => {
    if (!path) return <div className="avatar-placeholder">?</div>;
    return <img src={`http://localhost:5000/${path.replace(/\\/g, "/")}`} alt="profile" className="avatar-img" />;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h2>Payroll Directory</h2>
        </div>

        <div className="card">
          <div className="filter-controls">
             <input 
              type="text" 
              className="search-input" 
              placeholder="Search employee for payslip..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Current Salary (CTC)</th>
                  <th>Payslip</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton rows={5} columns={4} /> : list.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {renderProfileImage(emp.profileImage)}
                        <div><strong>{emp.name}</strong><br /><small>{emp.email}</small></div>
                      </div>
                    </td>
                    <td><span className="badge">{emp.role}</span></td>
                    <td style={{ fontWeight: 'bold', color: '#4f46e5' }}>₹{emp.salary.toLocaleString()}</td>
                    <td>
                      {/* Navigate to the specific Salary Details Page */}
                                    <button 
                    className="btn btn-sm" 
                    style={{ background: '#10b981', color: 'white' }} 
                    onClick={() => navigate(`/employees/${emp.employeeCode}/salary`)}
                    >
                    Generate Slip →
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Reuse */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i} 
                  onClick={() => dispatch(fetchEmployees({ page: i + 1, search }))} 
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryList;