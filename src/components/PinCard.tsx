import { useState } from "react";
import { Link } from "react-router-dom";
import type { Pin } from "../domain/types";
import { useData } from "../context/DataContext";
import { PinImage } from "./PinImage";
import { SaveDialog } from "./SaveDialog";
import { ArrowUpRight, Check } from "./Icon";
import { safeSource } from "../domain/validation";
import styles from "../styles/App.module.css";
export function PinCard({ pin }: { pin: Pin }) {
  const [open, setOpen] = useState(false);
  const { saved } = useData();
  const isSaved = saved.some((s) => s.pinId === pin.id);
  const source = safeSource(pin.source);
  return (
    <article className={styles.card}>
      <div className={styles.cardPhoto}>
        <Link to={`/pin/${pin.id}`} aria-label={`${pin.title} 상세 보기`}>
          <PinImage pin={pin} />
        </Link>
        <div className={styles.cardOverlay}>
          <span className={styles.cardCategory}>{pin.category}</span>
          <button
            className={isSaved ? styles.savedButton : styles.saveButton}
            onClick={() => setOpen(true)}
            aria-label={`${pin.title} 보드에 저장`}
          >
            {isSaved ? (
              <>
                <Check size={14} /> 저장됨
              </>
            ) : (
              "저장"
            )}
          </button>
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className={styles.cardSource}
              aria-label={`${pin.title} 사진 출처 열기`}
            >
              <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </div>
      <div className={styles.cardInfo}>
        <Link to={`/pin/${pin.id}`}>{pin.title}</Link>
        <p>
          <span className={styles.miniAvatar}>{pin.author.charAt(0)}</span>
          {pin.author}
        </p>
      </div>
      {open && <SaveDialog pin={pin} onClose={() => setOpen(false)} />}
    </article>
  );
}
