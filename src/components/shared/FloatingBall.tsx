"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingBall() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/productos")) return null;

  return (
    <Link
      href="/productos?descuentos=true"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 shadow-lg transition-transform hover:scale-110 active:scale-95 dark:bg-white"
      aria-label="Ver productos en descuento"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-8 w-8 fill-white dark:fill-zinc-900"
      >
        <path d="M50 5C25.2 5 5 25.2 5 50s20.2 45 45 45 45-20.2 45-45S74.8 5 50 5zm0 8.5c7.8 0 15 2.5 20.8 6.7L50 28.6 29.2 20.2C35 16 42.2 13.5 50 13.5zM22.5 23.8l15.5 7.3L24.3 55.6C22.6 53.8 21.3 51.7 20.4 49.4c-1.2-3-1.8-6.2-1.8-9.4 0-5.8 1.3-11.3 3.9-16.2zm55 0c2.6 4.9 3.9 10.4 3.9 16.2 0 3.2-.6 6.4-1.8 9.4-.9 2.3-2.2 4.4-3.9 6.2L62 31.1l15.5-7.3zM50 32.4l8.1 3.8-8.1 19.2L41.9 36.2 50 32.4zM35 38.8l11.6 27.4H26.8c1.6-4.7 4.5-8.8 8.2-11.9V38.8zm30 0v15.5c3.7 3.1 6.6 7.2 8.2 11.9H53.4L65 38.8zM26 71.2h48c-3 8.2-10.3 14.5-19.1 16.2L50 88.1l-4.9-.7c-8.8-1.7-16.1-8-19.1-16.2z"/>
      </svg>
    </Link>
  );
}
