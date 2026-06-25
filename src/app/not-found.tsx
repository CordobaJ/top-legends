import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Página no encontrada
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
