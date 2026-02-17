import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../features/employees/employeeSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConfirmationModal from "../components/ConfirmationModal";
import TableSkeleton from "../components/TableSkeleton";
import { toast } from "react-toastify";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, totalPages, currentPage } = useSelector((state) => state.employees);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { dispatch(fetchEmployees({ page: 1 })); }, [dispatch]);

  // --- This function caused the warning because it wasn't connected to a button ---
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteEmployee(deleteId)).unwrap().then(() => {
        toast.success("Employee deleted!");
        dispatch(fetchEmployees({ page: currentPage }));
      }).catch(() => toast.error("Failed to delete."));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const renderProfileImage = (path) => {
    if (!path) return <div className="avatar-placeholder">?</div>;
    return <img src={`http://localhost:5000/${path.replace(/\\/g, "/")}`} alt="profile" className="avatar-img" />;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h2>Employee List</h2>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/add-employee")}>+ Add New</button>
        </div>
        <div className="card table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name / ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <TableSkeleton rows={5} columns={5} /> : list.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {renderProfileImage(emp.profileImage)}
                      <div>
                        <strong>{emp.name}</strong>
                        <br />
                        {/* Display UUID if available, else DB ID */}
                        <small style={{ color: "var(--secondary)", fontSize:'0.7rem' }}>
                          ID: {emp.employeeCode ? emp.employeeCode.split('-')[0].toUpperCase() : emp.id}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td><span className="badge">{emp.role}</span></td>
                  <td>₹{emp.salary.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      {/* 1. Pay Slip Button */}
                    <button className="btn btn-sm" style={{ background: '#10b981', color: 'white', marginRight: '5px' }} onClick={() => navigate(`/employees/${emp.employeeCode}/salary`)} title="View Salary Details">Pay Slip</button>

                      {/* 2. Edit Button */}
                    <button className="btn btn-edit btn-sm" onClick={() => navigate("/add-employee", { state: { employee: emp } })}>Edit</button>

                      {/* 3. Delete Button (Fixes the warning) */}
                    <button className="btn btn-delete btn-sm" onClick={() => handleDeleteClick(emp.employeeCode)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => dispatch(fetchEmployees({ page: i + 1 }))} className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" message="Are you sure?" />
    </div>
  );
};

export default EmployeeList;