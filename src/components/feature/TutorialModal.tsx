"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, ArrowDown, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
    const [step, setStep] = useState(0);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(0);
        }
    }, [isOpen]);

    const totalSteps = 4;

    const nextStep = () => {
        if (step < totalSteps - 1) setStep(step + 1);
        else onClose();
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-8 min-h-[500px] flex flex-col">
                            <div className="flex-1">
                                {step === 0 && (
                                    <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                            <Lightbulb size={32} />
                                        </div>
                                        <h2 className="text-2xl font-bold">言語化トレーニングとは？</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            「なんとなく」考えていることを、明確な言葉にするためのトレーニングです。<br />
                                            <span className="font-bold text-foreground">「思考」</span>と<span className="font-bold text-foreground">「理由」</span>の2つのステップで、<br />
                                            あなたの思考の解像度を極限まで高めます。
                                        </p>
                                        <div className="py-6">
                                            <div className="p-4 bg-secondary/30 rounded-lg text-sm text-left mx-auto max-w-md space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Step 1</span>
                                                    <span>どう思う？（思考の深掘り）</span>
                                                </div>
                                                <div className="flex justify-center text-muted-foreground"><ArrowDown size={14} /></div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Step 2</span>
                                                    <span>なぜそう思う？（理由の深掘り）</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-sm font-bold text-primary tracking-wider uppercase">Step 1</div>
                                        <h2 className="text-2xl font-bold">思考の解像度を高める</h2>
                                        <p className="text-muted-foreground">
                                            「理想の上司に必要なことは？」というお題を例に、<br />
                                            <span className="text-primary font-bold">「それってどういうこと？」</span>と自問自答を繰り返します。
                                        </p>

                                        <div className="mt-6 bg-secondary/20 p-6 rounded-xl space-y-3 font-medium">
                                            <div className="opacity-50 pl-2 border-l-2 border-muted">1-1. チームメンバーの意見を聞く</div>
                                            <div className="flex items-center gap-2 text-xs text-primary/70 pl-6">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-70 pl-2 border-l-2 border-muted">1-2. 相手の意見を否定しない</div>
                                            <div className="flex items-center gap-2 text-xs text-primary/70 pl-6">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-90 pl-2 border-l-2 border-muted">1-3. 相手を年齢や社歴で判断しない</div>
                                            <div className="flex items-center gap-2 text-xs text-primary/70 pl-6">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="text-primary bg-primary/10 p-3 rounded-lg border border-primary/20 flex items-center justify-between">
                                                <span>1-4. 相手の視点を尊重する</span>
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div className="text-right text-xs text-primary font-bold">↑ これが最も解像度の高い「解」</div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-sm font-bold text-primary tracking-wider uppercase">Step 2</div>
                                        <h2 className="text-2xl font-bold">理由の解像度を高める</h2>
                                        <p className="text-muted-foreground">
                                            導き出した「相手の視点を尊重する」に対して、<br />
                                            今度は<span className="text-primary font-bold">「なぜそう思う？」</span>と理由を深掘りします。
                                        </p>

                                        <div className="mt-6 bg-secondary/20 p-6 rounded-xl space-y-3 font-medium">
                                            <div className="opacity-50 pl-2 border-l-2 border-muted">2-1. 上司ひとりの視点や発想には限界があるから</div>
                                            <div className="flex items-center gap-2 text-xs text-primary/70 pl-6">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-70 pl-2 border-l-2 border-muted">2-2. チームメンバーを活かすことがチームを強くする</div>
                                            <div className="flex items-center gap-2 text-xs text-primary/70 pl-6">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-90 pl-2 border-l-2 border-muted">2-3. 尊重し合うことで人間関係のストレスも減る</div>
                                            <div className="flex items-center gap-2 text-xs text-primary/70 pl-6">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="text-primary bg-primary/10 p-3 rounded-lg border border-primary/20 flex items-center justify-between">
                                                <span>2-4. チームメンバーのモチベーションも上がる</span>
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div className="text-right text-xs text-primary font-bold">↑ これが最も解像度の高い「理由」</div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300 pt-8">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white mb-6 shadow-lg shadow-primary/20">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h2 className="text-3xl font-bold">準備完了です！</h2>
                                        <p className="text-muted-foreground text-lg">
                                            解像度の高い<span className="text-foreground font-bold">「思考(1-4)」</span>と、<br />
                                            それを支える強固な<span className="text-foreground font-bold">「理由(2-4)」</span>。<br />
                                            この2つが揃ったとき、あなたの言葉は相手に深く刺さります。
                                        </p>
                                        <div className="pt-8">
                                            <Button size="lg" className="w-full text-lg h-14" onClick={onClose}>
                                                トレーニングを始める
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Navigation */}
                            {step < 3 && (
                                <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/50">
                                    <Button variant="ghost" onClick={step === 0 ? onClose : prevStep} className="text-muted-foreground">
                                        {step === 0 ? "スキップ" : "戻る"}
                                    </Button>
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-primary" : "bg-primary/20"}`} />
                                        ))}
                                    </div>
                                    <Button onClick={nextStep} className="gap-2">
                                        次へ <ChevronRight size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
