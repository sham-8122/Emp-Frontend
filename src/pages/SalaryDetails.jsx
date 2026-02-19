import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [incrementHistory, setIncrementHistory] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Loading States for Buttons
  const [isProcessing, setIsProcessing] = useState(false); // FIXED: Now used
  const [isSending, setIsSending] = useState(false);

  // Interaction States (Breakdown Table)
  const [selectedRow, setSelectedRow] = useState(null); 
  const [modalMode, setModalMode] = useState(null); // 'edit' or 'add'
  const [form, setForm] = useState({ label: "", amount: "" });

  const fetchData = useCallback(async () => {
    try {
      const [empRes, histRes, payRes] = await Promise.all([
        API.get(`/employees/${id}`),
        API.get(`/employees/${id}/history`),
        API.get(`/employees/${id}/payroll`)
      ]);
      setEmployee(empRes.data);
      setIncrementHistory(histRes.data);
      setPayrollHistory(payRes.data);
    } catch (error) {
      toast.error("Failed to fetch data.");
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Combine DB fields with Custom Allowances
  const tableRows = employee ? [
    { key: 'basic', label: 'Basic Salary', value: employee.basic, type: 'standard' },
    { key: 'hra', label: 'HRA', value: employee.hra, type: 'standard' },
    { key: 'da', label: 'DA', value: employee.da, type: 'standard' },
    { key: 'travel', label: 'Travel Allowance', value: employee.travel, type: 'standard' },
    { key: 'special', label: 'Special Allowance', value: employee.special, type: 'standard' },
    ...(employee.Allowances || []).map(a => ({ key: a.id, label: a.label, value: a.amount, type: 'custom' }))
  ] : [];

  // --- Handlers ---
  const handleRowClick = (row) => setSelectedRow(row);

  const handleOpenAdd = () => {
    setForm({ label: "", amount: "" });
    setModalMode('add');
  };

  const handleOpenEdit = () => {
    setForm({ label: selectedRow.label, amount: selectedRow.value });
    setModalMode('edit');
  };

  const handleSave = async () => {
    if (!form.amount || isNaN(form.amount)) return toast.error("Enter a valid amount");
    setIsProcessing(true);
    try {
      if (modalMode === 'add') {
        await API.post(`/employees/${id}/allowance`, form);
        toast.success("Allowance added!");
      } else {
        const payload = { [selectedRow.key]: parseFloat(form.amount) };
        await API.put(`/employees/${id}`, payload);
        toast.success(`${selectedRow.label} updated!`);
      }
      setModalMode(null);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error("Save failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreditSalary = async () => {
    if(!window.confirm(`Credit salary of ₹${employee.salary.toLocaleString()} for this month?`)) return;
    setIsProcessing(true);
    try {
      const res = await API.post(`/employees/${id}/credit-salary`);
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await API.post(`/employees/${id}/send-payslip`);
      toast.success("Email sent!");
    } catch (error) {
      toast.error("Email failed.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Pay Slip: ${employee.name}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Component', 'Amount']],
      body: tableRows.map(r => [r.label, `Rs. ${r.value.toLocaleString()}`]),
      foot: [['Total CTC', `Rs. ${employee.salary.toLocaleString()}`]]
    });
    doc.save(`${employee.name}_Salary.pdf`);
  };

  if (loading || !employee) return <div className="layout"><Sidebar /><div className="content">Loading...</div></div>;

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h2>Salary Details</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" style={{ background: '#4f46e5', color: 'white' }} onClick={handleCreditSalary} disabled={isProcessing}>
              {isProcessing ? "Wait..." : "Credit Salary"}
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
            <button className="btn" style={{ background: '#10b981', color: 'white' }} onClick={handleSendEmail} disabled={isSending}>
              {isSending ? "Sending..." : "Email Slip"}
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div className="avatar-placeholder" style={{width: 60, height: 60, fontSize: '1.5rem'}}>
             {employee.profileImage ? <img src={`http://localhost:5000/${employee.profileImage.replace(/\\/g, "/")}`} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} alt="" /> : "👤"}
           </div>
           <div>
             <h3 style={{margin:0}}>{employee.name}</h3>
             <small style={{color:'var(--secondary)'}}>ID: {employee.employeeCode?.split('-')[0].toUpperCase()}</small>
           </div>
        </div>

        {/* Breakdown Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{margin:0}}>Current Earnings Breakdown</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-sm" style={{ background: '#10b981', color: 'white' }} onClick={handleOpenAdd}>+ Add Allowance</button>
              {selectedRow && (
                <button className="btn btn-sm" style={{ background: '#f59e0b', color: 'white' }} onClick={handleOpenEdit}>✏️ Edit {selectedRow.label}</button>
              )}
            </div>
          </div>
          <table className="styled-table interactive-table">
            <thead><tr><th>Component</th><th>Amount</th></tr></thead>
            <tbody>
              {tableRows.map(row => (
                <tr 
                  key={row.key} 
                  onClick={() => handleRowClick(row)}
                  className={selectedRow?.key === row.key ? "selected-row" : ""}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{row.label}</td>
                  <td>₹{row.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                <td>Total Gross Salary (CTC)</td>
                <td style={{color: 'var(--primary)'}}>₹{employee.salary.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Increment History */}
        <div className="card">
          <h4>Increment History</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Previous</th>
                <th>New</th>
                <th style={{color:'#10b981'}}>Increment (+)</th>
              </tr>
            </thead>
            <tbody>
              {incrementHistory.map(h => (
                <tr key={h.id}>
                  <td>{formatDate(h.incrementDate)}</td>
                  <td style={{textDecoration:'line-through', color:'#94a3b8'}}>₹{h.previousSalary.toLocaleString()}</td>
                  <td>₹{h.newSalary.toLocaleString()}</td>
                  <td style={{color:'#10b981', fontWeight:'bold'}}>+ ₹{(h.newSalary - h.previousSalary).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Ledger */}
        <div className="card">
          <h4>Monthly Payment Ledger</h4>
          {payrollHistory.length > 0 ? (
            <table className="styled-table">
              <thead><tr><th>Month</th><th>Date Paid</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {payrollHistory.map(p => (
                  <tr key={p.id}>
                    <td>{p.month} {p.year}</td>
                    <td>{formatDate(p.paymentDate)}</td>
                    <td>₹{p.amount.toLocaleString()}</td>
                    <td><span className="badge" style={{background:'#d1fae5', color:'#065f46'}}>✅ {p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{color:'gray', fontStyle:'italic'}}>No payments recorded.</p>}
        </div>

        {/* Modal */}
        {modalMode && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{modalMode === 'add' ? 'Add New Allowance' : `Edit ${selectedRow?.label}`}</h3>
              {modalMode === 'add' && (
                <input className="form-control" placeholder="Allowance Name" value={form.label} onChange={e => setForm({...form, label: e.target.value})} />
              )}
              <input type="number" className="form-control" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} autoFocus />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setModalMode(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={isProcessing}>{isProcessing ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryDetails;