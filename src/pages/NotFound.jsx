import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
      <Icon name="pets" filled className="text-[40px] text-primary/40" />
      <h1 className="font-display text-headline-lg text-on-surface">Página no encontrada</h1>
      <p className="text-on-surface-variant">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="mt-2 rounded-full bg-primary px-5 py-2 font-label-md text-label-md text-on-primary hover:bg-primary-container">
        Volver al inicio
      </Link>
    </div>
  );
}
