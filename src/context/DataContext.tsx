import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Snapshot, Pin } from "../domain/types";
import * as repository from "../storage/repository";
import { seedPins } from "../data/seeds";
import { errorMessage } from "../lib/errors";
type ContextValue = Snapshot & {
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  act: (action: () => Promise<unknown>) => Promise<boolean>;
  notice: string;
  notify: (text: string) => void;
};
const Context = createContext<ContextValue | null>(null);
export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Snapshot>({
    pins: [],
    boards: [],
    saved: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, notify] = useState("");
  async function refresh() {
    setData(await repository.getSnapshot());
  }
  async function load() {
    setError("");
    setLoading(true);
    try {
      await repository.initialize(seedPins as Pin[]);
      await refresh();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  async function act(action: () => Promise<unknown>) {
    try {
      await action();
      await refresh();
      return true;
    } catch (e) {
      notify(errorMessage(e));
      return false;
    }
  }
  return (
    <Context.Provider
      value={{ ...data, loading, error, refresh, act, notice, notify }}
    >
      {error ? (
        <main className="fatal">
          <h1>저장소를 열지 못했어요</h1>
          <p>{error}</p>
          <button onClick={() => void load()}>다시 시도</button>
        </main>
      ) : (
        children
      )}
      <div
        role="status"
        aria-live="polite"
        className={notice ? "toast" : "sr-only"}
      >
        {notice}
      </div>
    </Context.Provider>
  );
}
export function useData() {
  const value = useContext(Context);
  if (!value) throw new Error("DataProvider is required");
  return value;
}
