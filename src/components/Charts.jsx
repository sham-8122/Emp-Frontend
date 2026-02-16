import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

const Charts = () => {
  const { list } = useSelector((state) => state.employees);

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

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", alignItems: "center", width: "100%" }}>
      <BarChart width={500} height={300} data={salaryData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="salary" fill="#8884d8">
          {salaryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>

      <PieChart width={400} height={300}>
        <Pie
          data={roleData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {roleData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default Charts;