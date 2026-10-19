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
