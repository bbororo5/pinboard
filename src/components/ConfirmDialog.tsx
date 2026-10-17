import { useState } from "react";
import { Modal } from "./Modal";
import styles from "../styles/App.module.css";
export function ConfirmDialog({
  title,
  description,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  onConfirm: () => Promise<boolean>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={title} onClose={onClose}>
      <p className={styles.muted}>{description}</p>
      <div className={styles.actions}>
        <button className={styles.secondary} onClick={onClose}>
          취소
        </button>
        <button
          className={styles.primary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            if (await onConfirm()) onClose();
            else setBusy(false);
          }}
        >
          {busy ? "삭제 중…" : "삭제하기"}
        </button>
      </div>
    </Modal>
  );
}
