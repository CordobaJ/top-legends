import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/images/ui/logo.png"
        alt="Top Legends"
        width={120}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}
