import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addEmployee, updateEmployee } from "../features/employees/employeeSlice";
import { toast } from "react-toastify";
import { Upload, User, Camera } from "lucide-react";

const jobRoles = ["Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "Product Manager", "Project Manager", "QA Engineer", "DevOps Engineer", "Data Scientist", "HR Manager", "Sales Executive", "Intern"];

const EmployeeForm = ({ editing, setEditing, onSuccess }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", role: "", salary: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editing) {
      setForm({ name: editing.name || "", email: editing.email || "", role: editing.role || "", salary: editing.salary || "" });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("role", form.role);
    formData.append("salary", form.salary);
    if (image) formData.append("image", image);

    try {
      if (editing) {
        await dispatch(updateEmployee({ 
            id: editing.employeeCode || editing.id, 
            updatedData: formData 
        })).unwrap();
        toast.success("Profile Authenticated.");
      } else {
        await dispatch(addEmployee(formData)).unwrap();
        toast.success("Personnel Onboarded.");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Operation Aborted.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div className="flex flex-col items-center mb-8 text-center">
          <label className="cursor-pointer relative group">
            <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[35px] flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500 dark:group-hover:border-indigo-500">
              {image ? (
                <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="" />
              ) : editing && editing.profileImage ? (
                <img src={`http://localhost:5000/${editing.profileImage}`} className="w-full h-full object-cover" alt="" />
              ) : (
                <Camera size={32} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} />
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={14} />
            </div>
          </label>
          <p className="mt-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Update Identification</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
            <input 
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" 
              placeholder="Full Name" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
            <input 
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" 
              placeholder="Email Address" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
            <div className="relative">
              <select 
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold appearance-none cursor-pointer transition-all" 
                value={form.role} 
                onChange={e => setForm({...form, role: e.target.value})} 
                required
              >
                  <option value="">Select Designation</option>
                  {jobRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <User className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
            
            <input 
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" 
              type="number" 
              placeholder="CTC (₹)" 
              value={form.salary} 
              onChange={e => setForm({...form, salary: e.target.value})} 
              required 
            />
        </div>

        <button 
          type="submit" 
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none transition-all"
        >
            {editing ? "Update Ledger" : "Commit Record"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;