
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "@/components/training/Timer";
import { DeepDiveInput } from "@/components/training/DeepDiveInput";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Save, Shuffle } from "lucide-react";
import { PREDEFINED_THEMES } from "@/lib/themes";

type Phase = "setup" | "step1" | "step2" | "review";

export default function TrainingPage() {
    const [phase, setPhase] = useState<Phase>("setup");
    const [theme, setTheme] = useState("");
    const [step1Input, setStep1Input] = useState("");
    const [step2Input, setStep2Input] = useState("");
    const [isTimerActive, setIsTimerActive] = useState(false);

    // Global Timer State
    const MAX_TIME = 120; // 2 minutes total
    const [remainingTime, setRemainingTime] = useState(MAX_TIME);

    // Focus management
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if ((phase === "step1" || phase === "step2") && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [phase]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        setIsTimerActive(false);
                        setPhase("review"); // Time's up -> Go to review
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
        setRemainingTime(MAX_TIME); // Reset timer
        setPhase("step1");
        setIsTimerActive(true);
    };

    const handleStep1Complete = () => {
        setPhase("step2");
        // Timer continues running
    };

    const handleStep2Complete = () => {
        setIsTimerActive(false);
        setPhase("review");
    };

    const handleSave = async () => {
        try {
            if (!theme || !step1Input) return;
            await db.trainings.add({
                theme,
                step1_thought: step1Input,
                step2_reason: step2Input,
                createdAt: new Date()
            });
            // Redirect or show success
            // For now, simple alert or reset
            alert("保存しました！");
            // Reset for next
            setTheme("");
            setStep1Input("");
            setStep2Input("");
            setPhase("setup");
        } catch (e) {
            console.error("Failed to save", e);
            alert("保存に失敗しました。");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center max-w-4xl py-20">

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
                                    <Input
                                        placeholder="例: 理想のリーダーシップとは？ / 最近気になっているニュースについて"
                                        className="text-lg py-6"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleStart()}
                                        autoFocus
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                const random = PREDEFINED_THEMES[Math.floor(Math.random() * PREDEFINED_THEMES.length)];
                                                setTheme(random);
                                            }}
                                            className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
                                        >
                                            <Shuffle size={12} />
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
                            className="w-full grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8"
                        >
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-primary font-bold tracking-wider text-sm uppercase">Step 1</span>
                                    <h2 className="text-3xl font-bold">どう思う？ どう感じる？</h2>
                                    <p className="text-muted-foreground bg-accent/30 p-3 rounded-md border border-accent">
                                        テーマ: <span className="font-semibold text-foreground">{theme}</span>
                                    </p>
                                </div>

                                <Card className="border-primary/20 bg-card/50">
                                    <CardContent className="p-4">
                                        <DeepDiveInput
                                            value={step1Input}
                                            onChange={setStep1Input}
                                            placeholder="まずは1行、思い浮かんだことを書いてみましょう。"
                                            autoFocus
                                        />
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end">
                                    <Button onClick={handleStep1Complete} variant="secondary" size="lg" className="gap-2">
                                        次へ進む <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
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
                            className="w-full grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8"
                        >
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-primary font-bold tracking-wider text-sm uppercase">Step 2</span>
                                    <h2 className="text-3xl font-bold">なぜそう思う？</h2>
                                </div>

                                {/* Reference to Step 1 */}
                                <div className="opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="text-xs text-muted-foreground mb-1">Step 1の思考:</div>
                                    <div className="p-3 bg-muted rounded-md text-sm border-l-4 border-muted-foreground">
                                        {step1Input.split('\n').slice(-3).map((line, i) => (
                                            <div key={i} className="truncate">{line}</div>
                                        ))}
                                        {step1Input.split('\n').length > 3 && <div className="text-xs italic mt-1">...</div>}
                                    </div>
                                </div>

                                <Card className="border-primary/20 bg-card/50">
                                    <CardContent className="p-4">
                                        <DeepDiveInput
                                            value={step2Input}
                                            onChange={setStep2Input}
                                            placeholder="その考えの根拠は？"
                                            autoFocus
                                        />
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end">
                                    <Button onClick={handleStep2Complete} size="lg" className="gap-2">
                                        完了する <CheckCircle2 size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
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
                                <Button onClick={handleSave} size="lg" className="w-48 gap-2">
                                    <Save size={18} />
                                    保存する
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}
