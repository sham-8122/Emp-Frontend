import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../features/employees/employeeSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";
import { FileText, Pencil, Trash2, Plus } from "lucide-react";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list, loading, totalPages, currentPage } = useSelector((state) => state.employees);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { 
    dispatch(fetchEmployees({ page: 1 })); 
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteEmployee(deleteId)).unwrap().then(() => {
      toast.success("Personnel Record Purged.");
      dispatch(fetchEmployees({ page: currentPage }));
    });
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <main className="ml-sidebar flex-1 p-4 lg:p-10">
        
        {/* Page Header */}
        <div className="flex justify-between items-end mb-10">
           <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Workforce</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and audit administrative staff records</p>
           </div>
           <button 
             onClick={() => navigate("/add-employee")} 
             className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 flex items-center gap-2"
           >
             <Plus size={16} /> Add Personnel
           </button>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
           <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                 <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Full Name / ID</th>
                    <th className="px-8 py-6">Designation</th>
                    <th className="px-8 py-6 text-right">CTC (₹)</th>
                    <th className="px-8 py-6 text-center">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 {loading ? (
                    // SKELETON
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6"><div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td>
                        <td className="px-8 py-6"><div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full"></div></td>
                        <td className="px-8 py-6 text-right"><div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg ml-auto"></div></td>
                        <td className="px-8 py-6"><div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto"></div></td>
                      </tr>
                    ))
                 ) : list.map((emp) => (
                    <tr key={emp.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             {emp.profileImage ? (
                                <img 
                                  src={`http://localhost:5000/${emp.profileImage.replace(/\\/g, "/")}`} 
                                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm transition-transform group-hover:scale-110" 
                                  alt="" 
                                />
                             ) : (
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center font-black text-white italic shadow-inner group-hover:scale-110 transition-transform">
                                  {emp.name.charAt(0)}
                                </div>
                             )}
                             <div>
                                <p className="font-bold text-slate-800 dark:text-white leading-none mb-1">{emp.name}</p>
                                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-widest">
                                  ID: {emp.employeeCode?.split('-')[0]}
                                </p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm uppercase tracking-tighter">
                            {emp.role}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                          ₹{emp.salary.toLocaleString()}
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                             <button 
                               onClick={() => navigate(`/employees/${emp.employeeCode}/salary`)} 
                               className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
                               title="Salary Details"
                             >
                               <FileText size={18} />
                             </button>
                             <button 
                               onClick={() => navigate("/add-employee", { state: { employee: emp } })} 
                               className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                               title="Edit"
                             >
                               <Pencil size={18} />
                             </button>
                             <button 
                               onClick={() => handleDeleteClick(emp.employeeCode)} 
                               className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                               title="Delete"
                             >
                               <Trash2 size={18} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           
           {/* Pagination */}
           <div className="p-8 bg-slate-50/30 dark:bg-slate-800/30 flex justify-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => (
                 <button 
                  key={i} 
                  onClick={() => dispatch(fetchEmployees({ page: i + 1 }))} 
                  className={`w-12 h-12 rounded-2xl font-black transition-all shadow-sm ${currentPage === i + 1 ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none" : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
                 >
                    {i + 1}
                 </button>
              ))}
           </div>
        </div>
      </main>
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onConfirm={handleConfirmDelete} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Purge" 
        message="This personnel record will be permanently deleted from the database." 
      />
    </div>
  );
};

export default EmployeeList;