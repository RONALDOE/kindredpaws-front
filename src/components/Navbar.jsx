import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/buscar", label: "Buscar" },
  { to: "/publicar", label: "Reportar Mascota" },
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-sm">
      <nav className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 md:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Icon name="pets" filled className="text-3xl text-primary" />
          <span className="hidden font-display text-headline-md font-bold text-primary sm:inline">Kindred Paws</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `font-label-md text-label-md transition-colors ${
                  isActive
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-label-md text-label-md transition-colors ${
                  isActive ? "border-b-2 border-primary pb-1 text-primary" : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="hidden font-label-md text-label-md text-on-surface-variant hover:text-primary sm:block"
              >
                Cerrar sesión
              </button>
              <Link to="/perfil" className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-primary-fixed">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.nombre} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-bold text-on-primary-fixed-variant">
                    {user.nombre.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/acceso"
                className="hidden font-label-md text-label-md text-primary hover:bg-primary/5 rounded-full px-4 py-2 transition-all sm:block"
              >
                Ingresar
              </Link>
              <Link
                to="/acceso?modo=registro"
                className="rounded-full bg-primary px-6 py-2 font-label-md text-label-md text-on-primary shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
