import { useCallback, useEffect, useState } from "react";
import { seedState, type TempState } from "./temp-data";

const KEY = "temp.tracker.v1";

export function useTempStore() {
  const [state, setState] = useState<TempState>(() => seedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...seedState(), ...(JSON.parse(raw) as Partial<TempState>) });
    } catch {
      /* повреждённые данные — остаёмся на демо-наборе */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* квота заполнена — молча игнорируем */
    }
  }, [state, ready]);

  const update = useCallback(
    (patch: (s: TempState) => Partial<TempState>) => setState((s) => ({ ...s, ...patch(s) })),
    [],
  );

  const reset = useCallback(() => setState(seedState()), []);

  return { state, setState, update, reset, ready };
}