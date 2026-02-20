import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { fetchDeductions, addDeduction, removeDeduction } from '../features/deductions/deductionSlice';
import { 
  ArrowLeft, Send, Calculator, PlusCircle, AlertCircle, Wallet, Edit3, Trash2 
} from 'lucide-react';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee, setEmployee] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // MODAL LOGIC
  const [modalMode, setModalMode] = useState(null); 
  const [form, setForm] = useState({ label: "", amount: "", key: "" });
  const [deductionForm, setDeductionForm] = useState({ id: null, reason: "", amount: "" });

  const [projection, setProjection] = useState(null);
  const [targetMonth, setTargetMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [targetYear] = useState(new Date().getFullYear());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchData = useCallback(async () => {
    try {
      const [empRes, payRes, projRes] = await Promise.all([
        API.get(`/employees/${id}`),
        API.get(`/employees/${id}/payroll`),
        API.get(`/employees/${id}/projection?month=${targetMonth}&year=${targetYear}`)
      ]);
      setEmployee(empRes.data);
      setPayrollHistory(payRes.data);
      setProjection(projRes.data);
      dispatch(fetchDeductions(id));
    } catch (error) {
      toast.error("Sync failed.");
    } finally {
      setLoading(false);
    }
  }, [id, targetMonth, targetYear, dispatch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // HANDLERS FOR EARNINGS
  const handleUpdateEarning = async () => {
    try {
      if (modalMode === 'add_allowance') {
        await API.post(`/employees/${id}/allowance`, form);
      } else {
        await API.put(`/employees/${id}`, { [form.key]: parseFloat(form.amount) });
      }
      toast.success("Earnings Updated.");
      setModalMode(null);
      fetchData();
    } catch (err) { toast.error("Update failed."); }
  };

  // HANDLERS FOR DEDUCTIONS (ADD & EDIT)
  const handleSaveDeduction = async () => {
    try {
      if (modalMode === 'edit_deduction') {
        // Since your slice might not have a dedicated 'update' thunk, we use direct API
        await API.put(`/api/employees/deductions/${deductionForm.id}`, {
          reason: deductionForm.reason,
          amount: parseFloat(deductionForm.amount)
        });
        toast.success("Deduction Adjusted.");
      } else {
        const data = { ...deductionForm, month: targetMonth, year: targetYear };
        await dispatch(addDeduction({ empCode: id, data })).unwrap();
        toast.success("Deduction Recorded.");
      }
      setModalMode(null);
      setDeductionForm({ id: null, reason: "", amount: "" });
      fetchData();
    } catch (err) { toast.error("Operation failed."); }
  };

  const handleDeleteDeduction = async (deductId) => {
    if(!window.confirm("Remove this adjustment?")) return;
    try {
      await dispatch(removeDeduction(deductId)).unwrap();
      toast.success("Adjustment Removed.");
      fetchData();
    } catch (err) { toast.error("Delete failed."); }
  };

  const handleCreditSalary = async () => {
    setIsProcessing(true);
    try {
      const res = await API.post(`/employees/${id}/credit-salary`);
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment Failed");
    } finally { setIsProcessing(false); }
  };

  if (loading || !employee || !projection) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <main className="lg:ml-64 ml-0 pt-20 lg:pt-8 flex-1 p-4 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/salary')} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                <ArrowLeft size={20} className="text-slate-50" />
             </button>
             <div>
                <h2 className="text-3xl font-black tracking-tighter">{employee.name}</h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-widest italic">Live Payout Audit</p>
             </div>
          </div>
          <button onClick={handleCreditSalary} disabled={isProcessing} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
            <Send size={14} /> {isProcessing ? "Processing..." : "Commit Payment"}
          </button>
        </div>

        {/* PROJECTION CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border-2 border-indigo-100 dark:border-indigo-900/30 overflow-hidden shadow-2xl mb-10 transition-all">
          <div className="px-10 py-8 bg-indigo-50/50 dark:bg-indigo-900/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg"><Calculator size={24} /></div>
              <div>
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Projection Mode</h4>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">{targetMonth} {targetYear} Payout</h3>
              </div>
            </div>
            <select 
              value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)}
              className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase outline-none cursor-pointer"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Earnings (A) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings Breakdown (A)</p>
                  <button onClick={() => setModalMode('add_allowance')} className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:scale-110 transition-transform"><PlusCircle size={18}/></button>
                </div>
                <div className="space-y-1">
                  {(projection?.earnings || []).map((e, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        const keyMap = { "Basic Salary":"basic", "HRA":"hra", "DA":"da", "Travel Allowance":"travel", "Special Allowance":"special" };
                        setForm({ label: e.label, amount: e.amount, key: keyMap[e.label] || e.label });
                        setModalMode('edit_salary');
                      }}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer group transition-all"
                    >
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {e.label} <Edit3 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400"/>
                      </span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">₹{e.amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions (B) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Deductions (B)</p>
                  <button onClick={() => setModalMode('add_deduction')} className="p-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-lg hover:scale-110 transition-transform"><AlertCircle size={18}/></button>
                </div>
                <div className="space-y-1">
                  {projection?.deductions?.length > 0 ? projection.deductions.map((d, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 group transition-all">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setDeductionForm({ id: d.id, reason: d.reason, amount: d.amount });
                          setModalMode('edit_deduction');
                        }}
                      >
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          {d.reason} <Edit3 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400"/>
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-rose-500">- ₹{d.amount?.toLocaleString()}</span>
                        <button onClick={() => handleDeleteDeduction(d.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 transition-all">
                           <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">No Active Deductions</div>
                  )}
                </div>
              </div>
            </div>

            {/* Estimation Bar */}
            <div className="mt-12 p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-[35px] border-2 border-emerald-100 dark:border-emerald-800/30 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-lg"><Wallet size={32} /></div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Estimated Take-Home</p>
                  <p className="text-sm text-emerald-500 font-bold">Cycle Health: {projection?.summary?.payoutPercentage}%</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <h2 className="text-5xl font-black text-emerald-600 tracking-tighter">₹{projection?.summary?.netPay?.toLocaleString()}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Projected disbursement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Payment History</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(payrollHistory || []).map(p => (
                <div key={p.id} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                  <div>
                    <span className="block font-black text-slate-800 dark:text-white text-sm">{p.month} {p.year}</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Transaction Success</span>
                  </div>
                  <span className="font-black text-indigo-600 tracking-tighter">₹{p.netAmount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
        </div>

        {/* MODAL SYSTEM */}
        {modalMode && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[50px] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
              
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-8 uppercase tracking-widest text-xs">
                {modalMode.includes('deduction') ? 'Deduction Management' : modalMode === 'edit_salary' ? `Modify ${form.label}` : 'Add Allowance'}
              </h3>

              {modalMode.includes('deduction') ? (
                <div className="space-y-4 mb-8">
                  <input className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white font-bold" 
                         placeholder="Reason (e.g. Unpaid Leave)" value={deductionForm.reason} onChange={(e) => setDeductionForm({...deductionForm, reason: e.target.value})} />
                  <input type="number" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white font-black text-2xl text-center" 
                         placeholder="Amount (₹)" value={deductionForm.amount} onChange={(e) => setDeductionForm({...deductionForm, amount: e.target.value})} />
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {modalMode === 'add_allowance' && (
                    <input className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold" 
                           placeholder="Allowance Name" value={form.label} onChange={(e) => setForm({...form, label: e.target.value})} />
                  )}
                  <input type="number" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-black text-2xl text-center" 
                         placeholder="Amount (₹)" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} />
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setModalMode(null)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</button>
                <button 
                  onClick={modalMode.includes('deduction') ? handleSaveDeduction : handleUpdateEarning} 
                  className={`flex-1 py-5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg ${modalMode.includes('deduction') ? 'bg-rose-500 shadow-rose-100' : 'bg-indigo-600 shadow-indigo-100'}`}
                >
                  Confirm Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalaryDetails;