import Icon from "./Icon";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
      {icon && <Icon name={icon} className="text-[40px] text-outline-variant" />}
      <h3 className="font-display text-headline-md text-on-surface">{title}</h3>
      {description && <p className="max-w-sm font-body-md text-on-surface-variant">{description}</p>}
      {action}
    </div>
  );
}
