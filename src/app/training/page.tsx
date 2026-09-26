"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Timer } from "@/components/training/Timer";
import { DeepDiveInput } from "@/components/training/DeepDiveInput";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
    Loader2,
    Save,
    Shuffle,
    X,
    Copy,
    Check,
    RotateCcw,
    Clock,
    Sparkles,
    Lightbulb,
    ArrowRight,
    ArrowDown,
    Share2,
    History as HistoryIcon
} from "lucide-react";
import { CATEGORIES, FEATURED_THEMES, PREDEFINED_THEMES, QUESTIONS } from "@/lib/themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Phase = "setup" | "step1" | "step2" | "review";
type SaveNotice = { type: "success" | "error"; message: string } | null;

const DURATION_OPTIONS = [
    { label: "1分 (クイック)", seconds: 60 },
    { label: "2分 (標準・推奨)", seconds: 120 },
    { label: "3分 (じっくり)", seconds: 180 },
];

const STEP1_PROMPTS = [
    "具体的にはどんな場面？",
    "自分は何を一番大切にしたい？",
    "逆に嫌だと感じることは何？",
    "誰にとって良い状態？",
];

const STEP2_PROMPTS = [
    "過去のどんな経験が影響している？",
    "それが叶わないとどんな困り事がある？",
    "なぜ他の方法では駄目なのか？",
    "一番の根本的な動機は？",
];

export default function TrainingPage() {
    return (
        <Suspense fallback={null}>
            <TrainingPageContent />
        </Suspense>
    );
}

function TrainingPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [phase, setPhase] = useState<Phase>("setup");
    const [theme, setTheme] = useState(() => searchParams.get("theme") ?? "");
    const [step1Input, setStep1Input] = useState("");
    const [step2Input, setStep2Input] = useState("");
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveNotice, setSaveNotice] = useState<SaveNotice>(null);
    const [copied, setCopied] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [showStep1Details, setShowStep1Details] = useState(false);

    // Selected Duration
    const [maxDuration, setMaxDuration] = useState(120);
    const [remainingTime, setRemainingTime] = useState(120);

    // Setup Category Tab
    const [selectedCategory, setSelectedCategory] = useState<string>("注目");

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && !isTimerPaused && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        setIsTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, isTimerPaused, remainingTime]);

    // Handle Start
    const handleStart = () => {
        if (!theme.trim()) return;
        setSaveNotice(null);
        setRemainingTime(maxDuration);
        setIsTimerPaused(false);
        setPhase("step1");
        setIsTimerActive(true);
    };

    const handleStep1Complete = () => {
        if (!step1Input.trim()) return;
        setPhase("step2");
        // Timer continues running seamlessly
    };

    const handleStep2Complete = () => {
        if (!step2Input.trim()) return;
        setIsTimerActive(false);
        setIsTimerPaused(false);
        setPhase("review");
    };

    const handleAddTime = (seconds: number) => {
        setRemainingTime((prev) => prev + seconds);
    };

    const handleTogglePause = () => {
        setIsTimerPaused((prev) => !prev);
    };

    const handleShuffleTheme = () => {
        setIsShuffling(true);
        const random = PREDEFINED_THEMES[Math.floor(Math.random() * PREDEFINED_THEMES.length)];
        setTheme(random);
        setTimeout(() => setIsShuffling(false), 300);
    };

    // Save to IndexedDB
    const handleSave = async () => {
        if (!theme.trim() || !step1Input.trim() || !step2Input.trim() || isSaving) return;

        setIsSaving(true);
        setSaveNotice(null);
        try {
            await db.trainings.add({
                theme: theme.trim(),
                step1_thought: step1Input.trim(),
                step2_reason: step2Input.trim(),
                createdAt: new Date(),
            });
            setSaveNotice({ type: "success", message: "思考を保存しました！履歴からいつでも振り返れます。" });
        } catch (e) {
            console.error("Failed to save", e);
            setSaveNotice({ type: "error", message: "保存に失敗しました。もう一度お試しください。" });
        } finally {
            setIsSaving(false);
        }
    };

    // Copy to clipboard
    const handleCopyFormatted = async () => {
        const text = `【テーマ】\n${theme}\n\n【Step 1: 思考の深掘り】\n${step1Input}\n\n【Step 2: 理由の深掘り】\n${step2Input}\n\n#Gengoka #言語化トレーニング`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("Clipboard copy failed");
        }
    };

    // Share to X
    const handleShareX = () => {
        const step1Lines = step1Input.trim().split("\n");
        const step2Lines = step2Input.trim().split("\n");
        const finalThought = step1Lines[step1Lines.length - 1] || "";
        const finalReason = step2Lines[step2Lines.length - 1] || "";

        const text = `【${theme}】について言語化トレーニングしました！\n\n💭 結論: ${finalThought}\n💡 理由: ${finalReason}\n\n#Gengoka #言語化トレーニング`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // Category suggestions
    const categoryThemes = useMemo(() => {
        if (selectedCategory === "注目") return FEATURED_THEMES;
        return QUESTIONS.filter((q) => q.category === selectedCategory).slice(0, 8).map((q) => q.text);
    }, [selectedCategory]);

    // Extract conclusion line from step 1
    const step1Lines = useMemo(() => {
        return step1Input.split("\n").filter((l) => l.trim().length > 0);
    }, [step1Input]);

    const step1FinalLine = step1Lines.length > 0 ? step1Lines[step1Lines.length - 1] : "";

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col ambient-bg">
            <Header />

            {/* Stepper Header (visible during training) */}
            {phase !== "setup" && (
                <div className="sticky top-16 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
                    <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                                phase === "step1"
                                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                                    : "bg-slate-100 text-slate-600"
                            )}>
                                <span className={cn(
                                    "w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]",
                                    phase === "step1" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                                )}>1</span>
                                <span>思考の深掘り</span>
                            </div>

                            <ChevronRight size={14} className="text-slate-400 shrink-0" />

                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                                phase === "step2"
                                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                                    : "bg-slate-100 text-slate-600"
                            )}>
                                <span className={cn(
                                    "w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]",
                                    phase === "step2" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                                )}>2</span>
                                <span>理由の深掘り</span>
                            </div>

                            <ChevronRight size={14} className="text-slate-400 shrink-0" />

                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                                phase === "review"
                                    ? "bg-emerald-600 text-white shadow-xs font-bold"
                                    : "bg-slate-100 text-slate-600"
                            )}>
                                <CheckCircle2 size={13} />
                                <span>言語化完了</span>
                            </div>
                        </div>

                        {/* Top compact timer for mobile or reference */}
                        {phase !== "review" && (
                            <div className="flex items-center gap-2 shrink-0">
                                <Timer
                                    currentSeconds={remainingTime}
                                    maxSeconds={maxDuration}
                                    size="sm"
                                    isPaused={isTimerPaused}
                                />
                                <span className={cn(
                                    "font-mono text-sm font-bold tabular-nums",
                                    remainingTime <= 15 ? "text-amber-600" : "text-slate-900"
                                )}>
                                    {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, "0")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center max-w-4xl py-12 sm:py-16">
                <AnimatePresence mode="wait">

                    {/* ==================== SETUP PHASE ==================== */}
                    {phase === "setup" && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-2xl space-y-8"
                        >
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                                    <Sparkles size={14} className="text-indigo-600" />
                                    2ステップ言語化トレーニング
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                                    何を言語化しますか？
                                </h1>
                                <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
                                    頭の中にあるモヤモヤや、本質を掴みたいテーマを入力してください。
                                </p>
                            </div>

                            <Card className="bg-white border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                                {/* Theme input */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="training-theme" className="text-sm font-bold text-slate-800">
                                            テーマ・お題
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleShuffleTheme}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                                        >
                                            <Shuffle size={13} className={cn("transition-transform", isShuffling && "rotate-180")} />
                                            ランダムに選ぶ
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="training-theme"
                                            placeholder="例：なぜ自分はこの仕事にやりがいを感じるのか？"
                                            className="text-base sm:text-lg py-6 px-4 bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 text-slate-900 pr-10 rounded-xl placeholder:text-slate-400"
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleStart()}
                                            autoFocus
                                        />
                                        {theme && (
                                            <button
                                                type="button"
                                                onClick={() => setTheme("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                                                aria-label="テーマをクリア"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Duration Selector */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <Clock size={13} />
                                        制限時間を選択
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {DURATION_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.seconds}
                                                type="button"
                                                onClick={() => {
                                                    setMaxDuration(opt.seconds);
                                                    setRemainingTime(opt.seconds);
                                                }}
                                                className={cn(
                                                    "py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center",
                                                    maxDuration === opt.seconds
                                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Theme Picker */}
                                <div className="space-y-3 pt-2 border-t border-slate-200">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-600">お題リストから選ぶ</span>
                                        <Link href="/questions" className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold">
                                            全お題を見る <ArrowRight size={12} />
                                        </Link>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                                        {["注目", ...CATEGORIES].map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                                                    selectedCategory === cat
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Theme Pills */}
                                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1 pr-1">
                                        {categoryThemes.map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setTheme(t)}
                                                className={cn(
                                                    "rounded-lg border px-3 py-1.5 text-xs text-left transition-all",
                                                    theme === t
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Start CTA */}
                                <Button
                                    onClick={handleStart}
                                    className="w-full h-13 text-base sm:text-lg font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.005]"
                                    disabled={!theme.trim()}
                                >
                                    トレーニング開始 ({Math.floor(maxDuration / 60)}分間集中)
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* ==================== STEP 1: THINKING ==================== */}
                    {phase === "step1" && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.25 }}
                            className="w-full grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6"
                        >
                            <div className="space-y-4 flex flex-col h-full">
                                {/* Header Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                                            <span>Step 1 / 2</span>
                                            <span className="text-slate-300">•</span>
                                            <span>思考の吐き出し</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                        どう思う？ どう感じる？
                                    </h2>

                                    {/* Active Theme Card */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <Sparkles size={14} />
                                            お題 (THEME)
                                        </div>
                                        <p className="font-extrabold text-slate-900 text-lg sm:text-xl leading-relaxed">{theme}</p>
                                    </div>
                                </div>

                                {/* Input Card */}
                                <Card className="border border-slate-200 bg-white shadow-sm flex-1 flex flex-col p-4 sm:p-6 space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black">POINT</span>
                                        <span>直感的に思い浮かんだことを書き、矢印でさらに深掘りしましょう</span>
                                    </div>

                                    <div className="flex-1">
                                        <DeepDiveInput
                                            value={step1Input}
                                            onChange={setStep1Input}
                                            placeholder="例：チームメンバーの意見を丁寧に聞く"
                                            autoFocus
                                            stepPrefix="1"
                                            questionPrompt="それってどういうこと？"
                                        />
                                    </div>
                                </Card>

                                {/* Time Expired Notice if 0 */}
                                {remainingTime === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-sm"
                                    >
                                        <span>⏱️ 時間になりました！思考がまとまったら次へ進みましょう。</span>
                                        <Button size="sm" onClick={handleStep1Complete} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs h-7">
                                            Step 2 へ進む
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Bottom Action */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-xs font-medium text-slate-500">
                                        {!step1Input.trim() ? "1行以上入力すると次へ進めます" : `${step1Lines.length}行の思考を記録中`}
                                    </div>
                                    <Button
                                        onClick={handleStep1Complete}
                                        size="lg"
                                        className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 shadow-md shadow-indigo-500/20 text-base"
                                        disabled={!step1Input.trim()}
                                    >
                                        Step 2（理由）へ進む <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </div>

                            {/* Sidebar: Timer & Prompts */}
                            <div className="hidden md:flex flex-col gap-4">
                                <Card className="border border-slate-200 bg-white shadow-sm p-5 flex flex-col items-center justify-center">
                                    <Timer
                                        currentSeconds={remainingTime}
                                        maxSeconds={maxDuration}
                                        label="TOTAL TIME"
                                        isPaused={isTimerPaused}
                                        onTogglePause={handleTogglePause}
                                        onAddTime={handleAddTime}
                                        showControls
                                    />
                                </Card>

                                {/* Prompt suggestions */}
                                <Card className="border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                                        <Lightbulb size={15} />
                                        深掘りの問いかけヒント
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        詰まったらこの視点で自問自答してみましょう：
                                    </p>
                                    <div className="space-y-1.5">
                                        {STEP1_PROMPTS.map((prompt, i) => (
                                            <div
                                                key={i}
                                                className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium"
                                            >
                                                {prompt}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* ==================== STEP 2: REASONING ==================== */}
                    {phase === "step2" && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.25 }}
                            className="w-full grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6"
                        >
                            <div className="space-y-4 flex flex-col h-full">
                                {/* Header Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                                            <span>Step 2 / 2</span>
                                            <span className="text-slate-300">•</span>
                                            <span>理由の深掘り</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                        なぜそう思う？
                                    </h2>

                                    {/* 1. 元の問題・お題（THEME）を常に明示 */}
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <Sparkles size={13} />
                                            お題 (THEME)
                                        </div>
                                        <p className="font-semibold text-slate-800 text-base sm:text-lg leading-relaxed">
                                            {theme}
                                        </p>
                                    </div>

                                    {/* 2. Step 1 で到達した「最も解像度が高い言葉（最終行）」を際立たせるカード */}
                                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-white border-2 border-indigo-200 shadow-sm space-y-3.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
                                                <Sparkles size={16} className="text-indigo-600 shrink-0" />
                                                <span>Step 1 で到達した最も解像度が高い言葉</span>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                                                深掘り対象
                                            </span>
                                        </div>

                                        {/* 最後の行の強調表示 */}
                                        <div className="p-4 sm:p-4.5 rounded-xl bg-white border border-indigo-200/90 text-lg sm:text-2xl font-black text-slate-900 leading-relaxed tracking-wide shadow-xs">
                                            “{step1FinalLine || theme}”
                                        </div>

                                        {/* 理由へのガイド */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pt-1">
                                            <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                                                <ArrowDown size={15} className="text-indigo-600 shrink-0" />
                                                この言葉に対して「なぜそう思うのか？（理由）」を深掘りします
                                            </span>
                                            {step1Lines.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowStep1Details((prev) => !prev)}
                                                    className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors self-start sm:self-auto font-medium"
                                                >
                                                    {showStep1Details ? "思考の流れを閉じる" : `思考の流れを見る (全${step1Lines.length}行)`}
                                                </button>
                                            )}
                                        </div>

                                        {/* Step 1 の全思考プロセス（トグル表示） */}
                                        {showStep1Details && (
                                            <div className="mt-2 p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
                                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Step 1 思考の変遷:
                                                </div>
                                                <div className="space-y-1.5">
                                                    {step1Lines.map((line, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "flex items-start gap-2.5 p-2 rounded-lg",
                                                                idx === step1Lines.length - 1
                                                                    ? "bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold"
                                                                    : "text-slate-600"
                                                            )}
                                                        >
                                                            <span className="font-mono text-xs opacity-75 mt-0.5">1-{idx + 1}</span>
                                                            <span className="flex-1 text-sm">{line}</span>
                                                            {idx === step1Lines.length - 1 && (
                                                                <span className="text-xs text-indigo-700 font-bold shrink-0">★結論</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Input Card */}
                                <Card className="border border-slate-200 bg-white shadow-sm flex-1 flex flex-col p-4 sm:p-6 space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                                        <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px] font-black">POINT</span>
                                        <span>「〜だから」「なぜなら」と、根底にある動機や理由を掘り下げます</span>
                                    </div>

                                    <div className="flex-1">
                                        <DeepDiveInput
                                            value={step2Input}
                                            onChange={setStep2Input}
                                            placeholder="例：リーダー一人の視点や経験には限界があるから"
                                            autoFocus
                                            stepPrefix="2"
                                            questionPrompt="なぜそう思う？"
                                        />
                                    </div>
                                </Card>

                                {/* Time Expired Notice if 0 */}
                                {remainingTime === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-sm"
                                    >
                                        <span>⏱️ 時間になりました！思考がまとまったら完了しましょう。</span>
                                        <Button size="sm" onClick={handleStep2Complete} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs h-7">
                                            完了する
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Bottom Action */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-xs text-slate-500 font-medium">
                                        {!step2Input.trim() ? "1行以上入力すると完了できます" : "思考と言語化が完成に近づいています"}
                                    </div>
                                    <Button
                                        onClick={handleStep2Complete}
                                        size="lg"
                                        className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 shadow-md shadow-indigo-500/20 text-base"
                                        disabled={!step2Input.trim()}
                                    >
                                        言語化完了へ <CheckCircle2 size={18} />
                                    </Button>
                                </div>
                            </div>

                            {/* Sidebar: Timer & Step 2 Prompts */}
                            <div className="hidden md:flex flex-col gap-4">
                                <Card className="border border-slate-200 bg-white shadow-sm p-5 flex flex-col items-center justify-center">
                                    <Timer
                                        currentSeconds={remainingTime}
                                        maxSeconds={maxDuration}
                                        label="TOTAL TIME"
                                        isPaused={isTimerPaused}
                                        onTogglePause={handleTogglePause}
                                        onAddTime={handleAddTime}
                                        showControls
                                    />
                                </Card>

                                <Card className="border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                                        <Lightbulb size={15} />
                                        理由を深掘りするヒント
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        本質に迫るための問いかけ：
                                    </p>
                                    <div className="space-y-1.5">
                                        {STEP2_PROMPTS.map((prompt, i) => (
                                            <div
                                                key={i}
                                                className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium"
                                            >
                                                {prompt}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* ==================== REVIEW PHASE ==================== */}
                    {phase === "review" && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-3xl space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                                    <CheckCircle2 size={14} />
                                    トレーニング完了
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                                    思考が言葉になりました！
                                </h1>
                                <p className="text-slate-600 text-sm sm:text-base">
                                    深掘りした思考と理由の軌跡を振り返ってみましょう。
                                </p>
                            </div>

                            {/* Main Output Card */}
                            <Card className="bg-white border-slate-200 overflow-hidden shadow-lg">
                                <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/70">
                                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                                        THEME
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{theme}</h2>
                                </div>

                                <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-6">
                                    {/* Step 1 Output */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="w-5 h-5 rounded-full bg-indigo-100 inline-flex items-center justify-center text-xs text-indigo-700 font-bold">1</span>
                                                思考の深掘り (どう思う？)
                                            </span>
                                        </div>
                                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm sm:text-base leading-relaxed space-y-2.5 min-h-[150px]">
                                            {step1Input.split("\n").map((line, idx) => (
                                                <div key={idx} className={cn(
                                                    "flex items-start gap-2.5",
                                                    idx === step1Input.split("\n").length - 1
                                                        ? "font-bold text-indigo-950 bg-indigo-100/70 p-2.5 rounded-xl border border-indigo-200"
                                                        : "text-slate-700"
                                                )}>
                                                    <span className="text-xs font-mono opacity-70 mt-0.5 select-none">1-{idx + 1}</span>
                                                    <span className="flex-1">{line}</span>
                                                    {idx === step1Input.split("\n").length - 1 && (
                                                        <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0 border border-indigo-200">
                                                            ★結論
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 2 Output */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="w-5 h-5 rounded-full bg-sky-100 inline-flex items-center justify-center text-xs text-sky-800 font-bold">2</span>
                                                理由の深掘り (なぜ？)
                                            </span>
                                        </div>
                                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm sm:text-base leading-relaxed space-y-2.5 min-h-[150px]">
                                            {step2Input.split("\n").map((line, idx) => (
                                                <div key={idx} className={cn(
                                                    "flex items-start gap-2.5",
                                                    idx === step2Input.split("\n").length - 1
                                                        ? "font-bold text-sky-950 bg-sky-100/70 p-2.5 rounded-xl border border-sky-200"
                                                        : "text-slate-700"
                                                )}>
                                                    <span className="text-xs font-mono opacity-70 mt-0.5 select-none">2-{idx + 1}</span>
                                                    <span className="flex-1">{line}</span>
                                                    {idx === step2Input.split("\n").length - 1 && (
                                                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full shrink-0 border border-sky-200">
                                                            ★本質理由
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tools Toolbar */}
                                <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <div className="text-slate-500 font-medium">
                                        合計文字数: {step1Input.length + step2Input.length}文字
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopyFormatted}
                                            className="text-xs h-8 gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                            {copied ? "コピー完了！" : "結果をコピー"}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleShareX}
                                            className="text-xs h-8 gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                                        >
                                            <Share2 size={14} />
                                            Xで共有
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Self-Reflection checklist */}
                            <Card className="bg-white border-slate-200 p-5 space-y-3 shadow-xs">
                                <h3 className="font-bold text-sm flex items-center gap-2 text-indigo-700">
                                    <HelpCircle size={16} />
                                    解像度チェック
                                </h3>
                                <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600">
                                    <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                                        <span>「なんとなく」を具体的な状態や行動に落とし込めたか</span>
                                    </div>
                                    <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                                        <span>本質的な「動機や根拠」に辿り着けたか</span>
                                    </div>
                                    <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                                        <span>相手に伝える際にも説得力がある言葉になっているか</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        setTheme("");
                                        setStep1Input("");
                                        setStep2Input("");
                                        setPhase("setup");
                                    }}
                                    className="w-full sm:w-auto rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
                                >
                                    <RotateCcw size={16} className="mr-2" />
                                    もう一度トレーニングする
                                </Button>

                                <Button
                                    onClick={handleSave}
                                    size="lg"
                                    className="w-full sm:w-48 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {isSaving ? "保存中…" : "履歴に保存する"}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => router.push("/history")}
                                    className="w-full sm:w-auto text-slate-600 hover:text-slate-900 rounded-xl"
                                >
                                    <HistoryIcon size={16} className="mr-2" />
                                    履歴を見る
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toast Notification */}
                <AnimatePresence>
                    {saveNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            role="status"
                            className={cn(
                                "fixed bottom-6 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl bg-white",
                                saveNotice.type === "success"
                                    ? "border-emerald-300 text-slate-900"
                                    : "border-rose-300 text-slate-900"
                            )}
                        >
                            {saveNotice.type === "success" ? (
                                <CheckCircle2 className="shrink-0 text-emerald-600" size={18} />
                            ) : (
                                <AlertCircle className="shrink-0 text-rose-600" size={18} />
                            )}
                            <span className="flex-1 text-xs sm:text-sm font-semibold">{saveNotice.message}</span>
                            <button
                                type="button"
                                onClick={() => setSaveNotice(null)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
