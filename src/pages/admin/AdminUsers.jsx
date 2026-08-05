import { useEffect, useMemo, useState } from "react";
import { usersApi } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import Icon from "../../components/Icon";

const AVATAR_TINTS = ["bg-tertiary-fixed text-on-tertiary-fixed", "bg-secondary-fixed text-on-secondary-fixed"];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    usersApi
      .list()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  async function toggleRol(id, rol) {
    const nextRol = rol === "admin" ? "usuario" : "admin";
    const updated = await usersApi.update(id, { rol: nextRol });
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }

  async function handleDelete(id) {
    if (id === currentUser.id) return;
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await usersApi.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "No se pudo eliminar el usuario.");
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter && u.rol !== roleFilter) return false;
      if (!term) return true;
      return [u.nombre, u.email].some((f) => f.toLowerCase().includes(term));
    });
  }, [users, search, roleFilter]);

  if (loading) return <Spinner />;

  return (
    <div className="flex h-full flex-col bg-surface-bright">
      <header className="z-10 flex w-full items-center justify-between px-10 py-6">
        <div className="flex flex-col">
          <h2 className="font-display text-headline-lg tracking-tight text-primary">Gestión de Usuarios</h2>
          <p className="font-body-md text-on-surface-variant">Administra el acceso y los roles de la comunidad Kindred Paws.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-64 rounded-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden px-10 pb-10">
        <div className="glass-card flex h-full w-full flex-col rounded-xl shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant p-6">
            <div className="flex gap-2">
              {[
                { value: "", label: "Todos" },
                { value: "admin", label: "Admin" },
                { value: "usuario", label: "Usuario" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setRoleFilter(f.value)}
                  className={`rounded-full px-4 py-1.5 text-caption font-label-md transition-colors ${
                    roleFilter === f.value ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-highest text-on-surface-variant hover:bg-primary-fixed"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-20 bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-xs font-label-md uppercase tracking-wider text-on-surface-variant">Nombre</th>
                  <th className="px-6 py-4 text-xs font-label-md uppercase tracking-wider text-on-surface-variant">Email</th>
                  <th className="px-6 py-4 text-xs font-label-md uppercase tracking-wider text-on-surface-variant">Rol</th>
                  <th className="px-6 py-4 text-xs font-label-md uppercase tracking-wider text-on-surface-variant">Fecha Registro</th>
                  <th className="px-6 py-4 text-right text-xs font-label-md uppercase tracking-wider text-on-surface-variant">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtered.map((u, i) => (
                  <tr key={u.id} className="group transition-colors hover:bg-primary/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {u.avatar ? (
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <img src={u.avatar} alt={u.nombre} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${AVATAR_TINTS[i % AVATAR_TINTS.length]}`}>
                            {u.nombre
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                        <span className="font-body-md font-semibold text-on-surface">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface-variant">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-tight ${
                          u.rol === "admin" ? "bg-primary-container/20 text-primary" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {u.rol === "admin" ? "Admin" : "Usuario"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface-variant">
                      {new Date(u.creadoEn).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => toggleRol(u.id, u.rol)} className="rounded-full p-2 text-primary hover:bg-surface-container-highest" title="Editar Rol">
                          <Icon name="edit_square" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={u.id === currentUser.id}
                          className="rounded-full p-2 text-error hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-30"
                          title="Eliminar"
                        >
                          <Icon name="block" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="px-6 py-16 text-center text-on-surface-variant">No hay usuarios que coincidan.</p>}
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest p-6">
            <span className="text-caption font-body-md text-on-surface-variant">Mostrando {filtered.length} de {users.length} usuarios</span>
          </div>
        </div>
      </div>
    </div>
  );
}
