"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, QUESTIONS } from "@/lib/themes";
import { useCompletedQuestions } from "@/hooks/useCompletedQuestions";
import { cn } from "@/lib/utils";
import { ArrowRight, ListChecks } from "lucide-react";

type CategoryFilter = "すべて" | (typeof CATEGORIES)[number];

export default function QuestionsPage() {
    const { completedIds, isCompleted, toggle } = useCompletedQuestions();
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("すべて");

    const totalCount = QUESTIONS.length;
    const completedCount = completedIds.size;
    const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const countsByCategory = useMemo(() => {
        const map = new Map<string, { total: number; completed: number }>();
        for (const category of CATEGORIES) {
            map.set(category, { total: 0, completed: 0 });
        }
        for (const q of QUESTIONS) {
            const entry = map.get(q.category);
            if (!entry) continue;
            entry.total += 1;
            if (completedIds.has(q.id)) entry.completed += 1;
        }
        return map;
    }, [completedIds]);

    const visibleCategories =
        activeCategory === "すべて" ? CATEGORIES : [activeCategory];

    // カテゴリ -> 中カテゴリ -> 質問リスト の順にグルーピング
    const groupedByCategory = useMemo(() => {
        const result = new Map<string, Map<string, typeof QUESTIONS>>();
        for (const q of QUESTIONS) {
            if (!result.has(q.category)) result.set(q.category, new Map());
            const subMap = result.get(q.category)!;
            if (!subMap.has(q.subCategory)) subMap.set(q.subCategory, []);
            subMap.get(q.subCategory)!.push(q);
        }
        return result;
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="container mx-auto max-w-4xl px-4 pt-24 pb-16 space-y-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                        <ListChecks size={16} />
                        質問一覧
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">お題チェックリスト</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        すべてのお題をカテゴリ別に一覧できます。取り組んだ質問にチェックを入れて進捗を記録しましょう。
                    </p>
                </div>

                {/* 全体進捗 */}
                <div className="rounded-xl border bg-card p-4 md:p-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">全体の進捗</span>
                        <span className="text-muted-foreground">
                            {completedCount} / {totalCount} 完了
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* カテゴリフィルタ */}
                <div className="flex flex-wrap gap-2">
                    {(["すべて", ...CATEGORIES] as CategoryFilter[]).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                                activeCategory === category
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-transparent text-muted-foreground border-border hover:bg-accent/50"
                            )}
                        >
                            {category}
                            {category !== "すべて" && (
                                <span className="ml-1.5 opacity-70">
                                    {countsByCategory.get(category)?.completed ?? 0}/
                                    {countsByCategory.get(category)?.total ?? 0}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* カテゴリごとの一覧 */}
                <div className="space-y-10">
                    {visibleCategories.map((category) => {
                        const subMap = groupedByCategory.get(category);
                        if (!subMap) return null;
                        const catCounts = countsByCategory.get(category);

                        return (
                            <section key={category} className="space-y-4">
                                <div className="flex items-baseline justify-between border-b pb-2">
                                    <h2 className="text-lg md:text-xl font-bold">{category}</h2>
                                    <span className="text-xs text-muted-foreground">
                                        {catCounts?.completed ?? 0} / {catCounts?.total ?? 0} 完了
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {Array.from(subMap.entries()).map(([subCategory, questions]) => {
                                        const subCompleted = questions.filter((q) =>
                                            isCompleted(q.id)
                                        ).length;

                                        return (
                                            <details
                                                key={subCategory}
                                                className="rounded-lg border bg-card/50 open:bg-card"
                                                open={activeCategory !== "すべて"}
                                            >
                                                <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between text-sm font-medium">
                                                    <span>{subCategory}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {subCompleted} / {questions.length}
                                                    </span>
                                                </summary>
                                                <ul className="divide-y border-t">
                                                    {questions.map((q) => {
                                                        const done = isCompleted(q.id);
                                                        return (
                                                            <li
                                                                key={q.id}
                                                                className="flex items-start gap-3 px-4 py-3"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={done}
                                                                    onChange={() => toggle(q.id)}
                                                                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-[var(--color-primary)] cursor-pointer"
                                                                    aria-label={`${q.text} を完了としてマーク`}
                                                                />
                                                                <span
                                                                    className={cn(
                                                                        "flex-1 text-sm leading-relaxed",
                                                                        done && "line-through text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {q.order}. {q.text}
                                                                </span>
                                                                <Link
                                                                    href={`/training?theme=${encodeURIComponent(q.text)}`}
                                                                    className="shrink-0 inline-flex items-center gap-1 text-xs text-primary/80 hover:text-primary transition-colors whitespace-nowrap"
                                                                >
                                                                    トレーニングする
                                                                    <ArrowRight size={12} />
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </details>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
