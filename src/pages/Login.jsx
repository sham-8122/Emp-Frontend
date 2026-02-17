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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
      toast.success("Login Successful!");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Invalid Credentials");
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset feature coming soon!");
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="login-page-minimal">
      <div className="login-container-minimal">
        <h2 className="login-title-minimal">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form-minimal">

          {/* Username/Email Input */}
          <div className="input-group-minimal">
            <span className="input-icon-minimal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            </span>
            <input 
              type="email"
              name="email"
              placeholder="Username" 
              className="login-input-minimal"
              value={form.email}
              onChange={handleChange}
              required 
            />
          </div>

          {/* Password Input */}
          <div className="input-group-minimal">
            <span className="input-icon-minimal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5H5z"/>
              </svg>
            </span>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="login-input-minimal" 
              value={form.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          {/* Options */}
          <div className="login-options-minimal">
            <label className="remember-me-minimal">
              <input type="checkbox" /> Remember me
            </label>
            <button 
              type="button" 
              className="forgot-password-minimal"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="login-btn-minimal"
            disabled={loading}
          >
            {loading ? "..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;