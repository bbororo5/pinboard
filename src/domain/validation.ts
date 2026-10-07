import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "./constants";
import type { PinInput } from "./types";
export function validateImage(
  file: Pick<File, "size" | "type">,
): string | null {
  if (!IMAGE_TYPES.includes(file.type))
    return "JPEG, PNG, WebP 이미지를 선택해 주세요.";
  if (!file.size) return "비어 있는 파일은 사용할 수 없어요.";
  if (file.size > MAX_IMAGE_BYTES) return "이미지는 10MB 이하로 올려 주세요.";
  return null;
}
export function validatePin(input: PinInput): string | null {
  if (!input.title.trim()) return "핀 제목을 입력해 주세요.";
  if (input.title.trim().length > 100)
    return "제목은 100자 이내로 입력해 주세요.";
  if (input.description.length > 1000)
    return "설명은 1,000자 이내로 입력해 주세요.";
  if (input.source && !safeSource(input.source))
    return "출처는 http 또는 https 주소를 입력해 주세요.";
  return null;
}
export function safeSource(url: string): string | null {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}
export function parseTags(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[,#]/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ].slice(0, 10);
}
