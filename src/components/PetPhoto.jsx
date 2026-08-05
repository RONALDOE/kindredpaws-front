import Icon from "./Icon";

export default function PetPhoto({ foto, especie, className = "" }) {
  if (foto) {
    return <img src={foto} alt={especie} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-surface-container ${className}`}>
      <Icon name="pets" filled className="text-outline-variant text-[48px]" />
    </div>
  );
}
