"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

function ImageFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <svg className="h-16 w-16 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    </div>
  );
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const selected = images[selectedIndex];

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        {selected && !imgError[selectedIndex] ? (
          <Image
            src={selected.url}
            alt={selected.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            onError={() => setImgError((p) => ({ ...p, [selectedIndex]: true }))}
          />
        ) : (
          <ImageFallback />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === selectedIndex
                  ? "border-blue-600"
                  : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              {imgError[i] ? (
                <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-800" />
              ) : (
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                  onError={() => setImgError((p) => ({ ...p, [i]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
