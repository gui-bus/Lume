"use client";

import { useState, useCallback, useRef } from "react";

export function useFormHistory<T>(initialState: T, limit: number = 50) {
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const currentStateRef = useRef<T>(initialState);

  const pushState = useCallback(
    (newState: T) => {
      const serializedNew = JSON.stringify(newState);
      const serializedCurrent = JSON.stringify(currentStateRef.current);

      if (serializedNew === serializedCurrent) return;

      setPast((prev) => {
        const updated = [...prev, currentStateRef.current];
        if (updated.length > limit) {
          updated.shift();
        }
        return updated;
      });
      setFuture([]);
      currentStateRef.current = newState;
    },
    [limit],
  );

  const undo = useCallback((): T | null => {
    if (past.length === 0) return null;

    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((prev) => [currentStateRef.current, ...prev]);
    setPast(newPast);
    currentStateRef.current = previousState;

    return previousState;
  }, [past]);

  const redo = useCallback((): T | null => {
    if (future.length === 0) return null;

    const nextState = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, currentStateRef.current]);
    setFuture(newFuture);
    currentStateRef.current = nextState;

    return nextState;
  }, [future]);

  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    pushState,
    undo,
    redo,
    resetHistory: (state: T) => {
      setPast([]);
      setFuture([]);
      currentStateRef.current = state;
    },
  };
}
