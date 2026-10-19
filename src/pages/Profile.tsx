import { Link, useSearchParams } from "react-router-dom";
import { PROFILE } from "../domain/constants";
import { useData } from "../context/DataContext";
import { BoardCard } from "../components/BoardCard";
import { PinGrid } from "../components/PinGrid";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { Plus } from "../components/Icon";
import styles from "../styles/App.module.css";
export function Profile() {
  const { boards, pins, saved, loading } = useData();
  const [params, setParams] = useSearchParams();
  const created = params.get("tab") === "created";
  const own = pins.filter((p) => p.owned);
  return (
    <>
      <section className={styles.profile}>
        <div className={styles.profileAvatar}>S</div>
        <div className={styles.eyebrow}>A COLLECTION OF YOU</div>
        <h1>{PROFILE.name}</h1>
        <span>@{PROFILE.handle}</span>
        <p>{PROFILE.bio}</p>
        <small>
          보드 {boards.length}개 · 만든 핀 {own.length}개 · 저장 {saved.length}
          개
        </small>
        <Link to="/create" className={styles.secondary}>
          <Plus size={16} /> 새로운 핀 만들기
        </Link>
      </section>
      <div className={styles.tabs}>
        <button
          className={!created ? styles.tabActive : ""}
          onClick={() => setParams({})}
        >
          저장한 보드
        </button>
        <button
          className={created ? styles.tabActive : ""}
          onClick={() => setParams({ tab: "created" })}
        >
          만든 핀
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : created ? (
        own.length ? (
          <PinGrid pins={own} />
        ) : (
          <EmptyState title="당신의 첫 장면을 들려주세요">
            <p>사진을 올려 나만의 핀을 만들 수 있어요.</p>
            <Link className={styles.primary} to="/create">
              핀 만들기
            </Link>
          </EmptyState>
        )
      ) : boards.length ? (
        <div className={styles.boardGrid}>
          {boards.map((b) => (
            <BoardCard key={b.id} board={b} />
          ))}
        </div>
      ) : (
        <EmptyState title="아직 보드가 없어요">
          <Link className={styles.primary} to="/boards">
            보드 만들러 가기
          </Link>
        </EmptyState>
      )}
    </>
  );
}
