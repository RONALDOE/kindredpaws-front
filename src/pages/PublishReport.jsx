import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportsApi } from "../api/reports";
import { useAuth } from "../context/AuthContext";
import { fileToDataUrl } from "../utils/file";
import Icon from "../components/Icon";

const STEPS = [
  { n: 1, label: "Info Mascota" },
  { n: 2, label: "Ubicación" },
  { n: 3, label: "Detalles" },
];

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAAR1KPpcmaLI9HjRUDgUaQAaAbSL1vcSxDPG6eP_4rUxV8XoWIuGc9p7Xcw6hLHb05isBPc86bdUWasEeCTkoNYwgopaMJZ46CnWH7-TjUwLpngHAmNQivonaABs4SEubWLSANf0jMvrL5rflVm_96pzq9QBTGZrmC0kRNlqZGmZs07NfOJFtXgrjiW3BFjtAKy2k4SDZG7ilLDtRBIS2TGLrjMRBAufBWRDbbdrW6H4-jaO3u4B2dCnkoaOA-2-Rn4NfzDvJsJ7k";

const initialState = {
  nombreMascota: "",
  especie: "perro",
  raza: "",
  color: "",
  sexo: "",
  edad: "",
  provincia: "",
  ciudad: "",
  ubicacion: "",
  tipo: "",
  fecha: new Date().toISOString().slice(0, 10),
  descripcion: "",
};

