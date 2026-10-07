import type { Pin } from "./types";
export function searchPins(pins: Pin[], query = "", category = "전체"): Pin[] {
  const terms = query
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return pins.filter(
    (pin) =>
      (category === "전체" || pin.category === category) &&
      terms.every((term) =>
        [pin.title, pin.description, ...pin.tags]
          .join(" ")
          .normalize("NFKC")
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}
export function relatedPins(pins: Pin[], current: Pin): Pin[] {
  return pins
    .filter(
      (p) =>
        p.id !== current.id && p.tags.some((tag) => current.tags.includes(tag)),
    )
    .map((p) => ({
      pin: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.pin);
}
