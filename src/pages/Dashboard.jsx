import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees, fetchEmployeeStats, deleteEmployee } from "../features/employees/employeeSlice";
import Sidebar from "../components/Sidebar";
import Charts from "../components/Charts";
import { downloadCSV } from "../utils/exportToCSV.js";
import { 
  Search, Bell, Users, CreditCard, Activity, Trophy, Download, Plus, Filter,
  FileText, Pencil, Trash2, ArrowUpRight, ChevronLeft, ChevronRight, CheckCircle2, Info, X
} from "lucide-react";

const jobRoles = [
  "Software Engineer", "Senior Software Engineer", "Frontend Developer", 
  "Backend Developer", "Full Stack Developer", "UI/UX Designer", 
  "Product Manager", "Project Manager", "QA Engineer", "DevOps Engineer", 
  "Data Scientist", "HR Manager", "Sales Executive", "Intern"
];

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg dark:hover:border-slate-700 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-center text-sm font-medium text-emerald-500">
        <ArrowUpRight size={16} />
        <span className="ml-1">Live</span>
      </div>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtext}</p>}
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { list, stats, loading, totalPages, currentPage } = useSelector((state) => state.employees);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchEmployees({ page: currentPage, search, role: filterRole }));
      dispatch(fetchEmployeeStats());
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filterRole, currentPage, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This action is permanent.")) {
      dispatch(deleteEmployee(id)).then(() => {
        dispatch(fetchEmployees({ page: currentPage, search, role: filterRole }));
        dispatch(fetchEmployeeStats());
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchEmployees({ page: newPage, search, role: filterRole }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <main className="ml-64 flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, here are your workforce metrics.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
              />
            </div>
            <div className="relative">
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-xl transition-all border text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50 dark:border-slate-950"></span>
              </button>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h3>
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-80 overflow-y-auto">
                      <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3"><div className="mt-1 p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg"><CheckCircle2 size={16}/></div><div><p className="text-sm font-bold text-slate-800 dark:text-white">Payroll Processed</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Salaries successfully dispatched.</p></div></div>
                      <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3"><div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg"><Info size={16}/></div><div><p className="text-sm font-bold text-slate-800 dark:text-white">System Update</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Version 4.0.2 is live.</p></div></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} color="bg-blue-500" subtext="Active Workforce"/>
          <StatCard title="Total Payroll" value={`₹${stats.totalSalary?.toLocaleString()}`} icon={CreditCard} color="bg-purple-500" subtext="Monthly Cost"/>
          <StatCard title="Average CTC" value={`₹${stats.averageSalary}`} icon={Activity} color="bg-emerald-500" subtext="Across all roles"/>
          <StatCard title="Top Earner" value={stats.highestPaidEmployee||"N/A"} icon={Trophy} color="bg-amber-500" subtext="Highest Salary"/>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Visual Analytics</h3>
          <Charts />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Employee Directory</h3>
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full xl:w-auto"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><select value={filterRole} onChange={(e)=>setFilterRole(e.target.value)} className="pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full xl:w-48 cursor-pointer"><option value="">All Roles</option>{jobRoles.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
              <button onClick={()=>downloadCSV(list,"Workforce.csv")} className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700"><Download size={16}/><span>Export</span></button>
              <button onClick={()=>navigate("/add-employee")} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"><Plus size={18}/><span>Add New</span></button>
            </div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase border-b border-slate-100 dark:border-slate-800"><th className="px-6 py-4 font-bold">Identity</th><th className="px-6 py-4 font-bold">Role</th><th className="px-6 py-4 font-bold">CTC</th><th className="px-6 py-4 font-bold text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{loading?<tr><td colSpan="4" className="px-6 py-10 text-center uppercase font-bold text-slate-400 animate-pulse">Syncing...</td></tr>:list.map(emp=>(<tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
            <td className="px-6 py-4"><div className="flex items-center gap-3">{emp.profileImage?<img src={`http://localhost:5000/${emp.profileImage.replace(/\\/g,"/")}`} className="w-10 h-10 rounded-xl object-cover" alt=""/>:<div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">{emp.name.charAt(0)}</div>}<div><div className="font-semibold text-sm">{emp.name}</div><div className="text-xs text-slate-400">{emp.email}</div></div></div></td>
            <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">{emp.role}</span></td>
            <td className="px-6 py-4 font-bold text-sm">₹{emp.salary.toLocaleString()}</td>
            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={()=>navigate(`/employees/${emp.employeeCode}/salary`)}><FileText size={18}/></button><button onClick={()=>navigate("/add-employee",{state:{employee:emp}})}><Pencil size={18}/></button><button onClick={()=>handleDelete(emp.employeeCode)}><Trash2 size={18}/></button></div></td></tr>))}</tbody></table></div>
          
          {totalPages > 1 && (
             <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                   <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"><ChevronLeft size={16}/></button>
                   <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"><ChevronRight size={16}/></button>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;