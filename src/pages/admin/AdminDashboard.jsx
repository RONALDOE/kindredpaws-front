import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportsApi } from "../../api/reports";
import { usersApi } from "../../api/users";
import Spinner from "../../components/Spinner";
import Icon from "../../components/Icon";

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBdDveZ6SWJN3fU7iZ-tYAcwSClGSRE1z1ha9lylNgyy4EcF1jlaXBO6V-4oqgeoribS_jVeVvxrVNy2PDf6spggE3K5Nw6hD8g8bGalRBwcjzID0ieuqtfU5ecDWShRPeUUNK7NtDiktaZKDDZVT7W__BQwV05bBKYMqXQyuOjFwG13l4G7yt6awDm4Ly_0Lvajlu9ymP0pFKZNFcHQm-oLkHhpyo4KCHlKuXcePHZuIgDWUQcuIm5u1kGp4Q4ZOQXVBb5OIhTlnc";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", ave: "Ave", otro: "Otro" };

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reportsApi.list(), usersApi.list()])
      .then(([r, u]) => {
        setReports(r);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const activos = reports.filter((r) => r.estado === "activo").length;
  const resueltos = reports.filter((r) => r.estado === "resuelto").length;
  const today = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div>
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 bg-surface/80 px-4 py-6 backdrop-blur-md md:px-10">
        <h2 className="font-display text-headline-lg text-primary">Panel de Administración</h2>
        <div className="flex items-center gap-6">
          <div className="group relative">
            <Icon name="notifications" className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 sm:flex">
            <Icon name="calendar_today" className="text-primary" />
            <span className="font-label-md text-label-md text-on-surface capitalize">{today}</span>
          </div>
        </div>
      </header>

      <div className="space-y-10 px-4 pb-16 md:px-10">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard icon="error" iconBg="bg-tertiary-fixed" iconColor="text-tertiary" trend="+12% vs semana pasada" trendColor="text-error" label="Reportes Activos" value={activos} />
          <StatCard icon="check_circle" iconBg="bg-primary-fixed" iconColor="text-primary" trend="+5% vs semana pasada" trendColor="text-primary" label="Casos Resueltos" value={resueltos} />
          <StatCard icon="person_add" iconBg="bg-secondary-fixed" iconColor="text-secondary" trend={`${users.length} totales`} trendColor="text-secondary" label="Usuarios Registrados" value={users.length} />
          <StatCard icon="campaign" iconBg="bg-surface-container-highest" iconColor="text-on-background" trend="Comunidad" trendColor="text-on-surface-variant" label="Reportes Totales" value={reports.length} />
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="flex items-end justify-between">
              <h3 className="font-display text-headline-md text-on-surface">Actividad Reciente</h3>
              <Link to="/admin/reportes" className="flex items-center gap-2 font-label-md text-label-md text-primary hover:underline">
                Ver todo <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
            <div className="soft-shadow overflow-x-auto rounded-xl bg-surface-container-lowest">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Mascota</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Tipo</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Ubicación</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Estado</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {reports.slice(0, 5).map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-surface-container-lowest">
                      <td className="flex items-center gap-4 px-6 py-4">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-surface-dim">
                          {r.foto && <img src={r.foto} alt={r.nombreMascota} className="h-full w-full object-cover" />}
                        </div>
                        <span className="font-body-md text-on-surface">{r.nombreMascota || "Sin nombre"}</span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {ESPECIE_LABEL[r.especie]} - {r.raza || "—"}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{r.ubicacion}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-caption font-semibold ${
                            r.tipo === "perdido" ? "bg-tertiary-fixed text-tertiary" : "bg-primary-fixed text-primary"
                          }`}
                        >
                          {r.tipo === "perdido" ? "PERDIDO" : "ENCONTRADO"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/casos/${r.id}`} className="text-primary hover:text-primary-container">
                          <Icon name="visibility" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-10">
            <div className="space-y-6">
              <h3 className="font-display text-headline-md text-on-surface">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/publicar" className="soft-shadow flex items-center gap-4 rounded-xl bg-primary p-4 text-on-primary transition-all hover:bg-primary-container">
                  <Icon name="add_alert" />
                  <span className="font-label-md">Crear Alerta Global</span>
                </Link>
                <button className="flex items-center gap-4 rounded-xl bg-surface-container-highest p-4 text-on-background transition-all hover:bg-surface-container-high">
                  <Icon name="file_download" />
                  <span className="font-label-md">Exportar Reporte Semanal</span>
                </button>
                <button className="flex items-center gap-4 rounded-xl bg-surface-container-highest p-4 text-on-background transition-all hover:bg-surface-container-high">
                  <Icon name="mail" />
                  <span className="font-label-md">Notificar a Refugios</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-display text-headline-md text-on-surface">Mapa de Alertas</h3>
              <div className="soft-shadow relative h-64 overflow-hidden rounded-xl bg-surface-dim">
                <img src={MAP_IMAGE} alt="Mapa de alertas" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex items-center gap-2 rounded-lg bg-surface/90 p-4 shadow-xl backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
                    <span className="text-caption font-bold">{activos} Alertas en vivo</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, iconColor, trend, trendColor, label, value }) {
  return (
    <div className="glass-card soft-shadow flex flex-col justify-between rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <span className={`rounded-lg p-2 ${iconBg} ${iconColor}`}>
          <Icon name={icon} />
        </span>
        <span className={`text-caption font-semibold ${trendColor}`}>{trend}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-caption font-medium uppercase tracking-wider text-on-surface-variant">{label}</h3>
        <p className="font-display text-headline-lg text-on-surface">{value}</p>
      </div>
    </div>
  );
}
