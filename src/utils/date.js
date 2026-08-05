export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}
