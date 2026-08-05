import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { reportsApi } from "../api/reports";
import { sightingsApi } from "../api/sightings";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/date";
import PetPhoto from "../components/PetPhoto";
import Spinner from "../components/Spinner";
import Icon from "../components/Icon";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", ave: "Ave", otro: "Otro" };
const SEXO_LABEL = { macho: "Macho", hembra: "Hembra", desconocido: "Desconocido" };

export default function CaseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const sightingsRef = useRef(null);

  const [report, setReport] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([reportsApi.get(id), sightingsApi.byReport(id)])
      .then(([r, s]) => {
        if (!active) return;
        setReport(r);
        setSightings(s);
        reportsApi
          .addVista(id)
          .then((updated) => setReport((prev) => (prev ? { ...prev, vistas: updated.vistas } : prev)))
          .catch(() => {});
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <Spinner />;
  if (!report) return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-on-surface-variant">Caso no encontrado.</p>;

  const isOwner = user?.id === report.usuarioId;
  const titulo = report.nombreMascota || "Desconocido";
  const isPerdido = report.tipo === "perdido";

  async function toggleResuelto() {
    const nextEstado = report.estado === "resuelto" ? "activo" : "resuelto";
    const updated = await reportsApi.update(id, { estado: nextEstado });
    setReport(updated);
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este reporte de forma permanente?")) return;
    await reportsApi.remove(id);
    navigate("/buscar");
  }

  async function handleSighting(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setPosting(true);
    try {
      const sighting = await sightingsApi.create(id, { mensaje: message.trim() });
      setSightings((prev) => [sighting, ...prev]);
      setMessage("");
    } finally {
      setPosting(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 md:px-10">
      {/* Breadcrumb & Status */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Link to="/buscar" className="font-label-md text-label-md transition-colors hover:text-primary">
            Casos Activos
          </Link>
          <Icon name="chevron_right" className="text-sm" />
          <span className="font-label-md text-label-md text-primary">Caso #KP-{report.id.padStart(4, "0")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-2 rounded-full px-4 py-1 font-label-md text-label-md shadow-sm ${
              isPerdido ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
            }`}
          >
            <span className={`h-2 w-2 animate-pulse rounded-full ${isPerdido ? "bg-secondary" : "bg-primary"}`} />
            {isPerdido ? "MASCOTA PERDIDA" : "MASCOTA ENCONTRADA"}
          </span>
          <span className="rounded-full bg-tertiary-container px-4 py-1 font-label-md text-label-md text-on-tertiary-container shadow-sm">
            {report.estado === "resuelto" ? "RESUELTO" : "ACTIVO"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Left: Photo */}
        <div className="w-full space-y-6 lg:w-[60%]">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-container shadow-lg">
            <PetPhoto foto={report.foto} especie={report.especie} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button className="rounded-full bg-white/90 p-2 text-primary shadow-md backdrop-blur-sm">
                <Icon name="zoom_in" />
              </button>
              <button className="rounded-full bg-white/90 p-2 text-primary shadow-md backdrop-blur-sm">
                <Icon name="share" />
              </button>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-4">
              <button
                onClick={toggleResuelto}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary py-3 font-label-md text-label-md text-primary transition-colors hover:bg-primary/5"
              >
                <Icon name="check_circle" />
                {report.estado === "resuelto" ? "Marcar como activo" : "Marcar como resuelto"}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-lg border border-error px-6 py-3 font-label-md text-label-md text-error transition-colors hover:bg-error-container/40"
              >
                <Icon name="delete" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex w-full flex-col gap-6 lg:w-[40%]">
          <div className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
            <h1 className="font-display text-headline-lg text-primary mb-2">{titulo}</h1>
            <p className="mb-6 font-body-md text-on-surface-variant">
              {isPerdido ? "Visto por última vez" : "Encontrado"} el {formatDate(report.fecha)}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg bg-surface-container-low p-4">
                <Icon name="info" className="text-secondary" />
                <div>
                  <p className="text-caption font-caption uppercase tracking-wider text-on-surface-variant">
                    Descripción del Reporte
                  </p>
                  <p className="font-body-md leading-relaxed text-on-surface">{report.descripcion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Pet Info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoTile label="ESPECIE" value={ESPECIE_LABEL[report.especie] ?? "—"} />
            <InfoTile label="RAZA" value={report.raza || "—"} />
            <InfoTile label="COLOR" value={report.color || "—"} />
            <InfoTile label="SEXO" value={SEXO_LABEL[report.sexo] ?? "—"} />
            <InfoTile label="EDAD" value={report.edad || "—"} className="col-span-2" />
          </div>

          {/* Contact Card */}
          <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-on-primary shadow-lg">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-6">
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center font-bold">
                  {report.contactoNombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-caption font-caption text-white/80">CONTACTO</p>
                  <p className="font-display text-headline-md leading-none">{report.contactoNombre}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${report.contactoEmail}`}
                  className="flex w-full items-center justify-center gap-4 rounded-lg bg-white py-3 font-label-md text-label-md text-primary transition-colors hover:bg-surface-bright"
                >
                  <Icon name="mail" filled />
                  Contactar Dueño
                </a>
                <button
                  onClick={() => setShowPhone((v) => !v)}
                  className="flex w-full items-center justify-center gap-4 rounded-lg border border-white/30 bg-primary-container/30 py-3 font-label-md text-label-md text-white transition-colors hover:bg-primary-container/40"
                >
                  <Icon name="call" />
                  {showPhone ? report.contactoTelefono || "Sin teléfono" : "Ver Teléfono"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower: Map & Tips */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-4 font-display text-headline-md text-primary">
              <Icon name="location_on" />
              Última Ubicación Vista
            </h3>
            <p className="font-label-md text-label-md text-on-surface-variant">{report.ubicacion}</p>
          </div>
          <div className="relative h-96 overflow-hidden rounded-xl border border-outline-variant/30 shadow-md">
            <iframe
              className="h-full w-full border-0"
              loading="lazy"
              title={`Mapa de ${report.ubicacion}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(report.ubicacion)}&output=embed`}
            />
            <div className="pointer-events-none absolute bottom-4 right-4 max-w-[280px] rounded-lg border border-outline-variant/30 bg-white p-4 shadow-lg">
              <p className="mb-1 font-label-md text-label-md text-on-surface">{report.ubicacion}</p>
              <p className="text-caption font-caption text-on-surface-variant">Última ubicación reportada.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-surface-container-high p-6 shadow-sm">
            <h4 className="mb-4 flex items-center gap-2 font-label-md text-label-md text-primary">
              <Icon name="safety_check" className="text-base" />
              CONSEJOS DE SEGURIDAD
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="font-bold text-primary">1.</span>
                <p className="font-body-md text-on-surface-variant">¡No lo persigas! Podría asustarse y correr más lejos.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-primary">2.</span>
                <p className="font-body-md text-on-surface-variant">Intenta ofrecerle un premio sabroso desde la distancia.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-primary">3.</span>
                <p className="font-body-md text-on-surface-variant">Reporta inmediatamente cualquier avistamiento con el botón de abajo.</p>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-dashed border-secondary/30 bg-secondary-container/20 p-6">
            <p className="mb-6 font-body-md font-semibold italic text-on-secondary-container">
              "Lo extrañamos mucho. Cualquier información es de gran ayuda."
            </p>
            <button
              onClick={() => sightingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="w-full rounded-lg bg-secondary py-3 font-label-md text-label-md text-on-secondary transition-all hover:scale-95"
            >
              Creo que vi a esta mascota
            </button>
          </div>
        </div>
      </div>

      {/* Sightings */}
      <div ref={sightingsRef} className="mt-10 scroll-mt-20">
        <h2 className="mb-6 flex items-center gap-4 font-display text-headline-md text-on-surface">
          <Icon name="forum" className="text-primary" />
          Avistamientos ({sightings.length})
        </h2>

        {user ? (
          <form onSubmit={handleSighting} className="mb-6 flex flex-col gap-4 rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="¿Viste a esta mascota? Comparte los detalles..."
              className="input resize-none py-3"
              style={{ height: "auto" }}
            />
            <button
              disabled={posting}
              className="self-end rounded-full bg-primary px-6 py-2 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
            >
              {posting ? "Enviando..." : "Reportar avistamiento"}
            </button>
          </form>
        ) : (
          <p className="mb-6 font-body-md text-on-surface-variant">
            <Link to="/acceso" className="text-primary hover:underline">
              Inicia sesión
            </Link>{" "}
            para reportar un avistamiento.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {sightings.map((s) => (
            <div key={s.id} className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-center justify-between font-label-md text-label-md text-on-surface">
                <span>{s.autorNombre}</span>
                <span className="text-caption font-caption font-normal text-on-surface-variant">
                  {new Date(s.creadoEn).toLocaleDateString()}
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant">{s.mensaje}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function InfoTile({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm ${className}`}>
      <span className="text-caption font-caption text-on-surface-variant">{label}</span>
      <span className="font-label-md text-label-md text-on-surface">{value}</span>
    </div>
  );
}
