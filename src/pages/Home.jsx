import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { reportsApi } from "../api/reports";
import ReportCard from "../components/ReportCard";
import Spinner from "../components/Spinner";
import Icon from "../components/Icon";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBATPk3XIdR0TnY-FKBCAmUaOCZ_94HAY1vKIJBFB1cAssFVz6krFBMf8EyfdvpIiGldAvueBnq7eVd_9FK36s034Kf976-PLGc0Y29ZTbhZfQmipRR9cxu5It2SuKbK6a9lSlDw9vJvgvZuS-uYmRGwkLRFpofLJ92dnpT88Fj4D1QE-606PPp_lQ08rjY734YUq-8aHJaA6S8Dt86yW-Wfv9EjfyFbDqA1o4l4LBIQzuE2I2qES3WShxEJxg8YNi-2Fxt-7aU20k";

export default function Home() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    reportsApi
      .list()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const resueltos = reports.filter((r) => r.estado === "resuelto").length;
  const recientes = reports.slice(0, 4);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("q", [query, city].filter(Boolean).join(" "));
    navigate(`/buscar?${params.toString()}`);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient relative flex min-h-[720px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -right-[5%] -top-[10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -bottom-[10%] -left-[5%] h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-4 md:px-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container/20 px-6 py-1 text-primary-container">
              <Icon name="verified" filled className="text-sm" />
              <span className="font-label-md text-label-md">Confiado por más de 5,000 dueños</span>
            </div>
            <h1 className="font-display text-headline-lg-mobile leading-tight text-on-background md:text-headline-lg">
              Cada mascota merece un <span className="italic text-primary">camino a casa</span>.
            </h1>
            <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Kindred Paws es una red impulsada por la comunidad dedicada a reunir mascotas perdidas con sus
              familias. En momentos de preocupación, brindamos las herramientas y el apoyo para traerlos de vuelta a
              salvo.
            </p>
            <div className="flex flex-wrap gap-6 pt-1">
              <Link
                to="/publicar"
                className="flex h-14 items-center gap-2 rounded-xl bg-primary px-10 font-label-md text-label-md text-on-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Icon name="add_circle" />
                Reportar Mascota
              </Link>
              <Link
                to="/buscar"
                className="flex h-14 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-high px-10 font-label-md text-label-md text-primary transition-colors hover:bg-surface"
              >
                Buscar en Mapa
              </Link>
              <Link
                to="/demostracion"
                className="flex h-14 items-center gap-2 rounded-xl px-4 font-label-md text-label-md text-primary transition-colors hover:underline"
              >
                <Icon name="play_circle" filled />
                Ver Demostración
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rotate-2 overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-500 hover:rotate-0">
              <img className="h-full w-full object-cover" src={HERO_IMAGE} alt="Golden Retriever reencontrado con su dueño" />
            </div>
            <div className="glass-effect absolute -bottom-6 left-2 max-w-[200px] rounded-2xl border border-white/50 p-6 shadow-xl sm:-left-6">
              <p className="font-display text-headline-md leading-none text-primary">{1240 + resueltos}+</p>
              <p className="font-label-md text-label-md text-on-surface-variant">Mascotas reunidas este mes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <section className="relative z-20 mx-auto -mt-12 max-w-[1200px] px-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-xl md:flex-row"
        >
          <div className="relative w-full flex-1">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por raza, nombre o ciudad..."
              className="h-12 w-full rounded-xl border border-outline-variant pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative w-full flex-1">
            <Icon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ingresa tu provincia o ciudad"
              className="h-12 w-full rounded-xl border border-outline-variant pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="h-12 w-full rounded-xl bg-secondary px-16 font-label-md text-label-md text-on-secondary transition-all hover:opacity-90 md:w-auto">
            Buscar Mascotas
          </button>
        </form>
      </section>

      {/* Recent Reports */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-headline-md text-on-background mb-2">Reportes Recientes</h2>
            <p className="font-body-md text-on-surface-variant">Mantente atento a estos vecinos en tu área.</p>
          </div>
          <Link to="/buscar" className="hidden items-center gap-2 font-label-md text-primary hover:underline md:flex">
            Ver todos los reportes
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : recientes.length === 0 ? (
          <p className="text-on-surface-variant">Aún no hay reportes publicados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recientes.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link to="/buscar" className="mx-auto flex items-center justify-center gap-2 font-label-md text-primary">
            Ver todos los reportes
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-on-primary">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-10 px-4 md:flex-row md:px-10">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="font-display text-headline-lg mb-4">Comienza tu búsqueda hoy</h2>
            <p className="font-body-lg text-body-lg text-on-primary/80">
              Los minutos cuentan cuando una mascota se pierde. Usa nuestro sistema de alertas digitales para
              notificar a los usuarios cercanos al instante.
            </p>
          </div>
          <div className="flex w-full flex-col gap-6 sm:flex-row md:w-auto">
            <Link
              to="/publicar"
              className="h-12 rounded-xl bg-white px-10 font-label-md text-label-md text-primary shadow-md transition-colors hover:bg-surface-container-low flex items-center justify-center"
            >
              Publicar una Alerta
            </Link>
            <Link
              to="/buscar"
              className="h-12 rounded-xl bg-primary-container px-10 font-label-md text-label-md text-on-primary-container transition-all hover:opacity-90 flex items-center justify-center"
            >
              Cómo Funciona
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
