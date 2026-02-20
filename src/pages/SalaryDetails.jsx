import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Plus, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  FileText
} from 'lucide-react';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [incrementHistory, setIncrementHistory] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); 
  const [modalMode, setModalMode] = useState(null); 
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
      toast.error("Failed to load records.");
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tableRows = employee ? [
    { key: 'basic', label: 'Basic Salary', value: employee.basic, type: 'standard' },
    { key: 'hra', label: 'HRA', value: employee.hra, type: 'standard' },
    { key: 'da', label: 'DA', value: employee.da, type: 'standard' },
    { key: 'travel', label: 'Travel Allowance', value: employee.travel, type: 'standard' },
    { key: 'special', label: 'Special Allowance', value: employee.special, type: 'standard' },
    ...(employee.Allowances || []).map(a => ({ key: a.id, label: a.label, value: a.amount, type: 'custom' }))
  ] : [];

  const handleSave = async () => {
    if (!form.amount || isNaN(form.amount)) return toast.error("Enter valid amount");
    setIsProcessing(true);
    try {
      if (modalMode === 'add') {
        await API.post(`/employees/${id}/allowance`, form);
        toast.success("Allowance Added.");
      } else {
        const payload = { [selectedRow.key]: parseFloat(form.amount) };
        await API.put(`/employees/${id}`, payload);
        toast.success("Component Updated.");
      }
      setModalMode(null);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error("Save Failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreditSalary = async () => {
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`PAYSLIP: ${employee.name}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Component', 'Amount (INR)']],
      body: tableRows.map(r => [r.label, `Rs. ${r.value.toLocaleString()}`]),
      foot: [['TOTAL GROSS CTC', `Rs. ${employee.salary.toLocaleString()}`]],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    doc.save(`${employee.name}_Payslip.pdf`);
  };

  if (loading || !employee) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse font-black text-slate-400 uppercase tracking-widest">Accessing Ledger...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      
      <main className="ml-sidebar flex-1 p-4 lg:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/salary')} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <ArrowLeft size={20} className="text-slate-500 dark:text-slate-400" />
             </button>
             <div>
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{employee.name}</h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-[0.3em]">Financial Audit Records</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <button onClick={() => setModalMode('add')} className="px-5 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
               <Plus size={14} /> Add Allowance
             </button>
             <button onClick={handleDownloadPDF} className="px-5 py-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
               <Download size={14} /> PDF
             </button>
             <button 
                disabled={isProcessing}
                onClick={handleCreditSalary}
                className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none transition-all disabled:bg-slate-300 dark:disabled:bg-slate-800 flex items-center gap-2"
             >
                {isProcessing ? "Processing..." : <><Send size={14} /> Credit Salary</>}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* Component Breakdown Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
               <div className="px-10 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <h4 className="font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                    <FileText size={14} /> Earnings Breakdown
                  </h4>
                  <span className="text-[10px] text-indigo-400 font-bold italic">Click row to edit value</span>
               </div>
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {tableRows.map(row => (
                      <tr 
                        key={row.key} 
                        onClick={() => { setSelectedRow(row); setModalMode('edit'); setForm({ label: row.label, amount: row.value }); }}
                        className="hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                      >
                        <td className="px-10 py-5 font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{row.label}</td>
                        <td className="px-10 py-5 text-right font-black text-slate-800 dark:text-white tracking-tight">₹{row.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-indigo-600 dark:bg-indigo-900 text-white">
                    <tr>
                       <td className="px-10 py-6 font-black uppercase text-xs tracking-widest">Total Annual Gross (CTC)</td>
                       <td className="px-10 py-6 text-right font-black text-2xl tracking-tighter">₹{employee.salary.toLocaleString()}</td>
                    </tr>
                  </tfoot>
               </table>
            </div>

            {/* Payment Ledger */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
               <div className="px-10 py-6 border-b border-slate-50 dark:border-slate-800 font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest flex items-center gap-2">
                 <CheckCircle size={14} /> Transaction Ledger
               </div>
               {payrollHistory.length > 0 ? (
                 <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                       {payrollHistory.map(p => (
                         <tr key={p.id} className="text-sm font-bold">
                            <td className="px-10 py-5 text-slate-500 dark:text-slate-400">{p.month} {p.year}</td>
                            <td className="px-10 py-5 text-indigo-500 dark:text-indigo-400 uppercase text-[10px] tracking-widest">Dispatched on {new Date(p.paymentDate).toLocaleDateString()}</td>
                            <td className="px-10 py-5 text-right font-black text-slate-800 dark:text-white uppercase text-[10px]">SUCCESS: ₹{p.amount.toLocaleString()}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               ) : (
                 <div className="p-16 text-center text-slate-300 dark:text-slate-600 font-bold text-sm italic uppercase tracking-widest">No payout history recorded.</div>
               )}
            </div>
          </div>

          {/* Profile Sidebar */}
          <div className="space-y-6">
            <div className="bg-indigo-600 dark:bg-indigo-900 p-10 rounded-[50px] text-white self-start shadow-2xl shadow-indigo-200 dark:shadow-none border-4 border-white dark:border-slate-800 transition-colors">
               <div className="w-24 h-24 bg-white/20 rounded-[35px] flex items-center justify-center overflow-hidden mb-8 shadow-inner">
                 {employee.profileImage ? (
                    <img src={`http://localhost:5000/${employee.profileImage.replace(/\\/g, "/")}`} className="w-full h-full object-cover" alt="" />
                 ) : (
                    <span className="text-4xl opacity-50">👤</span>
                 )}
               </div>
               <h3 className="text-2xl font-black tracking-tight leading-tight">{employee.name}</h3>
               <p className="text-indigo-200 dark:text-indigo-300 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 mb-8">{employee.role}</p>
               <div className="space-y-6 pt-6 border-t border-white/10">
                  <div><p className="text-[9px] uppercase font-black opacity-40 mb-1 tracking-widest">Official Email</p><p className="font-bold text-sm truncate">{employee.email}</p></div>
                  <div><p className="text-[9px] uppercase font-black opacity-40 mb-1 tracking-widest">System Identity</p><p className="font-mono text-[9px] break-all opacity-70">{employee.employeeCode}</p></div>
               </div>
            </div>

            {/* Increment Log */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                <h4 className="font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-4 text-center flex items-center justify-center gap-2">
                  <TrendingUp size={14} /> Increment Timeline
                </h4>
                <div className="space-y-4">
                    {incrementHistory.map(h => (
                        <div key={h.id} className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                              <Calendar size={10} /> {new Date(h.incrementDate).toLocaleDateString()}
                            </span>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 line-through">₹{h.previousSalary.toLocaleString()}</span>
                                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">₹{h.newSalary.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {incrementHistory.length === 0 && <div className="text-center text-xs text-slate-300 dark:text-slate-600 font-bold">No changes recorded.</div>}
                </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {modalMode && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 text-center">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[50px] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 uppercase tracking-widest text-xs">{modalMode === 'add' ? 'New Allowance Entry' : `Modify ${selectedRow?.label}`}</h3>
              {modalMode === 'add' && (
                <input 
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl mb-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600" 
                  placeholder="Component Name (e.g. Internet)" 
                  value={form.label} 
                  onChange={e => setForm({...form, label: e.target.value})} 
                />
              )}
              <input 
                type="number" 
                className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl mb-10 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-black text-2xl text-center" 
                placeholder="Amount (₹)" 
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})} 
                autoFocus 
              />
              <div className="flex gap-4">
                <button onClick={() => setModalMode(null)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all">Apply Change</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalaryDetails;