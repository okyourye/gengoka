"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ArrowDown, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
    const [step, setStep] = useState(0);
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = useId();

    const totalSteps = 4;

    const closeTutorial = useCallback(() => {
        setStep(0);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        const focusableSelector = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements = dialog?.querySelectorAll<HTMLElement>(focusableSelector);
        focusableElements?.[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeTutorial();
                return;
            }

            if (event.key !== "Tab" || !dialog) return;
            const elements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
            if (elements.length === 0) return;
            const first = elements[0];
            const last = elements[elements.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus();
        };
    }, [closeTutorial, isOpen]);

    const nextStep = () => {
        if (step < totalSteps - 1) setStep(step + 1);
        else closeTutorial();
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
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeTutorial}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <Button variant="ghost" size="icon" onClick={closeTutorial} className="hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg" aria-label="使い方を閉じる">
                                <X className="w-5 h-5" aria-hidden="true" />
                            </Button>
                        </div>

                        <div className="p-6 sm:p-8 min-h-[480px] flex flex-col justify-between">
                            <div className="flex-1">
                                {step === 0 && (
                                    <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 mb-4 shadow-xs">
                                            <Lightbulb size={32} />
                                        </div>
                                        <h2 id={titleId} className="text-2xl font-bold text-slate-900">言語化トレーニングとは？</h2>
                                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                                            「なんとなく」考えていることを、明確な言葉にするためのトレーニングです。<br />
                                            <span className="font-bold text-slate-900">「思考」</span>と<span className="font-bold text-slate-900">「理由」</span>の2つのステップで、<br />
                                            あなたの思考の解像度を極限まで高めます。
                                        </p>
                                        <div className="py-6">
                                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-left mx-auto max-w-md space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">Step 1</span>
                                                    <span className="font-semibold text-slate-800">どう思う？（思考の深掘り）</span>
                                                </div>
                                                <div className="flex justify-center text-slate-400"><ArrowDown size={14} /></div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">Step 2</span>
                                                    <span className="font-semibold text-slate-800">なぜそう思う？（理由の深掘り）</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-sm font-bold text-indigo-600 tracking-wider uppercase">Step 1</div>
                                        <h2 id={titleId} className="text-2xl font-bold text-slate-900">STEP 1で入力すること</h2>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            「理想の上司に必要なことは？」というお題を例に、<br />
                                            <span className="text-indigo-600 font-bold">「それってどういうこと？」</span>と自問自答を繰り返し、<br />
                                            思いつくことを箇条書きでどんどん書いていきます。
                                        </p>

                                        <div className="mt-6 bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-3 font-medium text-slate-700 text-sm">
                                            <div className="opacity-60 pl-2 border-l-2 border-slate-300">1-1. チームメンバーの意見を聞く</div>
                                            <div className="flex items-center gap-2 text-xs text-indigo-600 pl-6 font-semibold">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-80 pl-2 border-l-2 border-slate-300">1-2. 相手の意見を否定しない</div>
                                            <div className="flex items-center gap-2 text-xs text-indigo-600 pl-6 font-semibold">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-95 pl-2 border-l-2 border-slate-300">1-3. 相手を年齢や社歴で判断しない</div>
                                            <div className="flex items-center gap-2 text-xs text-indigo-600 pl-6 font-semibold">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="text-indigo-950 bg-indigo-50 p-3 rounded-lg border border-indigo-200 flex items-center justify-between font-bold">
                                                <span>1-4. 相手の視点を尊重する</span>
                                                <CheckCircle2 size={18} className="text-emerald-600" />
                                            </div>
                                            <div className="text-right text-xs text-indigo-600 font-bold">↑ これが最も解像度の高い「解」</div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-sm font-bold text-sky-700 tracking-wider uppercase">Step 2</div>
                                        <h2 id={titleId} className="text-2xl font-bold text-slate-900">STEP 2で入力すること</h2>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            先ほど導き出した「相手の視点を尊重する」に対して、<br />
                                            今度は<span className="text-sky-700 font-bold">「なぜそう思う？」</span>と理由を深掘りします。
                                        </p>

                                        <div className="mt-6 bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-3 font-medium text-slate-700 text-sm">
                                            <div className="opacity-60 pl-2 border-l-2 border-slate-300">2-1. 上司ひとりの視点や発想には限界があるから</div>
                                            <div className="flex items-center gap-2 text-xs text-sky-700 pl-6 font-semibold">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-80 pl-2 border-l-2 border-slate-300">2-2. チームメンバーを活かすことがチームを強くする</div>
                                            <div className="flex items-center gap-2 text-xs text-sky-700 pl-6 font-semibold">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="opacity-95 pl-2 border-l-2 border-slate-300">2-3. 尊重し合うことで人間関係のストレスも減る</div>
                                            <div className="flex items-center gap-2 text-xs text-sky-700 pl-6 font-semibold">
                                                <ArrowDown size={14} /> それってどういうこと？
                                            </div>
                                            <div className="text-sky-950 bg-sky-50 p-3 rounded-lg border border-sky-200 flex items-center justify-between font-bold">
                                                <span>2-4. チームメンバーのモチベーションも上がる</span>
                                                <CheckCircle2 size={18} className="text-emerald-600" />
                                            </div>
                                            <div className="text-right text-xs text-sky-700 font-bold">↑ これが最も解像度の高い「理由」</div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300 pt-8">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-500/25">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h2 id={titleId} className="text-3xl font-extrabold tracking-tight text-slate-900">準備完了です！</h2>
                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                            解像度の高い<br /><span className="text-slate-900 font-bold">「相手の視点を尊重する」</span>という思考と、<br />
                                            それを支える強固な<br /><span className="text-slate-900 font-bold">「チームメンバーのモチベーションも上がる」</span><br />という理由。<br />
                                            この2つが揃ったとき、あなたの言葉は相手に深く刺さり、行動へと変わります。
                                        </p>
                                        <div className="pt-6">
                                            <Button size="lg" className="w-full text-base font-bold h-13 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20" onClick={closeTutorial}>
                                                トレーニングを始める
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Navigation */}
                            {step < 3 && (
                                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
                                    <Button variant="ghost" onClick={step === 0 ? closeTutorial : prevStep} className="text-slate-500 hover:text-slate-800">
                                        {step === 0 ? "スキップ" : "戻る"}
                                    </Button>
                                    <div className="flex gap-1" role="status" aria-label={`使い方 全${totalSteps}ページ中${step + 1}ページ目`}>
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-indigo-600" : "bg-slate-200"}`} />
                                        ))}
                                    </div>
                                    <Button onClick={nextStep} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
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
