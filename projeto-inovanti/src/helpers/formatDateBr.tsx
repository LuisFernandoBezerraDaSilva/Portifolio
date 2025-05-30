export function formatDateBR(dateStr: string) {
  if (!dateStr) return "";
  const [datePart, timePart] = dateStr.split("T");
  if (!datePart || !timePart) return dateStr;
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  return `${day}/${month} ${hour}:${minute}`;
}