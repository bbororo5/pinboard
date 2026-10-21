import { beforeEach, expect, it } from "vitest";
import { searchPins, relatedPins } from "../src/domain/search";
import {
  validateImage,
  validatePin,
  safeSource,
  parseTags,
} from "../src/domain/validation";
import { errorMessage } from "../src/lib/errors";
import { getDatabase } from "../src/storage/database";
import * as repo from "../src/storage/repository";
import type { Pin } from "../src/domain/types";
const pin: Pin = {
  id: "seed",
  title: "초록 숲의 Coffee",
  description: "조용한 아침",
  tags: ["자연", "빛"],
  category: "자연",
  image: "/images/01.jpg",
  width: 640,
  height: 800,
  author: "Artist",
  source: "https://example.com",
  createdAt: "2026-10-07",
  owned: false,
};
const other: Pin = {
  ...pin,
  id: "other",
  title: "바다",
  tags: ["빛"],
  category: "여행",
};
const input = {
  title: "제목",
  description: "설명",
  tags: [],
  source: "",
  category: "일상",
};
beforeEach(async () => {
  const db = await getDatabase();
  const tx = db.transaction(["pins", "boards", "saved", "meta"], "readwrite");
  for (const name of ["pins", "boards", "saved", "meta"] as const)
    await tx.objectStore(name).clear();
  await tx.done;
  await repo.initialize([pin, other]);
});
// case: search matches Korean titles
it("search matches Korean titles", async () => {
  expect(searchPins([pin, other], "초록")).toEqual([pin]);
});

// case: search matches descriptions
it("search matches descriptions", async () => {
  expect(searchPins([pin, other], "아침")).toHaveLength(2);
});

// case: search matches tags
it("search matches tags", async () => {
  expect(searchPins([pin, other], "자연")).toEqual([pin]);
});

// case: search ignores case and surrounding spaces
it("search ignores case and surrounding spaces", async () => {
  expect(searchPins([pin], "  COFFEE  ")).toEqual([pin]);
});

// case: search requires every word
it("search requires every word", async () => {
  expect(searchPins([pin], "초록 아침")).toHaveLength(1);
  expect(searchPins([pin], "초록 바다")).toHaveLength(0);
});

// case: search combines text and category
it("search combines text and category", async () => {
  expect(searchPins([pin, other], "빛", "여행")).toEqual([other]);
});

// case: empty query returns all pins
it("empty query returns all pins", async () => {
  expect(searchPins([pin, other], "  ")).toHaveLength(2);
});

// case: related pins exclude current and rank overlap
it("related pins exclude current and rank overlap", async () => {
  const both = { ...other, id: "both", tags: ["자연", "빛"] };
  expect(relatedPins([pin, other, both], pin).map((p) => p.id)).toEqual([
    "both",
    "other",
  ]);
});

// case: unrelated pins are excluded
it("unrelated pins are excluded", async () => {
  expect(relatedPins([pin, { ...other, tags: ["음악"] }], pin)).toEqual([]);
});

// case: accepted image formats remain valid at size limit
it("accepted image formats remain valid at size limit", async () => {
  for (const type of ["image/jpeg", "image/png", "image/webp"])
    expect(validateImage({ type, size: 10 * 1024 * 1024 })).toBeNull();
});

// case: unsupported empty and oversized images are rejected
it("unsupported empty and oversized images are rejected", async () => {
  expect(validateImage({ type: "image/svg+xml", size: 12 })).toBeTruthy();
  expect(validateImage({ type: "image/png", size: 0 })).toBeTruthy();
  expect(
    validateImage({ type: "image/png", size: 10 * 1024 * 1024 + 1 }),
  ).toBeTruthy();
});

// case: pin text limits and required title are enforced
it("pin text limits and required title are enforced", async () => {
  expect(validatePin({ ...input, title: "  " })).toBeTruthy();
  expect(validatePin({ ...input, title: "가".repeat(101) })).toBeTruthy();
  expect(
    validatePin({ ...input, description: "가".repeat(1001) }),
  ).toBeTruthy();
  expect(validatePin(input)).toBeNull();
});

// case: source URLs reject executable and invalid schemes
it("source URLs reject executable and invalid schemes", async () => {
  for (const source of [
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://example.com",
    "broken",
  ]) {
    expect(safeSource(source)).toBeNull();
    expect(validatePin({ ...input, source })).toBeTruthy();
  }
  expect(safeSource("https://example.com")).toBe("https://example.com/");
});

// case: tags trim deduplicate and cap at ten
it("tags trim deduplicate and cap at ten", async () => {
  expect(parseTags(" #자연, 빛, 자연,,")).toEqual(["자연", "빛"]);
  expect(
    parseTags(Array.from({ length: 12 }, (_, i) => String(i)).join(",")),
  ).toHaveLength(10);
});

// case: initialization is idempotent and preserves custom boards
it("initialization is idempotent and preserves custom boards", async () => {
  await repo.createBoard("개인 보드");
  await repo.initialize([pin, other]);
  const state = await repo.getSnapshot();
  expect(state.pins).toHaveLength(2);
  expect(state.boards).toHaveLength(2);
});

// case: new board names are trimmed
it("new board names are trimmed", async () => {
  const board = await repo.createBoard("  여행  ");
  expect(board.name).toBe("여행");
  expect((await repo.getSnapshot()).boards).toContainEqual(board);
});

// case: empty and oversized board names are rejected
it("empty and oversized board names are rejected", async () => {
  await expect(repo.createBoard("  ")).rejects.toThrow();
  await expect(repo.createBoard("가".repeat(61))).rejects.toThrow();
});

// case: renaming preserves board identity
it("renaming preserves board identity", async () => {
  const board = await repo.createBoard("이전");
  await repo.renameBoard(board.id, "  이후  ");
  expect(
    (await repo.getSnapshot()).boards.find((b) => b.id === board.id)?.name,
  ).toBe("이후");
});

// case: rename rejects missing boards and invalid names
it("rename rejects missing boards and invalid names", async () => {
  await expect(repo.renameBoard("missing", "이름")).rejects.toThrow();
  await expect(repo.renameBoard("board-inspiration", " ")).rejects.toThrow();
  await expect(
    repo.renameBoard("board-inspiration", "가".repeat(61)),
  ).rejects.toThrow();
});

// case: duplicate save creates one relationship
it("duplicate save creates one relationship", async () => {
  await repo.savePin("board-inspiration", "seed");
  await repo.savePin("board-inspiration", "seed");
  expect((await repo.getSnapshot()).saved).toHaveLength(1);
});

// case: pin can be saved independently to two boards
it("pin can be saved independently to two boards", async () => {
  const b = await repo.createBoard("둘째");
  await repo.savePin("board-inspiration", "seed");
  await repo.savePin(b.id, "seed");
  expect((await repo.getSnapshot()).saved).toHaveLength(2);
});

