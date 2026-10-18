import { useData } from "../context/DataContext";
import styles from "../styles/App.module.css";
export function About() {
  const { pins } = useData();
  return (
    <article className={styles.about}>
      <div className={styles.eyebrow}>ABOUT THIS LITTLE SPACE</div>
      <h1>Pinboard 안내</h1>
      <h2>나만의 브라우저 안에</h2>
      <p>
        로그인 없는 프론트엔드 데모입니다. 핀, 보드, 업로드 이미지는 IndexedDB에
        보관됩니다. 다른 기기와 동기화되지 않으며 브라우저 사이트 데이터를
        삭제하면 사라집니다.
      </p>
      <h2>사진 출처</h2>
      <p>
        샘플 사진 60장은 Lorem Picsum에서 제공하는 Unsplash 사진을 사용합니다.
        사진을 누르면 원본 출처에서 작가를 확인할 수 있습니다.{" "}
        <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
          Unsplash 라이선스
        </a>
      </p>
      <div className={styles.creditGrid}>
        {pins
          .filter((p) => !p.owned)
          .map((p) => (
            <a key={p.id} href={p.source} target="_blank" rel="noreferrer">
              {p.title}
              <small>© {p.author} · Unsplash ↗</small>
            </a>
          ))}
      </div>
    </article>
  );
}
