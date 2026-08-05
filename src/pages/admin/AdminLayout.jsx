import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/Icon";

const links = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/reportes", label: "Reports Management", icon: "description" },
  { to: "/admin/usuarios", label: "User Management", icon: "group" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface text-on-surface">
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low px-4 py-6 shadow-md md:flex">
        <div className="mb-16 px-6">
          <h1 className="font-display text-headline-md text-on-surface">Admin Portal</h1>
          <p className="mt-1 font-label-md text-label-md text-on-surface-variant opacity-70">Kindred Paws Management</p>
        </div>
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-6 rounded-lg px-6 py-4 transition-all duration-150 ${
                  isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <Icon name={link.icon} />
              <span className="font-label-md text-label-md">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-4 border-t border-outline-variant px-6 pt-6 text-left">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-on-primary">
            {user.avatar ? <img src={user.avatar} alt={user.nombre} className="h-full w-full object-cover" /> : user.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">{user.nombre}</p>
            <p className="text-caption text-on-surface-variant">Cerrar sesión</p>
          </div>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface">
        <Outlet />
      </main>
    </div>
  );
}
