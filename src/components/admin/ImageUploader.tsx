"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface ImageItem {
  url: string;
  alt: string | undefined;
  isPrimary: boolean;
  order: number;
}

interface ImageUploaderProps {
  images?: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

export function ImageUploader({ images = [], onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (json.success) {
        onChange([...images, { url: json.data.url, alt: undefined, isPrimary: images.length === 0, order: images.length }]);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    if (images[index]?.isPrimary && updated.length > 0) updated[0].isPrimary = true;
    onChange(updated);
  }

  function setPrimary(index: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} loading={uploading}>
          {uploading ? "Subiendo..." : "Subir imagen"}
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelect} />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {images.length} imagen{images.length !== 1 ? "es" : ""}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" sizes="200px" />
              {img.isPrimary && (
                <span className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Principal
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 hover:bg-white"
                  >
                    Principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="ml-auto rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-medium text-white hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
