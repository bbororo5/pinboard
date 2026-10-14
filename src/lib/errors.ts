export function errorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "QuotaExceededError")
    return "브라우저 저장 공간이 부족해요. 필요 없는 핀을 삭제한 뒤 다시 시도해 주세요.";
  return error instanceof Error
    ? error.message
    : "저장하지 못했어요. 다시 시도해 주세요.";
}
