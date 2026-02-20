import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Security mismatch: Passwords do not align.");
      return;
    }

    try {
      await dispatch(registerUser({ 
        name: form.name, 
        email: form.email, 
        password: form.password 
      })).unwrap();
      
      toast.success("Account Provisioned. Please sign in.");
      navigate("/");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Registry Error: Process Aborted");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-[1000px] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-indigo-100 dark:shadow-none flex overflow-hidden min-h-[700px] border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-1 bg-indigo-600 dark:bg-indigo-900 p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <h2 className="text-white text-3xl font-black italic tracking-tighter relative z-10">EMP.HUB</h2>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white leading-tight mb-6">Join the administrative network.</h1>
            <p className="text-indigo-100 dark:text-indigo-200 text-lg font-medium opacity-80">Establish your credentials to begin managing organizational personnel and payroll.</p>
          </div>
          
          <div className="text-indigo-200 dark:text-indigo-300 text-sm font-bold tracking-widest uppercase relative z-10">System Version 4.0.2</div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">New Administrator Registry</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Identity</label>
              <input 
                name="name" 
                type="text"
                placeholder="John Doe" 
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">System Email</label>
              <input 
                name="email" 
                type="email"
                placeholder="admin@emphub.com" 
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  name="password" 
                  type="password"
                  placeholder="••••••••" 
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm</label>
                <input 
                  name="confirmPassword" 
                  type="password"
                  placeholder="••••••••" 
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 transition-all disabled:bg-slate-200 dark:disabled:bg-slate-800"
            >
              {loading ? "Registering Identity..." : "Finalize Registry →"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Already a member? 
              <button 
                onClick={() => navigate("/")} 
                className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Return to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;