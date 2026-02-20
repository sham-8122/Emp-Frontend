import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../features/employees/employeeSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, CreditCard, AlertCircle } from "lucide-react";

const SalaryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list, loading } = useSelector((state) => state.employees);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => dispatch(fetchEmployees({ page: 1, search })), 500);
    return () => clearTimeout(timer);
  }, [search, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      
      <main className="lg:ml-64 ml-0 pt-20 lg:pt-8 flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Payroll</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Issue and manage staff compensation slips</p>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-transparent dark:border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-medium" 
            placeholder="Search employee name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <th className="px-10 py-6 text-left">Personnel</th>
                <th className="px-10 py-6 text-left">Annual CTC</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                // SKELETON
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-10 py-6"><div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td>
                    <td className="px-10 py-6"><div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td>
                    <td className="px-10 py-6"><div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl ml-auto"></div></td>
                  </tr>
                ))
              ) : list.map((emp) => (
                <tr key={emp.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{emp.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{emp.role}</div>
                      </div>
                      
                      {/* NEW: Pending Deduction Badge */}
                      {emp.Deductions && emp.Deductions.length > 0 && (
                        <div 
                          className="flex items-center gap-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800"
                          title={`${emp.Deductions.length} pending adjustments`}
                        >
                          <AlertCircle size={10} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Adjustment</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-indigo-600 dark:text-indigo-400">₹{emp.salary.toLocaleString()}</td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => navigate(`/employees/${emp.employeeCode}/salary`)}
                      className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-100 dark:shadow-none transition-all flex items-center gap-2 ml-auto"
                    >
                      <CreditCard size={14} />
                      <span>Issue Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default SalaryList;