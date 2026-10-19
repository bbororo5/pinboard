import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { relatedPins } from "../domain/search";
import { safeSource } from "../domain/validation";
import { Modal } from "../components/Modal";
import { PinImage } from "../components/PinImage";
import { PinGrid } from "../components/PinGrid";
import { SaveDialog } from "../components/SaveDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { Loading } from "../components/Loading";
import {
  ArrowLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
  Plus,
} from "../components/Icon";
import { deletePin } from "../storage/repository";
import styles from "../styles/App.module.css";
export function PinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pins, saved, boards, loading, act, notify } = useData();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [zoom, setZoom] = useState(false);
  const pin = pins.find((p) => p.id === id);
  if (loading) return <Loading />;
  if (!pin)
    return (
      <EmptyState title="핀을 찾을 수 없어요">
        <p>삭제되었거나 존재하지 않는 주소예요.</p>
        <Link to="/" className={styles.secondary}>
          홈으로 돌아가기
        </Link>
      </EmptyState>
    );
  const source = safeSource(pin.source);
  const collections = saved
    .filter((s) => s.pinId === id)
    .map((s) => boards.find((b) => b.id === s.boardId))
    .filter((b) => !!b);
  return (
    <>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={19} /> 영감 둘러보기
      </Link>
      <article className={styles.detail}>
        <button
          className={styles.detailPhoto}
          onClick={() => setZoom(!zoom)}
          aria-label={zoom ? "이미지 축소" : "이미지 확대"}
          aria-pressed={zoom}
        >
          <PinImage pin={pin} eager />
        </button>
        <div className={styles.detailInfo}>
          <div className={styles.detailTop}>
            <span className={styles.pill}>{pin.category}</span>
            <button className={styles.primary} onClick={() => setSaving(true)}>
              <Plus size={17} /> 보드에 저장
            </button>
          </div>
          {source && (
            <a
              className={styles.source}
              href={source}
              target="_blank"
              rel="noreferrer"
            >
              {new URL(source).hostname}
              <ArrowUpRight size={15} />
            </a>
          )}
          <h1>{pin.title}</h1>
          <p className={styles.description}>{pin.description}</p>
          <div className={styles.author}>
            <span className={styles.authorAvatar}>{pin.author.charAt(0)}</span>
            <div>
              <strong>{pin.author}</strong>
              <small>
                {pin.owned ? "내가 만든 핀" : "사진 작가 · Unsplash"}
              </small>
            </div>
          </div>
          <div className={styles.tags}>
            {pin.tags.map((t) => (
              <Link key={t} to={`/search?q=${encodeURIComponent(t)}`}>
                #{t}
              </Link>
            ))}
          </div>
          {collections.length > 0 && (
            <div className={styles.savedIn}>
              <small>저장한 보드</small>
              {collections.map((b) => (
                <Link key={b.id} to={`/boards/${b.id}`}>
                  {b.name} ↗
                </Link>
              ))}
            </div>
          )}
          {pin.owned && (
            <div className={styles.actions}>
              <Link className={styles.secondary} to={`/pin/${pin.id}/edit`}>
                <Pencil size={16} /> 수정
              </Link>
              <button
                className={styles.textButton}
                onClick={() => setDeleting(true)}
              >
                <Trash2 size={16} /> 삭제
              </button>
            </div>
          )}
        </div>
      </article>
      <div className={styles.sectionTitle}>
        <div className={styles.eyebrow}>KEEP EXPLORING</div>
        <h2>비슷한 결의 영감</h2>
      </div>
      {relatedPins(pins, pin).length ? (
        <PinGrid pins={relatedPins(pins, pin)} resetKey={id} />
      ) : (
        <p className={styles.muted}>관련 태그의 다른 핀이 아직 없어요.</p>
      )}
      {zoom && (
        <Modal title={pin.title} wide onClose={() => setZoom(false)}>
          <PinImage pin={pin} eager />
        </Modal>
      )}
      {saving && <SaveDialog pin={pin} onClose={() => setSaving(false)} />}
      {deleting && (
        <ConfirmDialog
          title="핀을 삭제할까요?"
          description="모든 보드에서도 제거되며 되돌릴 수 없어요."
          onClose={() => setDeleting(false)}
          onConfirm={async () => {
            const ok = await act(() => deletePin(pin.id));
            if (ok) {
              notify("핀을 삭제했어요.");
              navigate("/profile");
            }
            return ok;
          }}
        />
      )}
    </>
  );
}
