import { useState, type FormEvent } from "react";
import type { Pin } from "../domain/types";
import { useData } from "../context/DataContext";
import { savePin, createBoard, unsavePin } from "../storage/repository";
import { Modal } from "./Modal";
import { Check, Plus, FolderHeart } from "./Icon";
import styles from "../styles/App.module.css";
export function SaveDialog({
  pin,
  onClose,
}: {
  pin: Pin;
  onClose: () => void;
}) {
  const { boards, saved, act, notify } = useData();
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  async function toggle(boardId: string, exists: boolean) {
    setBusy(true);
    const ok = await act(() =>
      exists ? unsavePin(boardId, pin.id) : savePin(boardId, pin.id),
    );
    setBusy(false);
    if (ok) notify(exists ? "보드에서 핀을 꺼냈어요." : "보드에 저장했어요.");
  }
  async function add(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await act(async () => {
      const board = await createBoard(name);
      await savePin(board.id, pin.id);
    });
    setBusy(false);
    if (ok) {
      notify("새 보드에 핀을 저장했어요.");
      onClose();
    }
  }
  return (
    <Modal title="보드에 저장" onClose={onClose}>
      <p className={styles.muted}>이 장면을 어디에 모아 둘까요?</p>
      <div className={styles.boardList}>
        {boards.map((board) => {
          const exists = saved.some(
            (s) => s.boardId === board.id && s.pinId === pin.id,
          );
          return (
            <button
              key={board.id}
              disabled={busy}
              aria-pressed={exists}
              className={styles.boardRow}
              onClick={() => void toggle(board.id, exists)}
            >
              <span className={styles.boardIcon}>
                <FolderHeart size={22} />
              </span>
              <span>{board.name}</span>
              <span className={exists ? styles.savedMark : styles.saveMark}>
                {exists ? <Check size={18} /> : "저장"}
              </span>
            </button>
          );
        })}
      </div>
      {creating ? (
        <form onSubmit={add} className={styles.inlineForm}>
          <label className="sr-only" htmlFor="new-board">
            새 보드 이름
          </label>
          <input
            id="new-board"
            required
            maxLength={60}
            autoFocus
            placeholder="새 보드 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.primary} disabled={busy || !name.trim()}>
            만들고 저장
          </button>
        </form>
      ) : (
        <button
          className={styles.createBoard}
          onClick={() => setCreating(true)}
        >
          <Plus size={20} /> 새 보드 만들기
        </button>
      )}
    </Modal>
  );
}
