import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportsApi } from "../api/reports";
import { usersApi } from "../api/users";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/Badge";
import PetPhoto from "../components/PetPhoto";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import Icon from "../components/Icon";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre: user.nombre, telefono: user.telefono || "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reportsApi
      .byUser(user.id)
      .then(setReports)
      .finally(() => setLoading(false));
  }, [user.id]);

  const activos = reports.filter((r) => r.estado === "activo").length;
  const sorted = [...reports].sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0));
  const featured = reports.length >= 3 ? sorted[0] : null;
  const grid = featured ? reports.filter((r) => r.id !== featured.id) : reports;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await usersApi.update(user.id, form);
      await refresh();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(reportId) {
    if (!confirm("¿Eliminar este reporte?")) return;
    await reportsApi.remove(reportId);
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-4 py-10 md:px-10">
      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-headline-lg-mobile text-on-surface md:text-headline-lg">Mi Perfil</h1>
          <p className="mt-2 font-body-md text-on-surface-variant">Administra tu información personal y tus reportes activos.</p>
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 font-label-md text-label-md text-on-primary transition-all hover:shadow-lg active:scale-95 md:w-auto"
        >
          <Icon name="edit" className="text-[20px]" />
          <span>{editing ? "Cancelar" : "Editar Perfil"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Personal Info */}
        <aside className="space-y-6 lg:col-span-4">
          <div
            className="rounded-xl border border-surface-container bg-white p-10"
            style={{ boxShadow: "0px 4px 20px 0px rgba(0,102,110,0.05)" }}
          >
            <div className="mb-10 flex flex-col items-center">
              <div className="relative">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-primary-fixed">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary-fixed text-4xl font-bold text-on-primary-fixed-variant">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-on-primary shadow-md">
                  <Icon name="verified" className="text-[18px]" />
                </span>
              </div>
              <h2 className="font-display text-headline-md text-on-surface">{user.nombre}</h2>
              <span className="text-caption font-semibold uppercase tracking-wider text-on-surface-variant">
                Miembro desde {new Date(user.creadoEn).getFullYear()}
              </span>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Nombre</label>
                  <input className="input" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Teléfono</label>
                  <input className="input" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />
                </div>
                <button
                  disabled={saving}
                  className="w-full rounded-lg bg-primary py-2 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <InfoRow icon="mail" label="Correo Electrónico" value={user.email} />
                {user.telefono && <InfoRow icon="phone" label="Teléfono" value={user.telefono} />}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary-container p-10 text-on-primary-container shadow-md">
            <div className="relative z-10">
              <h3 className="font-display text-headline-md mb-2">¿Encontraste una mascota?</h3>
              <p className="mb-6 opacity-90">Tu ayuda es vital para reunir a una familia. Crea un reporte rápido aquí.</p>
              <Link to="/publicar" className="inline-block rounded-lg bg-white px-6 py-2 font-label-md text-label-md text-primary transition-all hover:shadow-md">
                Crear Reporte
              </Link>
            </div>
          </div>
        </aside>

        {/* Right: My Reports */}
        <section className="lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-headline-md text-on-surface">
              Mis Reportes
              <span className="rounded-full bg-surface-container-highest px-2 py-1 text-caption text-primary">{activos} activos</span>
            </h2>
          </div>

          {loading ? (
            <Spinner />
          ) : reports.length === 0 ? (
            <EmptyState
              icon="pets"
              title="Aún no has publicado reportes"
              description="Cuando publiques un reporte de mascota perdida o encontrada, aparecerá aquí."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {grid.map((r) => (
                <ProfileReportCard key={r.id} report={r} onDelete={() => handleDelete(r.id)} />
              ))}
              {featured && <FeaturedReportCard report={featured} />}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-6 rounded-lg bg-surface-container-low p-4">
      <Icon name={icon} className="text-primary" />
      <div>
        <p className="text-caption font-semibold text-on-surface-variant">{label}</p>
        <p className="font-body-md text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function ProfileReportCard({ report, onDelete }) {
  return (
    <div
      className="group overflow-hidden rounded-xl border border-surface-container bg-white transition-transform duration-300 hover:translate-y-[-4px]"
      style={{ boxShadow: "0px 4px 20px 0px rgba(0,102,110,0.05)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <PetPhoto foto={report.foto} especie={report.especie} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 right-4">
          <Badge tone={report.tipo} />
        </div>
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-display text-headline-md text-on-surface">{report.nombreMascota || "Sin nombre"}</h3>
        </div>
        <div className="mb-6 flex items-center gap-2 text-on-surface-variant">
          <Icon name="location_on" className="text-[18px]" />
          <span className="font-body-md">{report.ubicacion}</span>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/casos/${report.id}`}
            className="flex-1 rounded-lg border border-primary py-2 text-center font-label-md text-label-md text-primary transition-colors hover:bg-primary-fixed-dim"
          >
            Ver Detalles
          </Link>
          <button onClick={onDelete} className="p-2 text-on-surface-variant transition-colors hover:text-error">
            <Icon name="delete" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedReportCard({ report }) {
  return (
    <div className="group flex flex-col items-center gap-10 rounded-xl border border-outline-variant bg-surface-container-low p-10 md:col-span-2 md:flex-row">
      <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-xl shadow-md md:w-48">
        <PetPhoto foto={report.foto} especie={report.especie} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-4">
          <span className="rounded-full bg-secondary-container px-4 py-1 text-caption font-bold text-on-secondary-container">
            {report.estado === "resuelto" ? "RESUELTO" : "REPORTADO"}
          </span>
          <span className="text-caption text-on-surface-variant">ID: #{report.id.padStart(4, "0")}</span>
        </div>
        <h3 className="font-display text-headline-md text-on-surface mb-2">{report.nombreMascota || "Sin nombre"}</h3>
        <p className="mb-6 line-clamp-2 font-body-md text-on-surface-variant">{report.descripcion}</p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="visibility" filled className="text-[18px]" />
            <span className="font-label-md">{report.vistas ?? 0} Vistas</span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:w-auto">
        <Link
          to={`/casos/${report.id}`}
          className="whitespace-nowrap rounded-lg bg-primary px-10 py-4 text-center font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95"
        >
          Ver Caso
        </Link>
      </div>
    </div>
  );
}
