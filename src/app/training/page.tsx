"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/training/Timer";
import { QuestionCard } from "@/components/training/QuestionCard";
import { DeepDiveInput } from "@/components/training/DeepDiveInput";
import { ArrowRight, CheckCircle2, RotateCcw, ArrowDown } from "lucide-react";
import { HintSection } from "@/components/training/HintSection";

type Phase = "intro" | "thinking" | "reasoning" | "review";

const DEFAULT_THEME = "理想の上司に必要なことは何か？";
const TOTAL_TIME = 120; // 2 minutes total for both steps

export default function TrainingPage() {
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>("intro");
    // timeLeft is now shared across phases
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [isRunning, setIsRunning] = useState(false);

    const [inputs, setInputs] = useState({
        thinking: "",
        reasoning: ""
    });

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Time is up! Move to review if not already there
            if (phase !== "review") {
                setPhase("review");
                setIsRunning(false);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, phase]);

    const handleStart = () => {
        setPhase("thinking");
        setTimeLeft(TOTAL_TIME);
        setIsRunning(true);
    };

    const handleNextPhase = () => {
        if (phase === "thinking") {
            setPhase("reasoning");
            // Do NOT reset timer
        } else if (phase === "reasoning") {
            setPhase("review");
            setIsRunning(false);
        }
    };

    const getLastThinkingLine = () => {
        const lines = inputs.thinking.split('\n').filter(line => line.trim() !== '');
        return lines.length > 0 ? lines[lines.length - 1] : inputs.thinking;
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 sm:py-12 flex flex-col items-center">

                {/* Progress Indicator */}
                {phase !== "intro" && phase !== "review" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex justify-between items-center mb-8 sticky top-20 z-40 bg-background/80 backdrop-blur-md py-4 rounded-lg px-4 border border-white/5"
                    >
                        <div className="text-sm font-medium text-muted-foreground">
                            Theme: <span className="text-foreground">{DEFAULT_THEME}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-primary mr-2">
                                {phase === "thinking" ? "Step 1: 思考" : "Step 2: 理由"}
                            </span>
                            <Timer duration={TOTAL_TIME} timeLeft={timeLeft} isRunning={isRunning} />
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">

                    {/* INTRO PHASE */}
                    {phase === "intro" && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-2xl text-center space-y-8 mt-10"
                        >
                            <h1 className="text-3xl font-bold">トレーニングを開始します</h1>
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 text-left">
                                <p className="text-sm text-muted-foreground mb-2">今回のお題</p>
                                <p className="text-xl font-bold">{DEFAULT_THEME}</p>
                            </div>
                            <div className="space-y-4 text-left p-6 rounded-2xl bg-secondary/10">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">!</span>
                                    ルール
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>2つのステップ合わせて<strong className="text-foreground">合計2分</strong>です</li>
                                    <li>質問に答えたら、<span className="text-primary font-bold">「それってどういうこと？」</span>と深掘りしていきましょう</li>
                                    <li>Enterキーで次の深掘りへ進めます</li>
                                </ul>
                            </div>
                            <Button size="lg" onClick={handleStart} className="w-full sm:w-auto">
                                開始する
                            </Button>
                        </motion.div>
                    )}

                    {/* THINKING PHASE */}
                    {phase === "thinking" && (
                        <motion.div
                            key="thinking"
                            className="w-full flex flex-col lg:flex-row items-start gap-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex-1 w-full">
                                <QuestionCard
                                    step={1}
                                    title="どう思う？どう感じる？"
                                    subtitle="自分の意見や考えを明確に表現する"
                                    description={
                                        <span className="block text-sm">
                                            まずは思い浮かんだことを書いてみましょう。<br />
                                            そこから「それってどういうこと？」と自問自答を繰り返して解像度を上げます。
                                        </span>
                                    }
                                />
                                <DeepDiveInput
                                    placeholder="例: 上司は話を聞くべき..."
                                    value={inputs.thinking}
                                    onChange={(val) => setInputs({ ...inputs, thinking: val })}
                                    autoFocus
                                />
                                <div className="flex justify-end mt-6">
                                    <Button onClick={handleNextPhase}>
                                        次へ進む <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <HintSection step={1} />
                        </motion.div>
                    )}

                    {/* REASONING PHASE */}
                    {phase === "reasoning" && (
                        <motion.div
                            key="reasoning"
                            className="w-full flex flex-col lg:flex-row items-start gap-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex-1 w-full">
                                <QuestionCard
                                    step={2}
                                    title="なぜそう思う？"
                                    subtitle="その考えの根拠や理由を説明する"
                                    description={
                                        <div className="text-sm bg-secondary/30 p-4 rounded-lg mb-4 text-left">
                                            <span className="text-xs text-muted-foreground block mb-1">あなたの考え:</span>
                                            <p className="italic text-foreground/90 font-medium">"{getLastThinkingLine()}"</p>
                                        </div>
                                    }
                                />
                                <DeepDiveInput
                                    placeholder="なぜなら..."
                                    value={inputs.reasoning}
                                    onChange={(val) => setInputs({ ...inputs, reasoning: val })}
                                    autoFocus
                                />
                                <div className="flex justify-end mt-6">
                                    <Button onClick={handleNextPhase}>
                                        完了する <CheckCircle2 className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <HintSection step={2} />
                        </motion.div>
                    )}

                    {/* REVIEW PHASE */}
                    {phase === "review" && (
                        <motion.div
                            key="review"
                            className="w-full max-w-4xl space-y-8"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2 className="text-3xl font-bold">トレーニング完了</h2>
                                <p className="text-muted-foreground mt-2">
                                    {timeLeft === 0 ? "タイムアップ！" : "お疲れ様でした！"}
                                    <br />以下のプロセスで言語化を行いました
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ResultCard title="思考プロセス (Step 1)" content={inputs.thinking} />
                                <ResultCard title="理由・根拠 (Step 2)" content={inputs.reasoning} />
                            </div>

                            <div className="flex justify-center gap-4 mt-8">
                                <Button variant="outline" onClick={() => router.push("/")}>
                                    トップへ戻る
                                </Button>
                                <Button onClick={() => setPhase('intro')}>
                                    <RotateCcw className="mr-2 w-4 h-4" />
                                    もう一度行う
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function ResultCard({ title, content }: { title: string; content: string }) {
    const lines = content.split('\n').filter(l => l.trim());
    return (
        <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 h-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider border-b border-white/5 pb-2">
                {title}
            </h3>
            <div className="space-y-4">
                {lines.map((line, i) => (
                    <div key={i} className="relative">
                        {i > 0 && (
                            <div className="flex items-center gap-1 my-1 pl-2 text-xs text-muted-foreground/50">
                                <ArrowDown size={12} />
                                <span>深掘り</span>
                            </div>
                        )}
                        <p className={`text-foreground/90 leading-relaxed ${i === lines.length - 1 ? "font-bold text-primary text-lg" : ""}`}>
                            {line}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
