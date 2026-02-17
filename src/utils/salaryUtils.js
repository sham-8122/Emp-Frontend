export const calculateBreakup = (totalSalary) => {
  const basic = Math.round(totalSalary * 0.40);
  const hra = Math.round(totalSalary * 0.20);
  const da = Math.round(totalSalary * 0.10);
  const travel = Math.round(totalSalary * 0.05);
  const special = totalSalary - (basic + hra + da + travel);

  // Return an array so .map() works in your table and PDF
  return [
    { name: "Basic Salary", value: basic, color: "#4f46e5" },
    { name: "HRA", value: hra, color: "#10b981" },
    { name: "DA", value: da, color: "#f59e0b" },
    { name: "Travel Allowance", value: travel, color: "#06b6d4" },
    { name: "Special Allowance", value: special, color: "#8b5cf6" },
  ];
};