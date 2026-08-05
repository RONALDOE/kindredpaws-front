import { Link } from "react-router-dom";
import Icon from "./Icon";
import Badge from "./Badge";
import PetPhoto from "./PetPhoto";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", ave: "Ave", otro: "Otro" };
const SEXO_LABEL = { macho: "Macho", hembra: "Hembra", desconocido: "Sexo desconocido" };

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Hace un momento";
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

export default function ReportCard({ report }) {
  const titulo = report.nombreMascota || "Desconocido";
  const subtitle = [report.raza, SEXO_LABEL[report.sexo]].filter(Boolean).join(" • ");
  const locationLabel = report.tipo === "perdido" ? "Visto por última vez" : "Encontrado";

  return (
    <Link
      to={`/casos/${report.id}`}
      className="pet-card-shadow group block cursor-pointer overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(0, 102, 110, 0.05)" }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <PetPhoto foto={report.foto} especie={report.especie} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 right-4">
          <Badge tone={report.tipo} />
        </div>
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-display text-headline-md text-on-surface">{titulo}</h3>
          <Icon name="favorite" className="text-outline" />
        </div>
        <p className="mb-6 font-body-md text-on-surface-variant">
          {subtitle || ESPECIE_LABEL[report.especie]}
        </p>
        <div className="mb-6 flex items-center gap-2 text-on-surface-variant">
          <Icon name="location_on" className="text-[20px] text-primary" />
          <span className="text-caption font-body-md">
            {locationLabel}: {report.ubicacion}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <span className="text-caption text-outline">{timeAgo(report.creadoEn)}</span>
          <span className="font-label-md text-primary group-hover:underline">Ver Detalles</span>
        </div>
      </div>
    </Link>
  );
}
