interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ProductImagePlaceholder({ team }: { team?: string | null }) {
  const initials = team
    ? team.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "TL";

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <span className="text-3xl font-bold text-white/80">{initials}</span>
    </div>
  );
}
