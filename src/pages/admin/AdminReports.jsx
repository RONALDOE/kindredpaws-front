import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { reportsApi } from "../../api/reports";
import { formatDate } from "../../utils/date";
import Spinner from "../../components/Spinner";
import Icon from "../../components/Icon";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    reportsApi
      .list()
      .then(setReports)
      .finally(() => setLoading(false));
  }

  async function toggleEstado(id, current) {
    const updated = await reportsApi.update(id, { estado: current === "resuelto" ? "activo" : "resuelto" });
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este reporte?")) return;
    await reportsApi.remove(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reports.filter((r) => {
      if (tipo && r.tipo !== tipo) return false;
      if (estado && r.estado !== estado) return false;
      if (!term) return true;
      return [r.nombreMascota, r.raza, r.ubicacion].filter(Boolean).some((f) => f.toLowerCase().includes(term));
    });
  }, [reports, search, tipo, estado]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const activosUrgentes = reports.filter((r) => r.estado === "activo").length;
  const resueltosCount = reports.filter((r) => r.estado === "resuelto").length;
  const metaPct = reports.length ? Math.round((resueltosCount / reports.length) * 100) : 0;

  if (loading) return <Spinner />;

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex w-full items-center justify-between bg-surface px-4 py-4 shadow-sm md:px-10">
        <h2 className="font-display text-headline-md font-bold text-primary">Gestión de Reportes</h2>
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar reportes..."
              className="w-64 rounded-full border border-outline bg-surface-container-lowest py-2 pl-16 pr-6 text-body-md outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <Link to="/publicar" className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-on-primary transition-all hover:shadow-md">
            <Icon name="add" />
            <span className="font-label-md">Nuevo Reporte</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] flex-1 p-4 md:p-10">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-6 rounded-xl border border-outline-variant bg-surface p-6 shadow-sm">
          <div className="flex min-w-[160px] flex-col gap-1">
            <label className="font-label-md text-on-surface-variant">Tipo de Reporte</label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border-outline-variant bg-surface-container-low p-2 text-body-md outline-none focus:border-primary"
            >
              <option value="">Todos</option>
              <option value="perdido">Perdido</option>
              <option value="encontrado">Encontrado</option>
            </select>
          </div>
          <div className="flex min-w-[160px] flex-col gap-1">
            <label className="font-label-md text-on-surface-variant">Estado</label>
            <select
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border-outline-variant bg-surface-container-low p-2 text-body-md outline-none focus:border-primary"
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-4 self-end">
            <button
              onClick={() => {
                setTipo("");
                setEstado("");
                setSearch("");
              }}
              className="rounded-lg px-6 py-2 font-label-md text-primary transition-colors hover:bg-primary-fixed"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 font-label-md uppercase tracking-wider text-on-surface-variant">ID</th>
                  <th className="px-6 py-4 font-label-md uppercase tracking-wider text-on-surface-variant">Mascota</th>
                  <th className="px-6 py-4 font-label-md uppercase tracking-wider text-on-surface-variant">Tipo</th>
                  <th className="px-6 py-4 font-label-md uppercase tracking-wider text-on-surface-variant">Estado</th>
                  <th className="px-6 py-4 font-label-md uppercase tracking-wider text-on-surface-variant">Fecha</th>
                  <th className="px-6 py-4 text-right font-label-md uppercase tracking-wider text-on-surface-variant">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paged.map((r) => (
                  <tr key={r.id} className="group transition-colors hover:bg-surface-container">
                    <td className="px-6 py-6 font-label-md text-on-surface">#KP-{r.id.padStart(4, "0")}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-cover bg-center bg-surface-container-high" style={r.foto ? { backgroundImage: `url('${r.foto}')` } : undefined} />
                        <div>
                          <p className="font-label-md text-on-surface">{r.nombreMascota || "Sin nombre"}</p>
                          <p className="font-caption text-on-surface-variant">{r.raza || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`rounded-full px-4 py-1 text-caption font-label-md ${
                          r.tipo === "perdido" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-fixed text-on-primary-fixed-variant"
                        }`}
                      >
                        {r.tipo === "perdido" ? "Perdido" : "Encontrado"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      {r.estado === "activo" ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                          <span className="font-body-md text-primary">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-outline">
                          <Icon name="check_circle" className="text-[16px]" />
                          <span className="font-body-md">Resuelto</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6 font-body-md text-on-surface-variant">{formatDate(r.fecha)}</td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => toggleEstado(r.id, r.estado)} className="rounded-lg p-2 text-primary hover:bg-primary-fixed" title="Alternar estado">
                          <Icon name="verified" />
                        </button>
                        <Link to={`/casos/${r.id}`} className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high" title="Ver">
                          <Icon name="visibility" />
                        </Link>
                        <button onClick={() => handleDelete(r.id)} className="rounded-lg p-2 text-error hover:bg-error-container" title="Eliminar">
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paged.length === 0 && <p className="px-6 py-16 text-center text-on-surface-variant">No hay reportes que coincidan.</p>}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-4">
            <p className="font-caption text-on-surface-variant">
              Mostrando {paged.length} de {filtered.length} reportes
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-outline-variant p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
              >
                <Icon name="chevron_left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded-lg font-label-md ${n === page ? "bg-primary text-on-primary" : "hover:bg-surface-container-high"}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-outline-variant p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>

        {/* Bento Stats */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex cursor-default flex-col gap-2 rounded-2xl border border-outline-variant bg-surface-container-highest p-6 transition-transform hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <Icon name="pets" className="text-[32px] text-primary" />
              <span className="rounded-full bg-primary-container/20 px-2 py-1 text-caption font-bold text-primary">Total</span>
            </div>
            <p className="font-display text-headline-md font-bold text-on-surface">{reports.length}</p>
            <p className="font-label-md text-on-surface-variant">Total Reportes</p>
          </div>
          <div className="flex cursor-default flex-col gap-2 rounded-2xl bg-primary-container p-6 transition-transform hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <Icon name="task_alt" className="text-[32px] text-on-primary-container" />
              <span className="rounded-full bg-on-primary px-2 py-1 text-caption font-bold text-primary">Meta {metaPct}%</span>
            </div>
            <p className="font-display text-headline-md font-bold text-on-primary-container">{resueltosCount}</p>
            <p className="font-label-md text-on-primary-container opacity-80">Reportes Resueltos</p>
          </div>
          <div className="flex cursor-default flex-col gap-2 rounded-2xl border border-outline-variant bg-surface-container-high p-6 transition-transform hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <Icon name="priority_high" className="text-[32px] text-secondary" />
            </div>
            <p className="font-display text-headline-md font-bold text-on-surface">{activosUrgentes}</p>
            <p className="font-label-md text-on-surface-variant">Casos Activos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
