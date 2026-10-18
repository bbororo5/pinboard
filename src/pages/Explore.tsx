import { Link, useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { searchPins } from "../domain/search";
import { CATEGORIES } from "../domain/constants";
import { PinGrid } from "../components/PinGrid";
import { PinImage } from "../components/PinImage";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { ArrowUpRight, Settings2 } from "../components/Icon";
import styles from "../styles/App.module.css";
export function Explore({ isSearch = false }: { isSearch?: boolean }) {
  const { pins, loading } = useData();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const raw = params.get("category") ?? "전체";
  const category = CATEGORIES.includes(raw as (typeof CATEGORIES)[number])
    ? raw
    : "전체";
  const results = searchPins(pins, query, category);
  function choose(value: string) {
    const next = new URLSearchParams(params);
    if (value === "전체") next.delete("category");
    else next.set("category", value);
    setParams(next);
  }
  return (
    <>
      {!isSearch ? (
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span /> YOUR DAILY DOSE OF INSPIRATION
            </div>
            <h1>
              좋아하는 것들이,
              <br />
              영감이 되는 곳<span>.</span>
            </h1>
            <p>
              스쳐 지나가기엔 아까운 순간들.
              <br />
              당신의 취향을 발견하고, 나만의 보드에 담아 보세요.
            </p>
            <Link to="/boards" className={styles.heroLink}>
              나의 영감 모음 <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            {[pins[22], pins[17], pins[3]].filter(Boolean).map((p, i) => (
              <div
                key={p.id}
                className={styles.heroPhoto}
                style={{ transform: `rotate(${[-9, 7, -3][i]}deg)` }}
              >
                <PinImage pin={p} eager />
                <span>
                  {["a little escape", "slow moments", "find your own"][i]}
                </span>
              </div>
            ))}
            <span className={styles.heroStamp}>
              COLLECT
              <br />
              WHAT YOU
              <br />
              <i>love.</i>
            </span>
          </div>
        </section>
      ) : (
        <section className={styles.searchTitle}>
          <div className={styles.eyebrow}>FIND YOUR INSPIRATION</div>
          <h1>
            {query ? <>‘{query}’ 검색 결과</> : "새로운 영감을 발견하세요"}
          </h1>
          <p className={styles.muted}>
            마음에 드는 장면을 찾고, 나만의 컬렉션을 만들어 보세요.
          </p>
        </section>
      )}
      <section aria-label="핀 탐색">
        <div className={styles.feedHeading}>
          <div>
            <h2>{isSearch ? "탐색하기" : "오늘, 당신을 위한 발견"}</h2>
            <span>
              {loading ? "불러오는 중" : `${results.length}개의 영감`}
            </span>
          </div>
          <span className={styles.feedLabel}>
            <Settings2 size={15} /> 취향대로 모아 보기
          </span>
        </div>
        <div className={styles.categories} aria-label="카테고리">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={
                category === c ? styles.categoryActive : styles.category
              }
              onClick={() => choose(c)}
            >
              {["✦", "◌", "↗", "☕", "▧"][i]}{" "}
              <span>{c === "전체" ? "모든 영감" : c}</span>
            </button>
          ))}
        </div>
        {loading ? (
          <Loading />
        ) : results.length ? (
          <PinGrid pins={results} resetKey={`${query}/${category}`} />
        ) : (
          <EmptyState title="아직 찾는 장면이 없네요">
            <p>다른 검색어나 카테고리로 다시 찾아보세요.</p>
            <button className={styles.secondary} onClick={() => setParams({})}>
              전체 영감 보기
            </button>
          </EmptyState>
        )}
      </section>
    </>
  );
}
