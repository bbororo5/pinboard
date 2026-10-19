import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import styles from "../styles/App.module.css";
export function NotFound() {
  return (
    <EmptyState title="길을 조금 벗어났네요">
      <p>이 페이지는 존재하지 않아요. 새로운 영감을 찾아볼까요?</p>
      <Link to="/" className={styles.primary}>
        홈으로 돌아가기
      </Link>
    </EmptyState>
  );
}
