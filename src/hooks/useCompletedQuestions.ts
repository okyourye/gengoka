"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "gengoka:completedQuestionIds";

// タブ内での更新をコンポーネント間に伝えるための簡易Pub/Sub
const listeners = new Set<() => void>();

function readRaw(): string {
    if (typeof window === "undefined") return "[]";
    try {
        return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
    } catch {
        return "[]";
    }
}

function getServerSnapshot(): string {
    return "[]";
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function writeIds(ids: Set<string>) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch {
        // localStorageが使えない環境では何もしない
    }
    listeners.forEach((listener) => listener());
}

export function useCompletedQuestions() {
    const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);

    const completedIds = useMemo(() => {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? new Set<string>(parsed) : new Set<string>();
        } catch {
            return new Set<string>();
        }
    }, [raw]);

    const toggle = useCallback(
        (id: string) => {
            const next = new Set(completedIds);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            writeIds(next);
        },
        [completedIds]
    );

    const isCompleted = useCallback((id: string) => completedIds.has(id), [completedIds]);

    return { completedIds, isCompleted, toggle };
}
