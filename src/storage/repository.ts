import { getDatabase } from "./database";
import type { Pin, Snapshot } from "../domain/types";
export async function initialize(pins: Pin[]) {
  const db = await getDatabase();
  const tx = db.transaction(["pins", "boards", "meta"], "readwrite");
  if (!(await tx.objectStore("meta").get("initialized"))) {
    for (const pin of pins) await tx.objectStore("pins").put(pin);
    await tx
      .objectStore("boards")
      .put({
        id: "board-inspiration",
        name: "나의 영감 모음",
        createdAt: new Date().toISOString(),
      });
    await tx.objectStore("meta").put(true, "initialized");
  }
  await tx.done;
}
export async function getSnapshot(): Promise<Snapshot> {
  const db = await getDatabase();
  const tx = db.transaction(["pins", "boards", "saved"]);
  const [pins, boards, saved] = await Promise.all([
    tx.objectStore("pins").getAll(),
    tx.objectStore("boards").getAll(),
    tx.objectStore("saved").getAll(),
  ]);
  await tx.done;
  return { pins, boards, saved };
}
export async function createBoard(name: string) {
  if (!name.trim() || name.trim().length > 60)
    throw new Error("보드 이름은 1~60자로 입력해 주세요.");
  const board = {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  const db = await getDatabase();
  await db.put("boards", board);
  return board;
}
export async function renameBoard(id: string, name: string) {
  if (!name.trim() || name.trim().length > 60)
    throw new Error("보드 이름은 1~60자로 입력해 주세요.");
  const db = await getDatabase();
  const board = await db.get("boards", id);
  if (!board) throw new Error("보드를 찾을 수 없어요.");
  await db.put("boards", { ...board, name: name.trim() });
}
export async function deleteBoard(id: string) {
  const db = await getDatabase();
  const tx = db.transaction(["boards", "saved"], "readwrite");
  await tx.objectStore("boards").delete(id);
  for (const key of await tx.objectStore("saved").getAllKeys())
    if (key[0] === id) await tx.objectStore("saved").delete(key);
  await tx.done;
}
export async function savePin(boardId: string, pinId: string) {
  const db = await getDatabase();
  const tx = db.transaction(["pins", "boards", "saved"], "readwrite");
  if (
    !(await tx.objectStore("pins").get(pinId)) ||
    !(await tx.objectStore("boards").get(boardId))
  ) {
    await tx.done;
    throw new Error("핀 또는 보드를 찾을 수 없어요.");
  }
  if (!(await tx.objectStore("saved").get([boardId, pinId])))
    await tx
      .objectStore("saved")
      .put({ boardId, pinId, savedAt: new Date().toISOString() });
  await tx.done;
}
export async function unsavePin(boardId: string, pinId: string) {
  const db = await getDatabase();
  await db.delete("saved", [boardId, pinId]);
}
export async function putPin(pin: Pin) {
  const db = await getDatabase();
  await db.put("pins", pin);
}
export async function deletePin(id: string) {
  const db = await getDatabase();
  const tx = db.transaction(["pins", "saved"], "readwrite");
  const pin = await tx.objectStore("pins").get(id);
  if (!pin?.owned) {
    await tx.done;
    throw new Error("직접 만든 핀만 삭제할 수 있어요.");
  }
  await tx.objectStore("pins").delete(id);
  for (const key of await tx.objectStore("saved").getAllKeys())
    if (key[1] === id) await tx.objectStore("saved").delete(key);
  await tx.done;
}
