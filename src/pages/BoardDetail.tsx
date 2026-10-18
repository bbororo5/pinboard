import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { BoardDialog } from "../components/BoardDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PinCard } from "../components/PinCard";
import { EmptyState } from "../components/EmptyState";
import { Loading } from "../components/Loading";
import { deleteBoard, unsavePin } from "../storage/repository";
import { ArrowLeft, Pencil, Trash2 } from "../components/Icon";
import styles from "../styles/App.module.css";
export function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pins, boards, saved, loading, act, notify } = useData();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const board = boards.find((b) => b.id === id);
  if (loading) return <Loading />;
  if (!board)
    return (
      <EmptyState title="보드를 찾을 수 없어요">
        <Link to="/boards" className={styles.secondary}>
          내 보드 보기
        </Link>
      </EmptyState>
    );
  const items = saved
    .filter((s) => s.boardId === id)
    .map((s) => pins.find((p) => p.id === s.pinId))
    .filter((p) => !!p);
  return (
    <>
      <Link className={styles.back} to="/boards">
        <ArrowLeft size={18} /> 내 보드
      </Link>
      <section className={styles.pageHeading}>
        <div>
          <div className={styles.eyebrow}>MY INSPIRATION BOARD</div>
          <h1>{board.name}</h1>
          <p>핀 {items.length}개 · 나만의 작은 컬렉션</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={() => setEditing(true)}>
            <Pencil size={16} /> 이름 변경
          </button>
          <button
            className={styles.iconButton}
            aria-label="보드 삭제"
            onClick={() => setDeleting(true)}
          >
            <Trash2 size={19} />
          </button>
        </div>
      </section>
      {items.length ? (
        <div className={styles.masonry}>
          {items.map((pin) => (
            <div key={pin.id} className={styles.boardPin}>
              <PinCard pin={pin} />
              <button
                className={styles.removePin}
                onClick={async () => {
                  if (await act(() => unsavePin(board.id, pin.id)))
                    notify("보드에서 핀을 꺼냈어요.");
                }}
              >
                이 보드에서 꺼내기
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="어떤 영감을 담아 볼까요?">
          <p>홈에서 마음에 드는 핀을 이 보드에 저장해 보세요.</p>
          <Link to="/" className={styles.primary}>
            영감 찾으러 가기
          </Link>
        </EmptyState>
      )}
      {editing && (
        <BoardDialog board={board} onClose={() => setEditing(false)} />
      )}
      {deleting && (
        <ConfirmDialog
          title="보드를 삭제할까요?"
          description="이 보드의 저장 목록이 제거됩니다. 원본 핀은 그대로 남아요."
          onClose={() => setDeleting(false)}
          onConfirm={async () => {
            const ok = await act(() => deleteBoard(board.id));
            if (ok) {
              notify("보드를 삭제했어요.");
              navigate("/boards");
            }
            return ok;
          }}
        />
      )}
    </>
  );
}
