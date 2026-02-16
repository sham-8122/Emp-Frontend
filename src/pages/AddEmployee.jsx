import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import EmployeeForm from "../components/EmployeeForm";

const AddEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get data passed from Employee List
  const editingData = location.state?.employee || null;

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h2>{editingData ? "Update Employee" : "Add New Employee"}</h2>
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <EmployeeForm 
            editing={editingData} 
            onSuccess={() => navigate("/employees")} 
          />
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;