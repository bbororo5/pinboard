import type { Pin } from "../domain/types";
const records = import.meta.glob<Pin>("./pins/*.json", {
  eager: true,
  import: "default",
});
export const seedPins = Object.entries(records)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, pin]) => pin);
