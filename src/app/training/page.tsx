
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "@/components/training/Timer";
import { DeepDiveInput } from "@/components/training/DeepDiveInput";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { AlertCircle, CheckCircle2, ChevronRight, HelpCircle, Loader2, Save, Shuffle, X } from "lucide-react";
import { FEATURED_THEMES, PREDEFINED_THEMES } from "@/lib/themes";

type Phase = "setup" | "step1" | "step2" | "review";
type SaveNotice = { type: "success" | "error"; message: string } | null;

export default function TrainingPage() {
    return (
        <Suspense fallback={null}>
            <TrainingPageContent />
        </Suspense>
    );
}

function TrainingPageContent() {
    const searchParams = useSearchParams();
    const [phase, setPhase] = useState<Phase>("setup");
    const [theme, setTheme] = useState(() => searchParams.get("theme") ?? "");
    const [step1Input, setStep1Input] = useState("");
    const [step2Input, setStep2Input] = useState("");
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveNotice, setSaveNotice] = useState<SaveNotice>(null);

    // Global Timer State
    const MAX_TIME = 120; // 2 minutes total
    const [remainingTime, setRemainingTime] = useState(MAX_TIME);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && remainingTime > 0) {
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
    }, [isTimerActive, remainingTime]);

    const handleStart = () => {
        if (!theme.trim()) return;
        setSaveNotice(null);
        setRemainingTime(MAX_TIME); // Reset timer
        setPhase("step1");
        setIsTimerActive(true);
    };

    const handleStep1Complete = () => {
        if (!step1Input.trim()) return;
        setPhase("step2");
        // Timer continues running
    };

    const handleStep2Complete = () => {
        if (!step2Input.trim()) return;
        setIsTimerActive(false);
        setPhase("review");
    };

    const handleSave = async () => {
        if (!theme.trim() || !step1Input.trim() || !step2Input.trim() || isSaving) return;

        setIsSaving(true);
        setSaveNotice(null);
        try {
            await db.trainings.add({
                theme: theme.trim(),
                step1_thought: step1Input.trim(),
                step2_reason: step2Input.trim(),
                createdAt: new Date()
            });
            setTheme("");
            setStep1Input("");
            setStep2Input("");
            setPhase("setup");
            setSaveNotice({ type: "success", message: "保存しました。履歴からいつでも見返せます。" });
        } catch (e) {
            console.error("Failed to save", e);
            setSaveNotice({ type: "error", message: "保存できませんでした。時間をおいてもう一度お試しください。" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center max-w-4xl py-24">

                <AnimatePresence mode="wait">

                    {/* SETUP PHASE */}
                    {phase === "setup" && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            className="w-full max-w-lg space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold">何を言語化しますか？</h1>
                                <p className="text-muted-foreground">今、頭の中にあるモヤモヤや、深く考えたいテーマを入力してください。</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="training-theme" className="sr-only">言語化するテーマ</label>
                                    <Input
                                        id="training-theme"
                                        placeholder="例：理想の働き方について"
                                        className="text-lg py-6"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleStart()}
                                        autoFocus
                                    />
                                    <div className="space-y-2 pt-1">
                                        <div className="text-sm font-medium text-muted-foreground">テーマ例から選ぶ</div>
                                        <div className="flex flex-wrap gap-2">
                                            {FEATURED_THEMES.map((featuredTheme) => (
                                                <button
                                                    key={featuredTheme}
                                                    type="button"
                                                    onClick={() => setTheme(featuredTheme)}
                                                    className="rounded-full border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    {featuredTheme}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const random = PREDEFINED_THEMES[Math.floor(Math.random() * PREDEFINED_THEMES.length)];
                                                setTheme(random);
                                            }}
                                            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <Shuffle size={14} aria-hidden="true" />
                                            ランダムにお題を出す
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={handleStart} className="w-full h-12 text-lg" disabled={!theme.trim()}>
                                    トレーニング開始 (合計2分)
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: THINKING */}
                    {phase === "step1" && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 md:gap-8"
                        >
                            <div className="space-y-4 md:space-y-6 flex flex-col h-full">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary font-bold tracking-wider text-sm uppercase bg-primary/10 px-2 py-1 rounded" aria-label="全2ステップ中1ステップ目">Step 1 / 2</span>
                                            {/* Mobile Timer moved here */}
                                            <div className="md:hidden">
                                                <Timer currentSeconds={remainingTime} maxSeconds={MAX_TIME} size="sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl md:text-3xl font-bold">どう思う？ どう感じる？</h2>

                                    {/* Compact Theme for Mobile */}
                                    <div className="text-muted-foreground bg-accent/30 p-2 md:p-3 rounded-md border border-accent text-sm md:text-base">
                                        <div className="text-xs opacity-70 mb-0.5">Theme</div>
                                        <div className="font-semibold text-foreground line-clamp-2 md:line-clamp-none leading-tight">{theme}</div>
                                    </div>
                                </div>

                                <Card className="border-primary/20 bg-card/50 flex-1 flex flex-col">
                                    <div className="px-3 md:px-4 pt-3 pb-0">
                                        <div className="text-sm text-muted-foreground font-medium flex items-center gap-2 leading-relaxed">
                                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">POINT</span>
                                            箇条書きで、矢印（↓）を使って深掘りしていきましょう
                                        </div>
                                    </div>
                                    <CardContent className="p-3 md:p-4 flex-1">
                                        <DeepDiveInput
                                            value={step1Input}
                                            onChange={setStep1Input}
                                            placeholder="例：チームメンバーの意見を聞く"
                                            autoFocus
                                        />
                                    </CardContent>
                                    {/* Mobile Action Button inside Card for easier reach? Or keep outside? 
                                        Let's keep outside but closer. */}
                                </Card>

                                <div className="flex justify-end sticky bottom-4 z-10 md:static">
                                    <Button onClick={handleStep1Complete} variant="secondary" size="lg" className="gap-2 shadow-lg md:shadow-none w-full md:w-auto" disabled={!step1Input.trim()} aria-describedby={!step1Input.trim() ? "step1-requirement" : undefined}>
                                        次へ進む <ChevronRight size={18} />
                                    </Button>
                                </div>
                                {!step1Input.trim() && <p id="step1-requirement" className="text-center text-sm text-muted-foreground md:text-right">1行以上入力すると次へ進めます</p>}
                            </div>

                            <div className="hidden md:flex flex-col gap-6">
                                <Card className="border-border/50">
                                    <CardContent className="pt-6">
                                        <Timer
                                            currentSeconds={remainingTime}
                                            maxSeconds={MAX_TIME}
                                            label="TOTAL TIME"
                                        />
                                    </CardContent>
                                </Card>

                                <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-2 font-semibold text-primary">
                                        <HelpCircle size={18} /> ヒント
                                    </div>
                                    <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                                        <li>「解像度」を上げることを意識して。</li>
                                        <li>箇条書きで深掘りしていくのがおすすめ。</li>
                                        <li>↓ 矢印を使って思考を繋げてみよう。</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: REASONING */}
                    {phase === "step2" && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 md:gap-8"
                        >
                            <div className="space-y-4 md:space-y-6 flex flex-col h-full">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary font-bold tracking-wider text-sm uppercase bg-primary/10 px-2 py-1 rounded" aria-label="全2ステップ中2ステップ目">Step 2 / 2</span>
                                            {/* Mobile Timer moved here */}
                                            <div className="md:hidden">
                                                <Timer currentSeconds={remainingTime} maxSeconds={MAX_TIME} size="sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-xl md:text-3xl font-bold">なぜそう思う？</h2>
                                </div>

                                {/* Reference to Step 1 */}
                                <div className="opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="text-xs text-muted-foreground mb-1">Step 1の思考:</div>
                                    <div className="p-2 md:p-3 bg-muted rounded-md text-xs md:text-sm border-l-4 border-muted-foreground">
                                        {step1Input.split('\n').slice(-3).map((line, i) => (
                                            <div key={i} className="truncate">{line}</div>
                                        ))}
                                        {step1Input.split('\n').length > 3 && <div className="text-xs italic mt-1">...</div>}
                                    </div>
                                </div>

                                <Card className="border-primary/20 bg-card/50 flex-1 flex flex-col">
                                    <div className="px-3 md:px-4 pt-3 pb-0">
                                        <div className="text-sm text-muted-foreground font-medium flex items-center gap-2 leading-relaxed">
                                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">POINT</span>
                                            「〜だから」と理由を深掘りしていきましょう
                                        </div>
                                    </div>
                                    <CardContent className="p-3 md:p-4 flex-1">
                                        <DeepDiveInput
                                            value={step2Input}
                                            onChange={setStep2Input}
                                            placeholder="例：上司ひとりの視点には限界があるから"
                                            autoFocus
                                        />
                                    </CardContent>
                                    {/* Mobile action button closer to input */}
                                </Card>

                                <div className="flex justify-end sticky bottom-4 z-10 md:static">
                                    <Button onClick={handleStep2Complete} size="lg" className="gap-2 shadow-lg md:shadow-none w-full md:w-auto" disabled={!step2Input.trim()} aria-describedby={!step2Input.trim() ? "step2-requirement" : undefined}>
                                        完了する <CheckCircle2 size={18} />
                                    </Button>
                                </div>
                                {!step2Input.trim() && <p id="step2-requirement" className="text-center text-sm text-muted-foreground md:text-right">1行以上入力すると完了できます</p>}
                            </div>

                            <div className="hidden md:flex flex-col gap-6">
                                <Card className="border-border/50">
                                    <CardContent className="pt-6">
                                        <Timer
                                            currentSeconds={remainingTime}
                                            maxSeconds={MAX_TIME}
                                            label="TOTAL TIME"
                                        />
                                    </CardContent>
                                </Card>

                                <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-2 font-semibold text-primary">
                                        <HelpCircle size={18} /> ヒント
                                    </div>
                                    <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                                        <li>「〜だから」で終わるように書いてみる。</li>
                                        <li>客観的な視点を入れてみる。</li>
                                        <li>自分の経験談を紐付けてみる。</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* REVIEW PHASE */}
                    {phase === "review" && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-3xl space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold text-gradient">言語化完了！</h1>
                                <p className="text-muted-foreground">お疲れ様でした。今回の思考を振り返ってみましょう。</p>
                            </div>

                            <div className="space-y-6 border rounded-xl p-8 bg-card shadow-2xl">
                                <div className="border-b pb-4 mb-4">
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Theme</div>
                                    <h2 className="text-2xl font-bold">{theme}</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-primary flex items-center gap-2">Step 1: 思考</div>
                                        <div className="p-4 bg-secondary/20 rounded-lg whitespace-pre-wrap min-h-[150px] text-sm leading-relaxed">
                                            {step1Input}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-primary flex items-center gap-2">Step 2: 理由</div>
                                        <div className="p-4 bg-secondary/20 rounded-lg whitespace-pre-wrap min-h-[150px] text-sm leading-relaxed">
                                            {step2Input}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/20 border border-primary/20 rounded-xl p-6 space-y-3">
                                <h3 className="font-semibold flex items-center gap-2 text-primary">
                                    <HelpCircle size={18} />
                                    振り返りのヒント
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="mt-0.5 text-primary/60" />
                                        <span>「なんとなく」などの曖昧な言葉を具体化できましたか？</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="mt-0.5 text-primary/60" />
                                        <span>「なぜ？」を繰り返して本質的な理由に辿り着けましたか？</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="mt-0.5 text-primary/60" />
                                        <span>思考のつながりを意識して書き出せましたか？</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Button onClick={() => window.location.reload()} variant="outline" size="lg">
                                    破棄して終了
                                </Button>
                                <Button onClick={handleSave} size="lg" className="w-48 gap-2" disabled={isSaving || !step1Input.trim() || !step2Input.trim()}>
                                    {isSaving ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
                                    {isSaving ? "保存中…" : "保存する"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {saveNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            role={saveNotice.type === "error" ? "alert" : "status"}
                            aria-live="polite"
                            className={`fixed bottom-6 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${saveNotice.type === "success" ? "border-primary/30 bg-card/95 text-foreground" : "border-destructive/40 bg-card/95 text-destructive"}`}
                        >
                            {saveNotice.type === "success" ? <CheckCircle2 className="shrink-0 text-primary" aria-hidden="true" /> : <AlertCircle className="shrink-0" aria-hidden="true" />}
                            <span className="flex-1 text-sm font-medium">{saveNotice.message}</span>
                            <button type="button" onClick={() => setSaveNotice(null)} className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="通知を閉じる">
                                <X size={18} aria-hidden="true" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}
