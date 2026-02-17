export const formatEmpId = (uuid) => {
  if (!uuid) return "N/A";
  // Returns first 8 chars: "550e8400"
  return uuid.split('-')[0].toUpperCase();
};