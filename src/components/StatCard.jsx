import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 hover:shadow-md transition-all group">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 group-hover:text-indigo-500 transition-colors">
        {title}
      </h4>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;