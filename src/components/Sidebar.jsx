import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const html = window.document.documentElement;
    const prev = isDarkMode ? 'light' : 'dark';
    html.classList.remove(prev);
    const next = isDarkMode ? 'dark' : 'light';
    html.classList.add(next);
    localStorage.setItem('theme', next);
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
};

const SidebarItem = ({ icon: Icon, label, to, active, onClick, hasSubmenu, isOpen }) => {
  const activeClasses = 'bg-blue-600 text-white shadow-lg shadow-blue-500/30';
  const inactiveClasses = 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200';

  const linkContent = (
    <>
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {hasSubmenu && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
    </>
  );

  return to ? (
    <Link to={to} onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${active ? activeClasses : inactiveClasses}`}>
      {linkContent}
    </Link>
  ) : (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200' : inactiveClasses}`}>
      {linkContent}
    </button>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // New state for Hamburger
  const [isDarkMode, setIsDarkMode] = useDarkMode();

  const isActive = (path) => location.pathname === path;
  const isParentActive = location.pathname.startsWith('/employees') || location.pathname.startsWith('/add-employee');

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button - Fixed at top left */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md text-slate-600 dark:text-slate-300"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        w-64 h-screen fixed left-0 top-0 flex flex-col z-[80] 
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">EMP.HUB</span>
            </div>
            {/* Close button for Mobile only */}
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1 text-slate-400">
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Main Menu</div>
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive("/dashboard")} onClick={handleNavClick} />
          
          <div className="space-y-1">
            <SidebarItem onClick={() => setIsMenuOpen(!isMenuOpen)} icon={Users} label="Employees" active={isParentActive} hasSubmenu isOpen={isMenuOpen} />
            
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-40' : 'max-h-0'}`}>
              <Link to="/employees" onClick={handleNavClick} className={`flex items-center space-x-3 pl-12 pr-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/employees") ? 'text-blue-600 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive("/employees") ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
                <span>All Employees</span>
              </Link>
              <Link to="/add-employee" onClick={handleNavClick} className={`flex items-center space-x-3 pl-12 pr-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/add-employee") ? 'text-blue-600 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive("/add-employee") ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
                <span>Add New</span>
              </Link>
            </div>
          </div>

          <div className="px-4 pt-6 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Finance</div>
          <SidebarItem to="/salary" icon={CreditCard} label="Payroll" active={location.pathname.startsWith("/salary")} onClick={handleNavClick} />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {isDarkMode ? <Moon size={16}/> : <Sun size={16} />}
              <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <span className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
            </button>
          </div>
          
          <button onClick={() => { dispatch(logout()); navigate("/"); }} className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-all font-semibold text-sm">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;