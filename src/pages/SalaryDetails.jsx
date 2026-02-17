import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { calculateBreakup } from '../utils/salaryUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [incrementHistory, setIncrementHistory] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // --- 1. Fix useEffect Warning: Wrap fetchData in useCallback ---
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 2. Fix Unused jsPDF/autoTable: Restore PDF Logic ---
  const handleDownloadPDF = () => {
    if (!employee) return;
    const doc = new jsPDF();
    const breakupData = calculateBreakup(employee.salary);
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text("Salary Pay Slip", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Employee: ${employee.name}`, 14, 32);
    doc.text(`Role: ${employee.role}`, 14, 38);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

    // Breakup Table
    autoTable(doc, {
      startY: 50,
      head: [['Component', 'Amount (₹)']],
      body: breakupData.map(item => [item.name, item.value.toLocaleString()]),
      foot: [['Total Gross Salary', employee.salary.toLocaleString()]],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Payroll History (Credits)
    if (payrollHistory.length > 0) {
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Payment History", 14, finalY);
      
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Month', 'Amount', 'Date']],
        body: payrollHistory.map(p => [
          `${p.month} ${p.year}`,
          p.amount.toLocaleString(),
          new Date(p.paymentDate).toLocaleDateString()
        ]),
        theme: 'striped'
      });
    }

    doc.save(`PaySlip_${employee.name}.pdf`);
    toast.success("PDF Downloaded!");
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await API.post(`/employees/${id}/send-payslip`);
      toast.success("Pay slip email sent!");
    } catch (error) {
      toast.error("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCreditSalary = async () => {
    if(!window.confirm(`Credit salary of ₹${employee.salary.toLocaleString()} for this month?`)) return;

    setIsProcessing(true);
    try {
      const res = await API.post(`/employees/${id}/credit-salary`);
      toast.success(res.data.message);
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !employee) {
    return <div className="layout"><Sidebar /><div className="content"><p>Loading...</p></div></div>;
  }

  const breakup = calculateBreakup(employee.salary);
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h2>Salary Details</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn" 
              style={{ background: '#4f46e5', color: 'white' }} 
              onClick={handleCreditSalary} 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "💰 Credit Salary"}
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
            <button className="btn" style={{ background: '#10b981', color: 'white' }} onClick={handleSendEmail} disabled={isSending}>
              {isSending ? "Sending..." : "Email Slip"}
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div className="avatar-placeholder" style={{width: 80, height: 80, fontSize: '2rem'}}>
             {employee.profileImage ? <img src={`http://localhost:5000/${employee.profileImage.replace(/\\/g, "/")}`} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} alt="" /> : "👤"}
           </div>
           <div>
             <h3 style={{margin:0}}>{employee.name}</h3>
             <p style={{margin: '5px 0', color: 'var(--secondary)'}}>{employee.role}</p>
             <small>ID: {employee.employeeCode ? employee.employeeCode.split('-')[0].toUpperCase() : employee.id}</small>
           </div>
        </div>

        {/* Payroll History (Credits) */}
        <div className="card">
          <h4>Monthly Payment Ledger</h4>
          {payrollHistory.length > 0 ? (
            <table className="styled-table">
              <thead><tr><th>Month</th><th>Date Paid</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {payrollHistory.map((pay) => (
                  <tr key={pay.id}>
                    <td>{pay.month} {pay.year}</td>
                    <td>{formatDate(pay.paymentDate)}</td>
                    <td style={{fontWeight:'bold'}}>₹{pay.amount.toLocaleString()}</td>
                    <td><span className="badge" style={{background: '#d1fae5', color: '#065f46'}}>✅ {pay.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{color:'gray', fontStyle:'italic'}}>No salary credited yet.</p>}
        </div>

        {/* --- 3. Fix Unused incrementHistory: Display Contract History --- */}
        <div className="card">
          <h4>Salary Increment History</h4>
          {incrementHistory.length > 0 ? (
            <table className="styled-table">
              <thead><tr><th>Date Changed</th><th>Previous Salary</th><th>New Salary</th></tr></thead>
              <tbody>
                {incrementHistory.map((h) => (
                  <tr key={h.id}>
                    <td>{formatDate(h.incrementDate)}</td>
                    <td style={{textDecoration:'line-through', color:'#94a3b8'}}>₹{h.previousSalary.toLocaleString()}</td>
                    <td style={{color:'#10b981', fontWeight:'bold'}}>₹{h.newSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{color:'gray', fontStyle:'italic'}}>No salary changes recorded.</p>}
        </div>

        {/* Breakup Table */}
        <div className="card">
          <h4>Current Earnings Breakdown</h4>
          <table className="styled-table">
            <thead><tr><th>Component</th><th>Amount</th></tr></thead>
            <tbody>
              {breakup.map(item => (
                <tr key={item.name}><td>{item.name}</td><td>₹{item.value.toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SalaryDetails;