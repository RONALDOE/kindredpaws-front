import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container-low px-4 py-16 md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-10 md:flex-row">
        <div className="max-w-sm space-y-6">
          <div className="flex items-center gap-2">
            <Icon name="pets" filled className="text-2xl text-primary" />
            <span className="font-display text-headline-md font-bold text-primary">Kindred Paws</span>
          </div>
          <p className="font-body-md text-on-surface-variant">
            © 2026 Kindred Paws. Cada mascota merece un camino a casa. Somos una organización sin fines de lucro que
            ayuda a las familias a reunirse.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:gap-16">
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Enlaces Rápidos</h4>
            <ul className="space-y-1">
              <li>
                <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-secondary" href="#">
                  Historias de Éxito
                </a>
              </li>
              <li>
                <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-secondary" href="#">
                  Consejos de Seguridad
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Soporte</h4>
            <ul className="space-y-1">
              <li>
                <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-secondary" href="#">
                  Soporte Comunitario
                </a>
              </li>
              <li>
                <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-secondary" href="#">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
