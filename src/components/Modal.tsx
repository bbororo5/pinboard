import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useData } from "../context/DataContext";
import { X } from "./Icon";
import styles from "../styles/App.module.css";
export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const { notice, notify } = useData();
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    notify("");
    const active = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    dialog.showModal();
    return () => {
      dialog.close();
      active?.focus();
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      className={styles.dialog}
      style={wide ? { width: 1000 } : undefined}
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        close.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className={styles.dialogHeader}>
        <h2 id="dialog-title">{title}</h2>
        <button
          className={styles.iconButton}
          onClick={onClose}
          aria-label="닫기"
        >
          <X />
        </button>
      </div>
      {children}
      {notice && (
        <p className={styles.dialogNotice} role="status">
          {notice}
        </p>
      )}
    </dialog>,
    document.body,
  );
}
