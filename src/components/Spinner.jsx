import Icon from "./Icon";

export default function Spinner({ label = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-on-surface-variant">
      <Icon name="progress_activity" className="animate-spin text-[32px] text-primary" />
      <span className="font-body-md text-sm">{label}</span>
    </div>
  );
}
