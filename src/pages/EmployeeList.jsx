import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../features/employees/employeeSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConfirmationModal from "../components/ConfirmationModal";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, totalPages, currentPage } = useSelector((state) => state.employees);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { dispatch(fetchEmployees({ page: 1 })); }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteEmployee(deleteId)).then(() => {
        dispatch(fetchEmployees({ page: currentPage }));
        setIsModalOpen(false);
        setDeleteId(null);
      });
    }
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
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Salary</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5">Loading...</td></tr> : list.map((emp) => (
                <tr key={emp.id}>
                  <td><strong>{emp.name}</strong></td>
                  <td>{emp.email}</td>
                  <td><span className="badge">{emp.role}</span></td>
                  <td>₹{emp.salary.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-edit btn-sm" onClick={() => navigate("/add-employee", { state: { employee: emp } })}>Edit</button>
                    <button className="btn btn-delete btn-sm" onClick={() => handleDeleteClick(emp.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => dispatch(fetchEmployees({ page: i + 1 }))} className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        title="Delete Employee"
        message="Are you sure you want to remove this employee record?"
        onConfirm={handleConfirmDelete}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EmployeeList;