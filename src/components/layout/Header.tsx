import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserMenu } from "@/components/shared/UserMenu";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/productos"
            className="hidden px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white lg:block"
          >
            Productos
          </Link>
          <Link
            href="/categorias/camisetas-retro"
            className="hidden px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white lg:block"
          >
            Retro
          </Link>
          <UserMenu />
          <ThemeToggle />
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
