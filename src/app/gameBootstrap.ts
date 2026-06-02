import { loadGameSnapshot } from "../modules/save/saveService";

/**
 * App bootstrap is intentionally tiny so the persistence layer can be replaced
 * later without touching the UI.
 */
export function bootstrapGame() {
  return loadGameSnapshot();
}
