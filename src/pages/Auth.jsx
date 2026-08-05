import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = location.state?.from?.pathname ?? "/";

  const [mobileView, setMobileView] = useState(searchParams.get("modo") === "registro" ? "register" : "login");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ nombre: "", email: "", password: "", telefono: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [submittingRegister, setSubmittingRegister] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setSubmittingLogin(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setLoginError(err.message || "Ocurrió un error.");
    } finally {
      setSubmittingLogin(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegisterError("");
    setSubmittingRegister(true);
    try {
      await register(registerForm);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setRegisterError(err.message || "Ocurrió un error.");
    } finally {
      setSubmittingRegister(false);
    }
  }

  return (
    <main className="flex flex-grow items-stretch overflow-hidden">
      {/* Left: Login */}
      <section
        className={`relative z-10 flex-1 flex-col items-center justify-center border-r border-outline-variant/20 bg-surface p-6 md:p-16 ${
          mobileView === "login" ? "flex" : "hidden"
        } md:flex`}
      >
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center md:text-left">
            <span className="mb-1 inline-flex items-center justify-center rounded-lg bg-primary-container p-2 text-on-primary-container">
              <Icon name="login" filled />
            </span>
            <h2 className="mt-1 font-display text-headline-lg text-primary">Bienvenido de nuevo</h2>
            <p className="font-body-md text-on-surface-variant">Inicia sesión para continuar tu búsqueda y mantenerte conectado.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="login-email">
                Correo Electrónico
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="input"
                placeholder="nombre@ejemplo.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="login-password">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            {loginError && <p className="font-label-md text-sm text-error">{loginError}</p>}

            <button
              type="submit"
              disabled={submittingLogin}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container active:scale-95 disabled:opacity-60"
            >
              {submittingLogin ? "Ingresando..." : "Iniciar Sesión"}
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-surface-container-low p-4 text-caption text-on-surface-variant">
            <p className="mb-1 font-semibold text-on-surface">Cuentas de demostración</p>
            <p>Admin: admin@kindredpaws.com / admin123</p>
            <p>Usuario: ana@example.com / demo123</p>
          </div>

          <div className="mt-16 text-center md:hidden">
            <p className="font-body-md text-on-surface-variant">
              ¿Nuevo en Kindred Paws?{" "}
              <button type="button" className="font-bold text-primary" onClick={() => setMobileView("register")}>
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Right: Register */}
      <section
        className={`relative z-10 flex-1 flex-col items-center justify-center bg-surface-container-low p-6 md:p-16 ${
          mobileView === "register" ? "flex" : "hidden"
        } md:flex`}
      >
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center md:text-left">
            <span className="mb-1 inline-flex items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container p-2">
              <Icon name="person_add" filled />
            </span>
            <h2 className="mt-1 font-display text-headline-lg text-secondary">Únete a la Comunidad</h2>
            <p className="font-body-md text-on-surface-variant">Cada mascota merece un hogar. Ayúdanos a hacerlo realidad.</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="reg-name">
                Nombre Completo
              </label>
              <input
                id="reg-name"
                required
                className="input"
                placeholder="Juan Pérez"
                value={registerForm.nombre}
                onChange={(e) => setRegisterForm((f) => ({ ...f, nombre: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="reg-email">
                Correo Electrónico
              </label>
              <input
                id="reg-email"
                type="email"
                required
                className="input"
                placeholder="nombre@ejemplo.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="reg-telefono">
                Teléfono
              </label>
              <input
                id="reg-telefono"
                type="tel"
                required
                className="input"
                placeholder="809-555-0123"
                value={registerForm.telefono}
                onChange={(e) => setRegisterForm((f) => ({ ...f, telefono: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="reg-password">
                Crear Contraseña
              </label>
              <input
                id="reg-password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            <div className="flex items-start gap-2 py-1">
              <input required type="checkbox" className="mt-1 rounded border-outline text-secondary focus:ring-secondary" id="terms" />
              <label className="text-caption font-caption text-on-surface-variant" htmlFor="terms">
                Acepto la <span className="text-secondary hover:underline">Política de Privacidad</span> y las guías de seguridad
                comunitaria.
              </label>
            </div>

            {registerError && <p className="font-label-md text-sm text-error">{registerError}</p>}

            <button
              type="submit"
              disabled={submittingRegister}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-secondary font-label-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-container active:scale-95 disabled:opacity-60"
            >
              {submittingRegister ? "Creando..." : "Crear Cuenta"}
              <Icon name="how_to_reg" className="text-[20px]" />
            </button>
          </form>

          <div className="mt-16 text-center md:hidden">
            <p className="font-body-md text-on-surface-variant">
              ¿Ya tienes una cuenta?{" "}
              <button type="button" className="font-bold text-secondary" onClick={() => setMobileView("login")}>
                Ingresa aquí
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
