const STYLES = {
  perdido: "bg-tertiary text-on-tertiary",
  encontrado: "bg-primary text-on-primary",
  activo: "bg-tertiary-container text-on-tertiary-container",
  resuelto: "bg-surface-container-highest text-on-surface-variant",
  admin: "bg-primary-container/20 text-primary",
  usuario: "bg-surface-container-highest text-on-surface-variant",
};

const LABELS = {
  perdido: "PERDIDO",
  encontrado: "ENCONTRADO",
  activo: "ACTIVO",
  resuelto: "RESUELTO",
  admin: "Admin",
  usuario: "Usuario",
};

export default function Badge({ tone, className = "", children }) {
  const style = STYLES[tone] ?? "bg-surface-container-highest text-on-surface-variant";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-caption font-label-md font-bold shadow-md ${style} ${className}`}
    >
      {children ?? LABELS[tone] ?? tone}
    </span>
  );
}
