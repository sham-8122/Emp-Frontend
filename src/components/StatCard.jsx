import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4 className="stat-title">{title}</h4>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
};

export default StatCard;