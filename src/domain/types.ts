export interface Pin {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  image: string;
  width: number;
  height: number;
  author: string;
  source: string;
  license?: string;
  createdAt: string;
  owned: boolean;
  blob?: Blob;
}
export interface Board {
  id: string;
  name: string;
  createdAt: string;
}
export interface BoardPin {
  boardId: string;
  pinId: string;
  savedAt: string;
}
export interface Profile {
  id: string;
  name: string;
  handle: string;
  bio: string;
}
export interface Snapshot {
  pins: Pin[];
  boards: Board[];
  saved: BoardPin[];
}
export interface PinInput {
  title: string;
  description: string;
  tags: string[];
  source: string;
  category: string;
}
