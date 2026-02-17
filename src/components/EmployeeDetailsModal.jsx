import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import API from "../services/api"; 
import { calculateBreakup } from "../utils/salaryUtils";
// Removed 'Legend' from the import below to fix Line 4:40
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"; 
import { formatEmpId } from '../utils/stringUtils';
const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // --- MODIFIED: Wrapped fetchHistory in useCallback to fix Line 17:6 ---
  const fetchHistory = useCallback(async () => {
    if (!employee) return;
    setLoadingHistory(true);
    try {
      const res = await API.get(`/employees/${employee.id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [employee]); // Function updates only when the employee object changes

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      fetchHistory();
    }
  }, [isOpen, fetchHistory]); // fetchHistory is now a stable dependency

  if (!isOpen || !employee) return null;

  const breakupData = calculateBreakup(employee.salary);
  const imageUrl = employee.profileImage 
    ? `http://localhost:5000/${employee.profileImage.replace(/\\/g, "/")}`
    : null;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '600px', padding: 0 }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--teal-main))', padding: '2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '20px', borderRadius: '8px 8px 0 0' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {imageUrl ? <img src={imageUrl} style={{ width: '100%', height:'100%', objectFit:'cover'}} alt="" /> : <span style={{fontSize:'2rem'}}>👤</span>}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{employee.name}</h2>
            <p style={{ margin: '5px 0 0', opacity: 0.9 }}>{employee.role}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          <button 
            onClick={() => setActiveTab("overview")}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'overview' ? '#f8fafc' : 'white', fontWeight: activeTab === 'overview' ? 'bold' : 'normal', cursor: 'pointer', borderBottom: activeTab === 'overview' ? '3px solid var(--primary)' : 'none' }}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("salary")}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'salary' ? '#f8fafc' : 'white', fontWeight: activeTab === 'salary' ? 'bold' : 'normal', cursor: 'pointer', borderBottom: activeTab === 'salary' ? '3px solid var(--primary)' : 'none' }}
          >
            Salary Structure
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', maxHeight: '400px', overflowY: 'auto' }}>
          
          {activeTab === "overview" && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div><label style={{color:'gray', fontSize:'0.8rem'}}>Email</label><div style={{fontWeight:600}}>{employee.email}</div></div>
              <div><label style={{color:'gray', fontSize:'0.8rem'}}>Joined</label><div style={{fontWeight:600}}>{formatDate(employee.createdAt)}</div></div>
              <div><label style={{color:'gray', fontSize:'0.8rem'}}>Current CTC</label><div style={{fontWeight:600, color:'#10b981'}}>₹{employee.salary.toLocaleString()}</div></div>
              <div><label style={{color:'gray', fontSize:'0.8rem'}}>Employee ID</label><div style={{fontWeight:600}}>EMP-{employee.employeeCode ? employee.employeeCode.split('-')[0].toUpperCase() : employee.id}</div></div>         
          </div>
          )}

          {activeTab === "salary" && (
            <div>
              <h4 style={{marginTop:0}}>Monthly Breakup (Estimated)</h4>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '50%', height: '200px' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={breakupData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                        {breakupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ width: '50%', fontSize: '0.85rem' }}>
                  {breakupData.map((item) => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '10px', height: '10px', background: item.color, borderRadius: '50%', display:'inline-block' }}></span>
                        {item.name}
                      </span>
                      <strong>₹{item.value.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <h4 style={{marginBottom:'10px', marginTop:'20px'}}>Increment History</h4>
              {loadingHistory ? <p>Loading...</p> : history.length === 0 ? (
                <p style={{ color: '#999', fontStyle: 'italic' }}>No salary changes recorded.</p>
              ) : (
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                  {history.map((h) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                      <span style={{ color: '#64748b' }}>{formatDate(h.incrementDate)}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{h.previousSalary.toLocaleString()}</span>
                        <span>➡️</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>₹{h.newSalary.toLocaleString()}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: '1rem 2rem', textAlign: 'right', borderTop: '1px solid #eee' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;