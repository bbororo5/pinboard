import { useEffect, useState } from "react";
import type { Pin } from "../domain/types";
export function useImageUrl(pin: Pin) {
  const [local, setLocal] = useState<{ blob: Blob; url: string }>();
  useEffect(() => {
    if (!pin.blob) return;
    const blob = pin.blob;
    const url = URL.createObjectURL(blob);
    setLocal({ blob, url });
    return () => URL.revokeObjectURL(url);
  }, [pin.blob]);
  return pin.blob
    ? local?.blob === pin.blob
      ? local.url
      : undefined
    : pin.image;
}
