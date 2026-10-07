import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Pin, Board, BoardPin } from "../domain/types";
interface PinboardDB extends DBSchema {
  pins: { key: string; value: Pin };
  boards: { key: string; value: Board };
  saved: { key: [string, string]; value: BoardPin };
  meta: { key: string; value: boolean };
}
let database: Promise<IDBPDatabase<PinboardDB>> | undefined;
export function getDatabase() {
  return (database ??= openDB<PinboardDB>("pinboard", 1, {
    upgrade(db) {
      db.createObjectStore("pins", { keyPath: "id" });
      db.createObjectStore("boards", { keyPath: "id" });
      db.createObjectStore("saved", { keyPath: ["boardId", "pinId"] });
      db.createObjectStore("meta");
    },
  }));
}
