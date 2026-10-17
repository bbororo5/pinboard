import { Link } from "react-router-dom";
import type { Board } from "../domain/types";
import { useData } from "../context/DataContext";
import { PinImage } from "./PinImage";
import { FolderHeart } from "./Icon";
import styles from "../styles/App.module.css";
export function BoardCard({ board }: { board: Board }) {
  const { pins, saved } = useData();
  const items = saved
    .filter((s) => s.boardId === board.id)
    .map((s) => pins.find((p) => p.id === s.pinId))
    .filter((p) => !!p);
  return (
    <Link to={`/boards/${board.id}`} className={styles.boardCard}>
      <div className={styles.boardCover}>
        {items.length ? (
          items.slice(0, 3).map((p) => <PinImage key={p.id} pin={p} />)
        ) : (
          <span>
            <FolderHeart size={38} strokeWidth={1} />
            <small>첫 번째 영감을 담아 보세요</small>
          </span>
        )}
      </div>
      <h3>{board.name}</h3>
      <p>핀 {items.length}개</p>
    </Link>
  );
}
