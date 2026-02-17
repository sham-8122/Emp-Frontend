import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees, deleteEmployee, fetchEmployeeStats } from "../features/employees/employeeSlice";
import Sidebar from "../components/Sidebar";
import Charts from "../components/Charts";
import StatCard from "../components/StatCard"; // This will now be used
import ConfirmationModal from "../components/ConfirmationModal";
import TableSkeleton from "../components/TableSkeleton";
import { downloadCSV } from "../utils/exportToCSV.js";
import { toast } from "react-toastify";

const jobRoles = [
  "Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "Product Manager", "Project Manager", "QA Engineer", "DevOps Engineer", "Data Scientist", "HR Manager", "Sales Executive", "Intern"
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("createdAt_DESC");
  const [filterRole, setFilterRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { list, loading, stats, totalPages, currentPage } = useSelector((state) => state.employees); // 'stats' will now be used

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchEmployees({ page: 1, search, sort: sortOption, role: filterRole }));
      dispatch(fetchEmployeeStats());
    }, 500);
    return () => clearTimeout(timer);
  }, [search, sortOption, filterRole, dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteEmployee(deleteId)).unwrap().then(() => {
        dispatch(fetchEmployees({ page: currentPage, search, sort: sortOption, role: filterRole }));
        dispatch(fetchEmployeeStats());
        toast.success("Employee deleted.");
      }).catch(() => toast.error("Failed to delete."));
      setIsModalOpen(false);
      setDeleteId(null);
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchEmployees({ page: newPage, search, sort: sortOption, role: filterRole }));
  };

  const renderProfileImage = (path) => {
    if (!path) return <div className="avatar-placeholder">?</div>;
    return <img src={`http://localhost:5000/${path.replace(/\\/g, "/")}`} alt="profile" className="avatar-img" />;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header"><h2>Dashboard Overview</h2></div>

        {/* --- UI RESTORED: This section uses StatCard and stats --- */}
        <div className="stats-grid">
          <StatCard title="Total Employees" value={stats.totalEmployees} />
          <StatCard title="Total Salary" value={`₹${stats.totalSalary.toLocaleString()}`} />
          <StatCard title="Avg Salary" value={`₹${stats.averageSalary}`} />
          <StatCard title="Top Earner" value={stats.highestPaidEmployee || "N/A"} />
        </div>

        <div className="card"><h3>Analytics</h3><div style={{ display: "flex", justifyContent: "center", width: "100%" }}><Charts /></div></div>

        <div className="card">
          <div className="page-header" style={{ marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
            <h3>Employee Directory</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-sm" style={{ backgroundColor: "#10b981", color: "white" }} onClick={() => downloadCSV(list, "Salary_Report.csv")}>
                ⬇ Export Report
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/add-employee")}>
                + Add Employee
              </button>
            </div>
          </div>

          <div className="filter-controls">
            <input type="text" className="search-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">Filter by Role</option>
              {jobRoles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select className="filter-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="createdAt_DESC">Sort by: Newest</option>
              <option value="name_ASC">Sort by: Name (A-Z)</option>
              <option value="salary_DESC">Sort by: Salary (High-Low)</option>
            </select>
          </div>

          <div className="table-container">
            <table className="styled-table">
              <thead><tr><th>Name</th><th>Role</th><th>Salary</th><th>Actions</th></tr></thead>
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
                    <td>₹{emp.salary.toLocaleString()}</td>
                    <td>
                        <button className="btn btn-sm" style={{ background: '#10b981', color: 'white', marginRight: '5px' }} onClick={() => navigate(`/employees/${emp.employeeCode}/salary`)} title="View Salary Details">Pay Slip</button>         
                        <button className="btn btn-edit btn-sm" onClick={() => navigate("/add-employee", { state: { employee: emp } })}>Edit</button>     
                        <button className="btn btn-delete btn-sm" onClick={() => handleDeleteClick(emp.employeeCode)}>Del</button>
                    </td>
                  </tr>
                ))}
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
      <ConfirmationModal isOpen={isModalOpen} onConfirm={handleConfirmDelete} onClose={() => setIsModalOpen(false)} title="Confirm Deletion" message="Are you sure?" />
    </div>
  );
};

export default Dashboard;