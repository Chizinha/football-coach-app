export { cn } from "cn";

let idCounter = 0;
export function generateUniqueId(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}
