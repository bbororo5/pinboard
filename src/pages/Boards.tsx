import { useState } from "react";
import { useData } from "../context/DataContext";
import { BoardCard } from "../components/BoardCard";
import { BoardDialog } from "../components/BoardDialog";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { Plus } from "../components/Icon";
import styles from "../styles/App.module.css";
export function Boards() {
  const { boards, loading } = useData();
  const [creating, setCreating] = useState(false);
  return (
    <>
      <section className={styles.pageHeading}>
        <div>
          <div className={styles.eyebrow}>YOUR LITTLE COLLECTIONS</div>
          <h1>
            내 보드<span>.</span>
          </h1>
          <p>좋아하는 것들을 모으면, 나만의 취향이 보여요.</p>
        </div>
        <button className={styles.primary} onClick={() => setCreating(true)}>
          <Plus size={18} /> 새 보드
        </button>
      </section>
      {loading ? (
        <Loading />
      ) : boards.length ? (
        <div className={styles.boardGrid}>
          {boards.map((b) => (
            <BoardCard key={b.id} board={b} />
          ))}
        </div>
      ) : (
        <EmptyState title="첫 번째 보드를 만들어 보세요">
          <p>여행, 일상, 사진… 어떤 이름이든 좋아요.</p>
          <button className={styles.primary} onClick={() => setCreating(true)}>
            보드 만들기
          </button>
        </EmptyState>
      )}
      {creating && <BoardDialog onClose={() => setCreating(false)} />}
    </>
  );
}
