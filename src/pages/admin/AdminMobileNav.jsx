import { NavLink } from "react-router-dom";
import Icon from "../../components/Icon";

const links = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/reportes", label: "Reportes", icon: "description" },
  { to: "/admin/usuarios", label: "Usuarios", icon: "group" },
];

export default function AdminMobileNav({ onLogout }) {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-outline-variant bg-surface-container-low px-2 py-1 shadow-[0_-4px_20px_rgba(0,105,113,0.05)] md:hidden">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 px-4 py-2 ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`
          }
        >
          <Icon name={link.icon} />
          <span className="font-label-md text-[10px]">{link.label}</span>
        </NavLink>
      ))}
      <button onClick={onLogout} className="flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-on-surface-variant">
        <Icon name="logout" />
        <span className="font-label-md text-[10px]">Salir</span>
      </button>
    </nav>
  );
}
