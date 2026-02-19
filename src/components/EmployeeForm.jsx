import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addEmployee, updateEmployee } from "../features/employees/employeeSlice";
import { toast } from "react-toastify";

// --- 1. FULL LIST OF JOB ROLES ---
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
  "HR Manager",
  "Sales Executive",
  "Intern"
];

const EmployeeForm = ({ editing, setEditing, onSuccess }) => {
  const dispatch = useDispatch();
  
  // Form State
  const [form, setForm] = useState({ name: "", email: "", role: "", salary: "" });
  const [image, setImage] = useState(null); // File state

  // Pre-fill form if editing
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        role: editing.role || "", 
        salary: editing.salary || "",
      });
    } else {
      // Reset if not editing
      setForm({ name: "", email: "", role: "", salary: "" });
      setImage(null);
    }
  }, [editing]);

  // Handle Text/Select Inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // Handle File Input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload (Required for Multer)
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("role", form.role);
    formData.append("salary", form.salary);
    
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editing) {
        // --- FIX: Use employeeCode instead of id to match Backend lookup logic ---
        const identifier = editing.employeeCode || editing.id;

        await dispatch(updateEmployee({ 
          id: identifier, 
          updatedData: formData 
        })).unwrap();
        
        toast.success("Employee updated successfully!");
        if (setEditing) setEditing(null);
      } else {
        await dispatch(addEmployee(formData)).unwrap();
        toast.success("New employee added!");
      }
      
      if (onSuccess) onSuccess();
      
      // Reset Form
      setForm({ name: "", email: "", role: "", salary: "" });
      setImage(null);
    } catch (error) {
      console.error("Update/Create Failed:", error);
      toast.error("Operation failed. Please check if all fields are correct.");
    }
  };

  return (
    <div className="card">
      <h3>{editing ? "Edit Employee" : "Add New Employee"}</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Profile Picture Upload Section */}
        <div className="form-group" style={{ textAlign: "center", marginBottom: "20px" }}>
          <label htmlFor="file-upload" style={{ cursor: "pointer", display: "inline-block" }}>
            <div style={{ 
              width: "100px", height: "100px", borderRadius: "50%", 
              background: "#e2e8f0", margin: "0 auto", overflow: "hidden", 
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid var(--primary)"
            }}>
              {/* Preview Logic */}
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : editing && editing.profileImage ? (
                <img src={`http://localhost:5000/${editing.profileImage.replace(/\\/g, "/")}`} alt="Current" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "30px", color: "#64748b" }}>📷</span>
              )}
            </div>
            <div style={{ marginTop: "10px", color: "var(--primary)", fontSize: "0.9rem", fontWeight: "bold" }}>
              {editing ? "Change Photo" : "Upload Photo"}
            </div>
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>

        {/* Name Input */}
        <div className="form-group">
          <input className="form-control" name="name" value={form.name} placeholder="Name" onChange={handleChange} required />
        </div>

        {/* Email Input */}
        <div className="form-group">
          <input className="form-control" name="email" value={form.email} placeholder="Email" onChange={handleChange} required />
        </div>
        
        {/* Role Dropdown */}
        <div className="form-group">
          <select 
            className="form-control" 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            required
            style={{ backgroundColor: "white" }}
          >
            <option value="" disabled>Select a Role</option>
            {jobRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Input */}
        <div className="form-group">
          <input className="form-control" type="number" name="salary" value={form.salary} placeholder="Salary" onChange={handleChange} required />
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          {editing ? "Update Employee" : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;