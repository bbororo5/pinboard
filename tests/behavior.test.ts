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

