import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const items = [
  { to: "/", label: "Inicio", icon: "home" },
  { to: "/buscar", label: "Buscar", icon: "search" },
  { to: "/publicar", label: "Reportar", icon: "add_circle" },
  { to: "/perfil", label: "Perfil", icon: "person" },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container px-4 py-1 shadow-[0_-4px_20px_rgba(0,105,113,0.05)] md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-1 ${
              isActive ? "rounded-full bg-primary-container text-on-primary-container scale-90" : "text-on-surface-variant"
            }`
          }
        >
          <Icon name={item.icon} />
          <span className="font-label-md text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
