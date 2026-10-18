import { useState } from "react";
import type { Pin } from "../domain/types";
import { useImageUrl } from "../hooks/useImageUrl";
import { ImageOff } from "./Icon";
import styles from "../styles/App.module.css";
export function PinImage({
  pin,
  eager = false,
}: {
  pin: Pin;
  eager?: boolean;
}) {
  const url = useImageUrl(pin);
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={styles.imageError}
        style={{ aspectRatio: `${pin.width}/${pin.height}` }}
      >
        <ImageOff />
        <span>이미지를 불러오지 못했어요</span>
      </div>
    );
  return (
    <img
      src={url}
      alt={pin.title}
      width={pin.width}
      height={pin.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
