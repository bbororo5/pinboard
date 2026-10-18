import { useEffect, useState } from "react";
import type { Pin } from "../domain/types";
import { PAGE_SIZE } from "../domain/constants";
import { PinCard } from "./PinCard";
import { ArrowDown } from "./Icon";
import styles from "../styles/App.module.css";
export function PinGrid({
  pins,
  resetKey = "",
}: {
  pins: Pin[];
  resetKey?: string;
}) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  useEffect(() => setLimit(PAGE_SIZE), [resetKey]);
  return (
    <>
      <div className={styles.masonry}>
        {pins.slice(0, limit).map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>
      {limit < pins.length ? (
        <div className={styles.loadMore}>
          <button
            className={styles.secondary}
            onClick={() => setLimit((v) => v + PAGE_SIZE)}
          >
            더 많은 영감 보기 <ArrowDown size={16} />
          </button>
          <span>
            {Math.min(limit, pins.length)} / {pins.length}
          </span>
        </div>
      ) : (
        <p className={styles.endnote}>
          오늘의 영감을 모두 둘러봤어요. 마음에 드는 장면을 모아 보세요.
        </p>
      )}
    </>
  );
}
