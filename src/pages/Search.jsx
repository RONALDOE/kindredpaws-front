import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { reportsApi } from "../api/reports";
import ReportCard from "../components/ReportCard";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import Icon from "../components/Icon";

const PER_PAGE = 8;

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const q = params.get("q") ?? "";
  const tipo = params.get("tipo") ?? "";
  const especie = params.get("especie") ?? "";
  const ubicacion = params.get("ubicacion") ?? "";

  useEffect(() => {
    reportsApi
      .list()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return reports.filter((r) => {
      if (tipo && r.tipo !== tipo) return false;
      if (especie && r.especie !== especie) return false;
      if (ubicacion && !r.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())) return false;
      if (!term) return true;
      return [r.nombreMascota, r.raza, r.color, r.ubicacion, r.descripcion]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term));
    });
  }, [reports, q, tipo, especie, ubicacion]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-10 md:py-10">
      {/* Search & Filter */}
      <section className="mb-16">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="font-display text-headline-lg text-on-surface mb-2">Encuentra a un amigo</h1>
            <p className="max-w-2xl text-on-surface-variant">
              Utiliza nuestros filtros avanzados para reducir tu búsqueda. Cada segundo cuenta cuando una mascota
              desaparece.
            </p>
          </header>

          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={q}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Buscar por nombre, raza o descripción..."
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-4 pl-12 pr-4 font-body-lg text-body-lg shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Tipo de reporte"
              value={tipo}
              onChange={(v) => updateParam("tipo", v)}
              options={[
                { value: "", label: "Todos los tipos" },
                { value: "perdido", label: "Mascotas perdidas" },
                { value: "encontrado", label: "Mascotas encontradas" },
              ]}
            />
            <FilterSelect
              label="Especie"
              value={especie}
              onChange={(v) => updateParam("especie", v)}
              options={[
                { value: "", label: "Cualquier especie" },
                { value: "perro", label: "Perros" },
                { value: "gato", label: "Gatos" },
                { value: "ave", label: "Aves" },
                { value: "otro", label: "Otros" },
              ]}
            />
            <div className="flex flex-col gap-2">
              <label className="ml-1 font-label-md text-label-md text-on-surface-variant">Ubicación</label>
              <input
                value={ubicacion}
                onChange={(e) => updateParam("ubicacion", e.target.value)}
                placeholder="Ciudad o provincia"
                className="w-full cursor-pointer rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Mostrando {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant">Ordenar por:</span>
            <span className="flex items-center gap-2 font-label-md text-label-md text-primary">
              Más recientes primero
              <Icon name="expand_more" className="text-sm" />
            </span>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No se encontraron resultados"
            description="Intenta con otros filtros o publica un nuevo reporte si no encuentras el caso que buscas."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full p-2 transition-colors hover:bg-surface-container disabled:opacity-30"
            >
              <Icon name="chevron_left" />
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-10 w-10 rounded-full font-label-md transition-colors ${
                    n === page ? "bg-primary text-on-primary" : "hover:bg-surface-container"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full p-2 transition-colors hover:bg-surface-container disabled:opacity-30"
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="ml-1 font-label-md text-label-md text-on-surface-variant">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
