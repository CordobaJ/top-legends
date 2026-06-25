import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-zinc-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/fondo.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-900/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Viste tu <span className="text-blue-400">pasión</span> por el fútbol
            </h1>
            <p className="mt-6 text-lg text-zinc-300">
              Top Legends Donde cada camiseta cuenta una historia, cada escudo representa una pasión y cada leyenda sigue viva.

            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/productos"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition-all hover:bg-blue-700"
              >
                Ver productos
              </Link>
              <Link
                href="/categorias/camisetas-retro"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-500 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Retro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Club", desc: "Camisetas de los mejores clubes del mundo", href: "/productos?type=CLUB" },
            { title: "Selecciones", desc: "Representa a tu país con orgullo", href: "/productos?type=SELECTION" },
            { title: "Retro", desc: "Ediciones históricas y clásicas", href: "/productos?type=RETRO" },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group rounded-xl border border-zinc-200 p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-zinc-800"
            >
              <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
