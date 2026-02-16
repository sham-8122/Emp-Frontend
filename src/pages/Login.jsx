import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(form)); };

  useEffect(() => { if (token) navigate("/dashboard", { replace: true }); }, [token, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1>Welcome Back!</h1>
          <p>Login to access your dashboard.</p>
        </div>
        <div className="login-right">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input name="email" placeholder="Email" className="login-input" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="login-input" onChange={handleChange} required />
            {error && <div className="error-msg">{typeof error === 'string' ? error : 'Login failed'}</div>}
            <button type="submit" className="btn-login" disabled={loading}>{loading ? "..." : "LOG IN"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;