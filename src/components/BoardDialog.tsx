import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { createBoard, renameBoard } from "../storage/repository";
import { useData } from "../context/DataContext";
import type { Board } from "../domain/types";
import styles from "../styles/App.module.css";
export function BoardDialog({
  board,
  onClose,
}: {
  board?: Board;
  onClose: () => void;
}) {
  const [name, setName] = useState(board?.name ?? "");
  const [busy, setBusy] = useState(false);
  const { act, notify } = useData();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await act(() =>
      board ? renameBoard(board.id, name) : createBoard(name),
    );
    setBusy(false);
    if (ok) {
      notify(board ? "보드 이름을 변경했어요." : "새 보드를 만들었어요.");
      onClose();
    }
  }
  return (
    <Modal
      title={board ? "보드 이름 변경" : "새 보드 만들기"}
      onClose={onClose}
    >
      <form onSubmit={submit} className={styles.form}>
        <p className={styles.muted}>
          좋아하는 것들을 담을 공간에 이름을 붙여 주세요.
        </p>
        <label>
          보드 이름
          <input
            autoFocus
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 언젠가 떠날 여행"
          />
        </label>
        <button className={styles.primary} disabled={busy || !name.trim()}>
          {busy ? "저장 중…" : board ? "변경하기" : "만들기"}
        </button>
      </form>
    </Modal>
  );
}
