"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, QUESTIONS, type Question } from "@/lib/themes";
import { useCompletedQuestions } from "@/hooks/useCompletedQuestions";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    ListChecks,
    Search,
    Shuffle,
    X,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CategoryFilter = "すべて" | (typeof CATEGORIES)[number];

export default function QuestionsPage() {
    return (
        <Suspense fallback={null}>
            <QuestionsPageContent />
        </Suspense>
    );
}

function QuestionsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCategory = (searchParams.get("category") as CategoryFilter) || "すべて";

    const { completedIds, isCompleted, toggle } = useCompletedQuestions();
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>(() => {
        return (CATEGORIES as readonly string[]).includes(initialCategory) ? initialCategory : "すべて";
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [onlyUncompleted, setOnlyUncompleted] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const totalCount = QUESTIONS.length;
    const completedCount = completedIds.size;
    const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    // Filter questions by category, search query, and uncompleted status
    const filteredQuestions = useMemo(() => {
        return QUESTIONS.filter((q) => {
            // Category filter
            if (activeCategory !== "すべて" && q.category !== activeCategory) {
                return false;
            }
            // Completion filter
            if (onlyUncompleted && completedIds.has(q.id)) {
                return false;
            }
            // Search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchText = q.text.toLowerCase().includes(query);
                const matchSub = q.subCategory.toLowerCase().includes(query);
                const matchCat = q.category.toLowerCase().includes(query);
                if (!matchText && !matchSub && !matchCat) return false;
            }
            return true;
        });
    }, [activeCategory, onlyUncompleted, searchQuery, completedIds]);

    // Counts by category
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

    // Grouping by category -> subCategory
    const groupedData = useMemo(() => {
        const result = new Map<string, Map<string, Question[]>>();
        for (const q of filteredQuestions) {
            if (!result.has(q.category)) result.set(q.category, new Map());
            const subMap = result.get(q.category)!;
            if (!subMap.has(q.subCategory)) subMap.set(q.subCategory, []);
            subMap.get(q.subCategory)!.push(q);
        }
        return result;
    }, [filteredQuestions]);

    // Pick random question and navigate to training
    const handlePickRandom = () => {
        const pool = onlyUncompleted
            ? QUESTIONS.filter((q) => !completedIds.has(q.id))
            : QUESTIONS;
        if (pool.length === 0) return;
        const randomQ = pool[Math.floor(Math.random() * pool.length)];
        router.push(`/training?theme=${encodeURIComponent(randomQ.text)}`);
    };

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: prev[key] === undefined ? false : !prev[key],
        }));
    };

    const isSectionOpen = (key: string) => {
        if (openSections[key] !== undefined) return openSections[key];
        // Default: open if searching or filtered to single category, otherwise true
        return true;
    };

    const setAllSections = (open: boolean) => {
        const next: Record<string, boolean> = {};
        for (const [cat, subMap] of groupedData.entries()) {
            for (const sub of subMap.keys()) {
                next[`${cat}-${sub}`] = open;
            }
        }
        setOpenSections(next);
    };

    return (
        <div className="min-h-screen bg-background text-foreground ambient-bg flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto max-w-4xl px-4 pt-24 pb-20 space-y-6">
                {/* Page Title & Intro */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                            <ListChecks size={14} className="text-indigo-600" />
                            全500問 お題チェックリスト
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            お題ライブラリ
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base">
                            自己分析・仕事・未来など、厳選された問いで思考の解像度を高めましょう。
                        </p>
                    </div>

                    <Button
                        onClick={handlePickRandom}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 gap-2 shrink-0 h-11"
                    >
                        <Shuffle size={16} />
                        おまかせで1問挑戦
                    </Button>
                </div>

                {/* Progress Card */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">全体の進捗</div>
                                <div className="text-lg font-bold text-slate-900">
                                    {completedCount} <span className="text-xs text-slate-500 font-normal">/ {totalCount} 問完了</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums text-indigo-600">
                                {progressPercent}%
                            </span>
                        </div>
                    </div>

                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="キーワードでお題を検索 (例: 働き方、強み、1年後...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 py-5 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-600 text-sm shadow-xs placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Uncompleted toggle */}
                        <button
                            type="button"
                            onClick={() => setOnlyUncompleted((prev) => !prev)}
                            className={cn(
                                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all shrink-0 shadow-xs",
                                onlyUncompleted
                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Filter size={14} />
                            未完了のみ表示
                        </button>
                    </div>

                    {/* Category tabs */}
                    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                            {(["すべて", ...CATEGORIES] as CategoryFilter[]).map((category) => {
                                const catData = category !== "すべて" ? countsByCategory.get(category) : null;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={cn(
                                            "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap",
                                            activeCategory === category
                                                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs"
                                        )}
                                    >
                                        {category}
                                        {catData && (
                                            <span className="ml-1.5 opacity-75 font-mono text-[11px]">
                                                {catData.completed}/{catData.total}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs text-slate-500 font-medium">
                            <button
                                type="button"
                                onClick={() => setAllSections(true)}
                                className="hover:text-slate-900"
                            >
                                すべて開く
                            </button>
                            <span>/</span>
                            <button
                                type="button"
                                onClick={() => setAllSections(false)}
                                className="hover:text-slate-900"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredQuestions.length === 0 && (
                    <div className="text-center py-16 px-4 rounded-2xl bg-white border-dashed border-slate-300 space-y-3 shadow-xs">
                        <p className="text-slate-600 text-sm">
                            条件に一致するお題が見つかりませんでした。
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("すべて");
                                setOnlyUncompleted(false);
                            }}
                            className="rounded-lg border-slate-300 text-xs bg-white text-slate-700 hover:bg-slate-50"
                        >
                            フィルターをリセット
                        </Button>
                    </div>
                )}

                {/* Categorized Question Lists */}
                <div className="space-y-8">
                    {Array.from(groupedData.entries()).map(([category, subMap]) => {
                        const catCounts = countsByCategory.get(category);

                        return (
                            <section key={category} className="space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{category}</h2>
                                        {catCounts && (
                                            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono border border-slate-200">
                                                {catCounts.completed} / {catCounts.total} 完了
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {Array.from(subMap.entries()).map(([subCategory, questions]) => {
                                        const sectionKey = `${category}-${subCategory}`;
                                        const open = isSectionOpen(sectionKey);
                                        const subCompleted = questions.filter((q) => isCompleted(q.id)).length;

                                        return (
                                            <div
                                                key={subCategory}
                                                className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-colors"
                                            >
                                                {/* Header toggle */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSection(sectionKey)}
                                                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="font-bold text-sm text-slate-800">
                                                            {subCategory}
                                                        </span>
                                                        <span className="text-xs font-mono text-slate-500">
                                                            ({subCompleted}/{questions.length})
                                                        </span>
                                                    </div>

                                                    <div className="text-slate-400">
                                                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </div>
                                                </button>

                                                {/* Questions List */}
                                                {open && (
                                                    <ul className="divide-y divide-slate-100 border-t border-slate-200 bg-white">
                                                        {questions.map((q) => {
                                                            const done = isCompleted(q.id);
                                                            return (
                                                                <li
                                                                    key={q.id}
                                                                    className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50/80 transition-colors"
                                                                >
                                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={done}
                                                                            onChange={() => toggle(q.id)}
                                                                            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600 cursor-pointer"
                                                                            aria-label={`${q.text} を完了としてマーク`}
                                                                        />
                                                                        <span
                                                                            className={cn(
                                                                                "text-sm sm:text-base leading-relaxed transition-colors",
                                                                                done ? "line-through text-slate-400" : "text-slate-900 font-medium"
                                                                            )}
                                                                        >
                                                                            <span className="text-slate-400 mr-2 font-mono text-xs">#{q.order}</span>
                                                                            {q.text}
                                                                        </span>
                                                                    </div>

                                                                    <Link
                                                                        href={`/training?theme=${encodeURIComponent(q.text)}`}
                                                                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all whitespace-nowrap shadow-xs"
                                                                    >
                                                                        <span>トレ開始</span>
                                                                        <ArrowRight size={13} />
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </div>
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
