import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// --- React Toastify Imports ---
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Page Imports ---
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import SalaryList from "./pages/SalaryList"; // Import the new List page
import SalaryDetails from "./pages/SalaryDetails"; // Imported SalaryDetails

// --- Private Route Component ---
const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications positioned at the top center */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Dashboard /></PrivateRoute>} 
        />
        <Route 
          path="/employees" 
          element={<PrivateRoute><EmployeeList /></PrivateRoute>} 
        />
        <Route 
          path="/add-employee" 
          element={<PrivateRoute><AddEmployee /></PrivateRoute>} 
        />
        <Route path="/salary" element={<PrivateRoute><SalaryList /></PrivateRoute>} />

        {/* --- NEW: Dynamic Route for Salary Pay Slip & History --- */}
        <Route 
          path="/employees/:id/salary" 
          element={<PrivateRoute><SalaryDetails /></PrivateRoute>} 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;