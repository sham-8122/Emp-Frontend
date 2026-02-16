export const downloadCSV = (data, filename = "report.csv") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Define Headers
  const headers = ["ID,Name,Email,Role,Salary,Joined Date"];

  // Map Data to CSV Format
  const rows = data.map((emp) =>
    `${emp.id},"${emp.name}","${emp.email}","${emp.role}",${emp.salary},${emp.createdAt.split("T")[0]}`
  );

  // Combine and create blob
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};