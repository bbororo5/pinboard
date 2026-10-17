import { useState, useEffect, type FormEvent } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Search, Home, Plus, FolderHeart, Compass, ArrowUpRight } from "./Icon";
import styles from "../styles/App.module.css";
export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("q") ?? "");
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.search]);
  function search(e: FormEvent) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (
    <div className={styles.app}>
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.monogram} aria-label="Pinboard 홈">
          p<span>·</span>
        </Link>
        <nav aria-label="주 메뉴">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? styles.navActive : styles.navItem
            }
            aria-label="홈"
          >
            <Home />
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? styles.navActive : styles.navItem
            }
            aria-label="탐색"
          >
            <Compass />
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? styles.navActive : styles.navItem
            }
            aria-label="핀 만들기"
          >
            <Plus />
          </NavLink>
          <NavLink
            to="/boards"
            className={({ isActive }) =>
              isActive ? styles.navActive : styles.navItem
            }
            aria-label="내 보드"
          >
            <FolderHeart />
          </NavLink>
        </nav>
        <Link
          to="/profile"
          className={styles.sidebarAvatar}
          aria-label="내 프로필"
        >
          S
        </Link>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.header}>
          <Link to="/" className={styles.wordmark}>
            pinboard<span>매일의 영감</span>
          </Link>
          <form onSubmit={search} className={styles.search}>
            <Search size={20} />
            <input
              aria-label="핀 검색"
              placeholder="어떤 영감을 찾고 있나요?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="검색하기">
              <ArrowUpRight size={18} />
            </button>
          </form>
          <Link to="/create" className={styles.headerCreate}>
            <Plus size={18} />
            <span>만들기</span>
          </Link>
          <Link to="/profile" className={styles.avatar} aria-label="내 프로필">
            S
          </Link>
        </header>
        <main id="main" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          <Link to="/">pinboard</Link>
          <span>작은 발견이 모여, 나만의 취향이 됩니다.</span>
          <Link to="/about">데모 안내 · 사진 출처</Link>
        </footer>
      </div>
    </div>
  );
}
