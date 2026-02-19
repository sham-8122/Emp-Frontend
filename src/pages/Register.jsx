import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

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
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(registerUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Registration failed");
    }
  };

  return (
    <div className="register-page-minimal">
      <div className="register-container-minimal">
        <h2 className="register-title-minimal">Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form-minimal">
          <div className="input-group-minimal">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="login-input-minimal"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group-minimal">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="login-input-minimal"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group-minimal">
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

          <div className="input-group-minimal">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="login-input-minimal"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn-minimal" disabled={loading}>
            {loading ? "..." : "REGISTER"}
          </button>
        </form>

        <div className="register-link-minimal">
          <span>Already have an account?</span>
          <button type="button" className="register-btn-minimal" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
