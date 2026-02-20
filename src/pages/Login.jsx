import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { token, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
      toast.success("Identity Verified.");
    } catch (err) {
      toast.error("Access Denied: Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-[1000px] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-indigo-100 dark:shadow-none flex overflow-hidden min-h-[600px] border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-1 bg-indigo-600 dark:bg-indigo-900 p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <h2 className="text-white text-3xl font-black italic tracking-tighter relative z-10">EMP.HUB</h2>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white leading-tight mb-6">Manage your workforce with precision.</h1>
            <p className="text-indigo-100 dark:text-indigo-200 text-lg font-medium opacity-80">Enter your administrative credentials to access the secure control panel.</p>
          </div>
          
          <div className="text-indigo-200 dark:text-indigo-300 text-sm font-bold tracking-widest uppercase relative z-10">© 2026 EMPLOYEE HUB SYSTEMS</div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Login</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Administrative Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                name="email" 
                type="email"
                placeholder="admin@emphub.com" 
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <input 
                name="password" 
                type="password"
                placeholder="••••••••" 
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 transition-all disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:shadow-none disabled:translate-y-0"
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            Trouble logging in? <button className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact System Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;