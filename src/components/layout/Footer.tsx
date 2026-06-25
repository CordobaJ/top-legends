import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Tu tienda especializada en productos de fútbol. Camisetas de clubes, selecciones y ediciones retro.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Productos</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/productos?type=CLUB" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Club</Link></li>
              <li><Link href="/productos?type=SELECTION" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Selección</Link></li>
              <li><Link href="/productos?type=RETRO" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Retro</Link></li>
              <li><Link href="/productos?type=UNIFORM" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Uniformes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Ayuda</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/contacto" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Contacto</Link></li>
              <li><Link href="/envios" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Envíos</Link></li>
              <li><Link href="/devoluciones" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Devoluciones</Link></li>
              <li><Link href="/faq" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Contacto</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>contacto@toplegends.co</li>
              <li>+57 304 471 0005</li>
              <li>Turbo, Antioquia</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Top Legends. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
