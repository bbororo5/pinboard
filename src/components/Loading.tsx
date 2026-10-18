import styles from "../styles/App.module.css";
export function Loading() {
  return (
    <div
      className={styles.skeletonGrid}
      role="status"
      aria-label="핀을 불러오는 중"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ height: 200 + (i % 3) * 70 }}
        />
      ))}
    </div>
  );
}
