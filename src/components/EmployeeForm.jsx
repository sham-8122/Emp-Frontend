import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addEmployee, updateEmployee } from "../features/employees/employeeSlice";

// --- NEW: List of IT job roles ---
const jobRoles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Data Scientist",
];

const EmployeeForm = ({ editing, setEditing, onSuccess }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", role: "", salary: "" });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        role: editing.role || "",
        salary: editing.salary || "",
      });
    }
  }, [editing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, salary: Number(form.salary) };
    try {
      if (editing) {
        await dispatch(updateEmployee({ id: editing.id, updatedData: payload })).unwrap();
        if (setEditing) setEditing(null);
      } else {
        await dispatch(addEmployee(payload)).unwrap();
      }
      if (onSuccess) onSuccess();
      setForm({ name: "", email: "", role: "", salary: "" });
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return (
    <div className="card">
      <h3>{editing ? "Edit Employee" : "Add New Employee"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><input className="form-control" name="name" value={form.name} placeholder="Name" onChange={handleChange} required /></div>
        <div className="form-group"><input className="form-control" name="email" value={form.email} placeholder="Email" onChange={handleChange} required /></div>
        
        {/* --- MODIFIED: Replaced text input with a select dropdown --- */}
        <div className="form-group">
          <select className="form-control" name="role" value={form.role} onChange={handleChange} required>
            <option value="" disabled>Select a Role</option>
            {jobRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="form-group"><input className="form-control" type="number" name="salary" value={form.salary} placeholder="Salary" onChange={handleChange} required /></div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          {editing ? "Update Employee" : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;