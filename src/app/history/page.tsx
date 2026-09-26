"use client";

import { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type TrainingSession } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Trash2,
    Download,
    History as HistoryIcon,
    ArrowLeft,
    Search,
    Copy,
    Check,
    RotateCcw,
    X,
    Calendar,
    Sparkles,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
    const router = useRouter();
    const trainings = useLiveQuery(() => db.trainings.orderBy("createdAt").reverse().toArray());
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const filteredTrainings = useMemo(() => {
        if (!trainings) return [];
        if (!searchQuery.trim()) return trainings;
        const q = searchQuery.toLowerCase();
        return trainings.filter(
            (t) =>
                t.theme.toLowerCase().includes(q) ||
                t.step1_thought.toLowerCase().includes(q) ||
                t.step2_reason.toLowerCase().includes(q)
        );
    }, [trainings, searchQuery]);

    const handleDelete = async (id: number) => {
        await db.trainings.delete(id);
        setConfirmDeleteId(null);
    };

    const handleCopy = async (session: TrainingSession) => {
        const text = `【テーマ】\n${session.theme}\n\n【Step 1: 思考の深掘り】\n${session.step1_thought}\n\n【Step 2: 理由の深掘り】\n${session.step2_reason}\n\n#Gengoka #言語化トレーニング`;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(session.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            console.error("Failed to copy");
        }
    };

    const handleExport = () => {
        if (!trainings || trainings.length === 0) return;
        const dataStr = JSON.stringify(trainings, null, 2);
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const exportFileDefaultName = `gengoka-history-${new Date().toISOString().slice(0, 10)}.json`;
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="min-h-screen bg-background text-foreground ambient-bg flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto p-4 pt-24 pb-20 max-w-4xl space-y-6">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/")}
                            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                            aria-label="ホームへ戻る"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                                <HistoryIcon size={14} />
                                思考ログ
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                トレーニング履歴
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            disabled={!trainings || trainings.length === 0}
                            className="rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs h-10 gap-1.5 shadow-xs font-semibold"
                        >
                            <Download size={14} />
                            JSONエクスポート
                        </Button>
                    </div>
                </div>

                {/* Stats & Search */}
                {trainings && trainings.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 text-xs sm:text-sm">
                                <div>
                                    <span className="text-slate-500 font-medium">総トレーニング数: </span>
                                    <span className="font-bold text-slate-900 font-mono">{trainings.length}回</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200" />
                                <div>
                                    <span className="text-slate-500 font-medium">最終実施: </span>
                                    <span className="font-bold text-slate-900">
                                        {new Date(trainings[0].createdAt).toLocaleDateString("ja-JP", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="relative w-full sm:w-64">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="履歴を検索..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-8 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:border-indigo-600 placeholder:text-slate-400"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {trainings && trainings.length === 0 && (
                    <div className="text-center py-20 px-4 rounded-2xl bg-white border-dashed border-slate-300 space-y-4 shadow-xs">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                            <FileText size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">まだ履歴がありません</h3>
                            <p className="text-slate-600 text-sm max-w-sm mx-auto">
                                最初の2分間トレーニングを行って、思考を言葉にしてみましょう。
                            </p>
                        </div>
                        <Button
                            className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-md shadow-indigo-500/20"
                            onClick={() => router.push("/training")}
                        >
                            <Sparkles size={16} className="mr-2" />
                            トレーニングを始める
                        </Button>
                    </div>
                )}

                {/* No Search Results */}
                {trainings && trainings.length > 0 && filteredTrainings.length === 0 && (
                    <div className="text-center py-16 rounded-2xl bg-white border-dashed border-slate-300 text-slate-600 text-sm space-y-2 shadow-xs">
                        <p>「{searchQuery}」に一致する履歴はありませんでした。</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            検索条件をクリア
                        </Button>
                    </div>
                )}

                {/* History List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredTrainings.map((session, i) => {
                            const isConfirmingDelete = confirmDeleteId === session.id;
                            const isCopied = copiedId === session.id;

                            return (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                >
                                    <Card className="bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all overflow-hidden">
                                        {/* Card Top: Theme & Actions */}
                                        <div className="p-5 pb-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                                    <Calendar size={13} />
                                                    <span>
                                                        {new Date(session.createdAt).toLocaleDateString("ja-JP", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                                                    {session.theme}
                                                </h3>
                                            </div>

                                            {/* Action Toolbar */}
                                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                                {/* Re-train button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/training?theme=${encodeURIComponent(session.theme)}`)}
                                                    className="h-8 px-2.5 text-xs text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-lg gap-1 border border-slate-200 bg-white shadow-xs font-medium"
                                                    title="このお題で再度トレーニングする"
                                                >
                                                    <RotateCcw size={13} />
                                                    <span className="hidden sm:inline">再トレ</span>
                                                </Button>

                                                {/* Copy button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopy(session)}
                                                    className="h-8 px-2.5 text-xs text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-lg gap-1 border border-slate-200 bg-white shadow-xs font-medium"
                                                    title="クリップボードにコピー"
                                                >
                                                    {isCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                                    <span className="hidden sm:inline">{isCopied ? "コピー済" : "コピー"}</span>
                                                </Button>

                                                {/* Delete button */}
                                                {isConfirmingDelete ? (
                                                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-300">
                                                        <span className="text-[11px] text-rose-800 font-bold px-1">削除？</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(session.id)}
                                                            className="px-2 py-0.5 rounded text-[11px] bg-rose-600 text-white font-bold hover:bg-rose-700"
                                                        >
                                                            はい
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="px-1.5 py-0.5 rounded text-[11px] text-slate-500 hover:text-slate-800"
                                                        >
                                                            いいえ
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setConfirmDeleteId(session.id)}
                                                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                        aria-label="この履歴を削除"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Body: Step 1 & Step 2 */}
                                        <CardContent className="p-5 grid md:grid-cols-2 gap-4">
                                            {/* Thought */}
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                                                    <span className="w-4 h-4 rounded-full bg-indigo-100 inline-flex items-center justify-center text-[10px] text-indigo-700 font-bold">1</span>
                                                    <span>思考の深掘り</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {session.step1_thought.split("\n").map((line, idx, arr) => {
                                                        const isLast = idx === arr.length - 1;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={cn(
                                                                    "flex items-start gap-2 text-xs sm:text-sm leading-relaxed p-1.5 rounded-lg",
                                                                    isLast
                                                                        ? "bg-indigo-50 border border-indigo-200 font-bold text-indigo-950"
                                                                        : "text-slate-700"
                                                                )}
                                                            >
                                                                <span className="font-mono text-[11px] text-slate-400 mt-0.5 select-none shrink-0">1-{idx + 1}</span>
                                                                <span className="flex-1">{line}</span>
                                                                {isLast && (
                                                                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 border border-indigo-200 px-1.5 py-0.2 rounded-full shrink-0">
                                                                        ★結論
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Reason */}
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wider">
                                                    <span className="w-4 h-4 rounded-full bg-sky-100 inline-flex items-center justify-center text-[10px] text-sky-800 font-bold">2</span>
                                                    <span>理由の深掘り</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {session.step2_reason.split("\n").map((line, idx, arr) => {
                                                        const isLast = idx === arr.length - 1;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={cn(
                                                                    "flex items-start gap-2 text-xs sm:text-sm leading-relaxed p-1.5 rounded-lg",
                                                                    isLast
                                                                        ? "bg-sky-50 border border-sky-200 font-bold text-sky-950"
                                                                        : "text-slate-700"
                                                                )}
                                                            >
                                                                <span className="font-mono text-[11px] text-slate-400 mt-0.5 select-none shrink-0">2-{idx + 1}</span>
                                                                <span className="flex-1">{line}</span>
                                                                {isLast && (
                                                                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 border border-sky-200 px-1.5 py-0.2 rounded-full shrink-0">
                                                                        ★本質理由
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