export default function PublishReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [foto, setFoto] = useState("");
  const [fotoNombre, setFotoNombre] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoNombre(file.name);
    setFoto(await fileToDataUrl(file));
  }

  function goNext() {
    setError("");
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    handleSubmit();
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit() {
    if (!form.tipo) {
      setError("Selecciona si perdiste o encontraste una mascota.");
      return;
    }
    if (!form.ciudad.trim()) {
      setError("Indica al menos la ciudad.");
      return;
    }

    setSubmitting(true);
    try {
      const ubicacion = [form.ubicacion, form.ciudad, form.provincia].filter(Boolean).join(", ");
      const created = await reportsApi.create({
        tipo: form.tipo,
        especie: form.especie,
        nombreMascota: form.nombreMascota,
        raza: form.raza,
        color: form.color,
        tamano: "",
        sexo: form.sexo || "desconocido",
        edad: form.edad,
        descripcion: form.descripcion,
        foto,
        ubicacion,
        fecha: form.fecha,
        contactoNombre: user.nombre,
        contactoTelefono: user.telefono || "",
        contactoEmail: user.email,
      });
      navigate(`/casos/${created.id}`);
    } catch (err) {
      setError(err.message || "No se pudo publicar el reporte.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="z-10 w-full max-w-[800px]">
        <div className="mb-10 text-center">
          <h1 className="font-display text-headline-lg text-on-surface mb-2">Reportar una Mascota</h1>
          <p className="mx-auto max-w-md font-body-md text-on-surface-variant">
            Tómate un respiro. Estamos aquí para ayudarte a traerlos a casa. Solo unos pasos para llegar a nuestra
            comunidad.
          </p>
        </div>

        {/* Stepper */}
        <div className="relative mb-16 flex items-center justify-between px-4 md:px-16">
          <div className="absolute left-0 top-1/2 -z-0 h-[2px] w-full -translate-y-1/2 bg-outline-variant/30" />
          {STEPS.map((s) => (
            <div key={s.n} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-surface transition-all duration-300 ${
                  s.n === step
                    ? "bg-primary text-on-primary shadow-lg"
                    : s.n < step
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {s.n < step ? <Icon name="check" /> : <span className="font-label-md">{s.n}</span>}
              </div>
              <span className={`font-label-md text-label-md ${s.n === step ? "text-primary" : "text-on-surface-variant"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass-card flex min-h-[460px] flex-col overflow-hidden rounded-xl p-6 shadow-2xl md:p-10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Nombre de la Mascota">
                  <input
                    className="input"
                    placeholder="ej. Luna"
                    value={form.nombreMascota}
                    onChange={(e) => update("nombreMascota", e.target.value)}
                  />
                </Field>
                <Field label="Especie">
                  <select className="input" value={form.especie} onChange={(e) => update("especie", e.target.value)}>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="ave">Ave</option>
                    <option value="otro">Otro</option>
                  </select>
                </Field>
                <Field label="Raza">
                  <input className="input" placeholder="ej. Golden Retriever" value={form.raza} onChange={(e) => update("raza", e.target.value)} />
                </Field>
                <Field label="Color">
                  <input className="input" placeholder="ej. Crema/Blanco" value={form.color} onChange={(e) => update("color", e.target.value)} />
                </Field>
                <Field label="Sexo">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "macho", label: "Macho", icon: "male" },
                      { value: "hembra", label: "Hembra", icon: "female" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border transition-all ${
                          form.sexo === opt.value ? "border-primary text-primary bg-primary/5" : "border-outline-variant hover:bg-primary/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name="sexo"
                          className="hidden"
                          checked={form.sexo === opt.value}
                          onChange={() => update("sexo", opt.value)}
                        />
                        <Icon name={opt.icon} className={form.sexo === opt.value ? "text-primary" : "text-outline"} />
                        <span className="font-label-md">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Edad (Aproximada)">
                  <input className="input" placeholder="ej. 3 años" value={form.edad} onChange={(e) => update("edad", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Provincia / Estado">
                  <input className="input" placeholder="ej. Buenos Aires" value={form.provincia} onChange={(e) => update("provincia", e.target.value)} />
                </Field>
                <Field label="Ciudad">
                  <input className="input" placeholder="ej. La Plata" value={form.ciudad} onChange={(e) => update("ciudad", e.target.value)} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Dirección Exacta / Visto por última vez cerca de">
                    <input
                      className="input"
                      placeholder="ej. Esquina de Av. 7 y 50"
                      value={form.ubicacion}
                      onChange={(e) => update("ubicacion", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-outline-variant">
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('${MAP_IMAGE}')` }} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
                    <Icon name="location_on" className="text-primary" />
                    <span className="text-caption font-label-md">Marcar ubicación para mayor precisión</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-6">
              <Field label="Tipo de Reporte">
                <div className="grid grid-cols-2 gap-4">
                  <label className="group cursor-pointer">
                    <input type="radio" name="tipo" className="hidden" checked={form.tipo === "perdido"} onChange={() => update("tipo", "perdido")} />
                    <div
                      className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all ${
                        form.tipo === "perdido" ? "border-secondary bg-secondary-container/10" : "border-outline-variant"
                      }`}
                    >
                      <Icon name="search" className={`text-[32px] transition-transform group-hover:scale-110 ${form.tipo === "perdido" ? "text-secondary" : "text-outline"}`} />
                      <span className="mt-2 font-label-md">Perdí mi mascota</span>
                    </div>
                  </label>
                  <label className="group cursor-pointer">
                    <input type="radio" name="tipo" className="hidden" checked={form.tipo === "encontrado"} onChange={() => update("tipo", "encontrado")} />
                    <div
                      className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all ${
                        form.tipo === "encontrado" ? "border-tertiary bg-tertiary-container/10" : "border-outline-variant"
                      }`}
                    >
                      <Icon name="volunteer_activism" className={`text-[32px] transition-transform group-hover:scale-110 ${form.tipo === "encontrado" ? "text-tertiary" : "text-outline"}`} />
                      <span className="mt-2 font-label-md">Encontré una mascota</span>
                    </div>
                  </label>
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Fecha del Evento">
                  <input type="date" className="input" value={form.fecha} onChange={(e) => update("fecha", e.target.value)} />
                </Field>
                <Field label="Subir Foto (Opcional)">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-12 w-full items-center justify-between rounded-lg border border-dashed border-outline-variant px-4 transition-colors hover:bg-surface-container"
                  >
                    <span className="truncate font-label-md text-on-surface-variant">{fotoNombre || "Seleccionar archivo..."}</span>
                    <Icon name="add_a_photo" className="text-on-surface-variant" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </Field>
              </div>

              <Field label="Descripción y Marcas Distintivas">
                <textarea
                  rows={3}
                  className="input resize-none py-3"
                  style={{ height: "auto" }}
                  placeholder="ej. Lleva collar azul, muy tímido/a, mancha blanca en pata izquierda..."
                  value={form.descripcion}
                  onChange={(e) => update("descripcion", e.target.value)}
                />
              </Field>
            </div>
          )}

          {error && <p className="mt-6 font-label-md text-sm text-error">{error}</p>}

          <div className="mt-auto flex items-center justify-between pt-10">
            <button
              type="button"
              onClick={goBack}
              className={`flex items-center gap-2 font-label-md text-on-surface-variant transition-colors hover:text-primary ${
                step === 1 ? "invisible" : ""
              }`}
            >
              <Icon name="arrow_back_ios" />
              Atrás
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={submitting}
              className={`flex h-12 items-center gap-2 rounded-full px-8 font-label-md text-label-md text-on-primary shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60 ${
                step === 3 ? "bg-secondary" : "bg-primary"
              }`}
            >
              {step === 3 ? (submitting ? "Enviando..." : "Enviar Reporte") : "Siguiente Paso"}
              <Icon name={step === 3 ? "send" : "arrow_forward_ios"} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-label-md text-on-surface">{label}</label>
      {children}
    </div>
  );
}
