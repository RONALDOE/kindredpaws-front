import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const VIDEO_ID = "xXGNgcRUjTM";

export default function Demostracion() {
  return (
    <section className="mx-auto max-w-[1000px] px-4 py-16 md:px-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-headline-lg-mobile text-on-background md:text-headline-lg">
          Ve cómo funciona <span className="italic text-primary">Kindred Paws</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          Mira esta breve demostración para descubrir cómo reportar, buscar y reunir mascotas perdidas con sus
          familias.
        </p>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${VIDEO_ID}`}
          title="Demostración de Kindred Paws"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/publicar"
          className="flex h-14 items-center gap-2 rounded-xl bg-primary px-10 font-label-md text-label-md text-on-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Icon name="add_circle" />
          Reportar Mascota
        </Link>
      </div>
    </section>
  );
}
