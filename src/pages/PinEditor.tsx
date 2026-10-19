import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { PROFILE, CATEGORIES } from "../domain/constants";
import { validateImage, validatePin, parseTags } from "../domain/validation";
import { imageDimensions } from "../lib/images";
import { errorMessage } from "../lib/errors";
import { putPin } from "../storage/repository";
import { PinImage } from "../components/PinImage";
import { EmptyState } from "../components/EmptyState";
import { Loading } from "../components/Loading";
import { Upload, ArrowLeft, ArrowUpRight } from "../components/Icon";
import styles from "../styles/App.module.css";
export function PinEditor() {
  const { id } = useParams();
  const { pins, loading, act, notify } = useData();
  const existing = pins.find((p) => p.id === id);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("일상");
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setTags(existing.tags.join(", "));
      setSource(existing.source);
      setCategory(existing.category);
    }
  }, [existing?.id]);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function select(next?: File) {
    if (!next) return;
    const message = validateImage(next);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setFile(next);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const value = {
      title: title.trim(),
      description: description.trim(),
      tags: parseTags(tags),
      source: source.trim(),
      category,
    };
    const message = validatePin(value);
    if (message) {
      setError(message);
      return;
    }
    if (!file && !existing) {
      setError("이미지 파일을 선택해 주세요.");
      return;
    }
    setBusy(true);
    try {
      const dimensions = file
        ? await imageDimensions(file)
        : { width: existing!.width, height: existing!.height };
      const pin = {
        ...value,
        ...dimensions,
        id: existing?.id ?? crypto.randomUUID(),
        image: "",
        author: PROFILE.name,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        owned: true,
        blob: file ?? existing?.blob,
      };
      if (await act(() => putPin(pin))) {
        notify(existing ? "핀을 수정했어요." : "새로운 핀을 만들었어요.");
        navigate(`/pin/${pin.id}`);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <Loading />;
  if (id && !existing?.owned)
    return (
      <EmptyState title="수정할 수 없는 핀이에요">
        <Link className={styles.secondary} to="/profile">
          내 프로필 보기
        </Link>
      </EmptyState>
    );
  return (
    <>
      <Link to="/profile" className={styles.back}>
        <ArrowLeft size={18} /> 내 프로필
      </Link>
      <section className={styles.editorHeading}>
        <div className={styles.eyebrow}>SHARE YOUR PERSPECTIVE</div>
        <h1>
          {existing ? "영감을 다듬어 보세요" : "당신의 영감을 남겨 보세요"}
          <span>.</span>
        </h1>
        <p>한 장의 사진에서 시작되는 나만의 이야기.</p>
      </section>
      <form onSubmit={submit} className={styles.editor}>
        <div>
          <input
            ref={input}
            id="image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => select(e.target.files?.[0])}
          />
          <button
            type="button"
            className={styles.uploadZone}
            onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              select(e.dataTransfer.files[0]);
            }}
            aria-label="이미지 파일 선택"
          >
            {preview ? (
              <img src={preview} alt="선택한 이미지 미리보기" />
            ) : existing ? (
              <PinImage pin={existing} />
            ) : (
              <>
                <span className={styles.uploadIcon}>
                  <Upload size={27} />
                </span>
                <strong>
                  이미지를 끌어다 놓거나
                  <br />
                  클릭해서 업로드하세요
                </strong>
                <small>JPEG, PNG, WebP · 최대 10MB</small>
              </>
            )}
          </button>
          {(preview || existing) && (
            <button
              type="button"
              className={styles.textButton}
              onClick={() => input.current?.click()}
            >
              이미지 변경
            </button>
          )}
          <p className={styles.uploadNote}>
            직접 촬영했거나 사용할 권리가 있는 이미지를 올려 주세요.
            <br />
            이미지는 현재 브라우저에만 저장됩니다.
          </p>
        </div>
        <div className={styles.form}>
          <label>
            제목 <span>*</span>
            <input
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="이 장면에 어울리는 이름"
            />
          </label>
          <label>
            설명
            <textarea
              maxLength={1000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="어떤 영감을 주는 장면인가요?"
            />
          </label>
          <label>
            태그
            <input
              maxLength={300}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="여행, 자연, 일상"
            />
            <small>쉼표로 구분해 최대 10개를 입력하세요.</small>
          </label>
          <label>
            카테고리
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.filter((c) => c !== "전체").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            출처 링크
            <input
              type="url"
              maxLength={2000}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https:// (선택)"
            />
          </label>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <button className={styles.primary} disabled={busy}>
            {busy ? "저장 중…" : existing ? "변경 사항 저장" : "핀 만들기"}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </form>
    </>
  );
}
