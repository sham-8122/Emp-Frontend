import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
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
  const [chartType, setChartType] = useState("bar");

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

  const renderChart = () => {
    const commonProps = {
      data: salaryData,
      margin: { top: 5, right: 5, bottom: 5, left: -20 },
    };

    const gridColor = isDark ? "#334155" : "#e2e8f0";

    const commonAxis = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} opacity={0.5} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: textColor, fontSize: 10 }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
        />
        <YAxis 
          tick={{ fill: textColor, fontSize: 10 }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent", stroke: textColor, strokeDasharray: "3 3" }} />
      </>
    );

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {commonAxis}
            <Line 
              type="monotone" 
              dataKey="salary" 
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        );
      case "area": // Updated to match "Revenue Trend" style (Orange Gradient)
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorSalaryOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} opacity={0.5} />
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f97316", strokeWidth: 1, strokeDasharray: "3 3" }} />
            <Area 
              type="monotone" 
              dataKey="salary" 
              stroke="#f97316" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSalaryOrange)" 
            />
          </AreaChart>
        );
      case "dot":
        return (
          <LineChart {...commonProps}>
            {commonAxis}
            <Line 
              type="monotone" 
              dataKey="salary" 
              stroke="transparent" 
              strokeWidth={0} 
              dot={{ r: 6, fill: "#6366f1" }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
      case "bar":
      default:
        return (
          <BarChart {...commonProps}>
             <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} opacity={0.5} />
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="salary" radius={[4, 4, 0, 0]}>
              {salaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      
      {/* Salary Chart */}
      <div className="h-[300px] w-full">
        <div className="flex items-center justify-between mb-6 px-2">
          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Salary Overview</h4>
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="dot">Dot Plot</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Role Distribution (Updated to match Traffic Channels Donut Chart) */}
      <div className="h-[300px] w-full flex flex-col">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Role Distribution</h4>
        
        <div className="flex flex-1 items-center">
          {/* Chart Section */}
          <div className="w-1/2 h-full relative flex items-center justify-center">
            {/* Center Label Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
               <span className="text-2xl font-bold text-slate-800 dark:text-white">{list.length}</span>
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
            </div>
            
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
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Section */}
          <div className="w-1/2 pl-4 flex flex-col justify-center gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
             {roleData.map((entry, index) => {
               const percentage = list.length > 0 ? Math.round((entry.value / list.length) * 100) : 0;
               return (
                 <div key={index} className="flex items-center justify-between group cursor-default w-full">
                   <div className="flex items-center gap-2 min-w-0 flex-1">
                     <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                     <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate" title={entry.name}>
                        {entry.name}
                     </span>
                   </div>
                   <span className="text-xs font-bold text-slate-800 dark:text-white pl-2">{percentage}%</span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;