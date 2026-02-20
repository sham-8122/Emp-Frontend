import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";

// Color palettes
const COLORS_LIGHT = ["#4f46e5", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];
const COLORS_DARK = ["#6366f1", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#22d3ee"];

const Charts = () => {
  const { list } = useSelector((state) => state.employees);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const textColor = isDark ? "#94a3b8" : "#64748b"; // slate-400 vs slate-500

  const salaryData = list.map(emp => ({
    name: emp.name,
    salary: emp.salary
  }));

  const roleCount = {};

  list.forEach(emp => {
    roleCount[emp.role] = (roleCount[emp.role] || 0) + 1;
  });

  const roleData = Object.keys(roleCount).map(role => ({
    name: role,
    value: roleCount[role]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-bold text-slate-800 dark:text-white text-sm">{label || payload[0].name}</p>
          <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            {payload[0].value.toLocaleString()} {payload[0].dataKey === 'salary' ? 'INR' : 'Employees'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      
      {/* Bar Chart */}
      <div className="h-[300px] w-full">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 text-center">Salary Overview</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salaryData}>
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }} />
            <Bar dataKey="salary" radius={[4, 4, 0, 0]}>
              {salaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="h-[300px] w-full flex flex-col items-center">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Role Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDark ? '#0f172a' : '#fff'} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {roleData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;