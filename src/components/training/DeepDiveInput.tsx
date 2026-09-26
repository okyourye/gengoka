"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeepDiveInputProps {
    value: string; // "Line 1\nLine 2\nLine 3"
    onChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    stepPrefix?: string; // e.g. "1" or "2"
    questionPrompt?: string; // e.g. "それってどういうこと？" or "なぜそう思う？"
}

export function DeepDiveInput({
    value,
    onChange,
    placeholder,
    autoFocus,
    stepPrefix = "1",
    questionPrompt = "それってどういうこと？",
}: DeepDiveInputProps) {
    const lines = value ? value.split("\n") : [""];
    const [activeLineIndex, setActiveLineIndex] = useState(lines.length - 1);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (activeLineIndex >= 0 && inputRefs.current[activeLineIndex]) {
            inputRefs.current[activeLineIndex]?.focus();
        }
    }, [activeLineIndex, lines.length]);

    const updateLine = (index: number, content: string) => {
        const newLines = [...lines];
        newLines[index] = content;
        onChange(newLines.join("\n"));
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // IME conversion handling
            if (e.nativeEvent.isComposing) {
                return;
            }

            e.preventDefault();
            if (lines[index].trim() !== "") {
                const newLines = [...lines];
                newLines.splice(index + 1, 0, "");
                onChange(newLines.join("\n"));
                setActiveLineIndex(index + 1);
            }
        } else if (e.key === "Backspace" && lines[index] === "" && lines.length > 1) {
            e.preventDefault();
            deleteLine(index);
        } else if (e.key === "ArrowUp" && index > 0) {
            e.preventDefault();
            setActiveLineIndex(index - 1);
        } else if (e.key === "ArrowDown" && index < lines.length - 1) {
            e.preventDefault();
            setActiveLineIndex(index + 1);
        }
    };

    const deleteLine = (index: number) => {
        if (lines.length <= 1) return;
        const newLines = [...lines];
        newLines.splice(index, 1);
        onChange(newLines.join("\n"));
        setActiveLineIndex(Math.max(0, index - 1));
    };

    const addLine = () => {
        if (lines[lines.length - 1].trim() !== "") {
            const newLines = [...lines, ""];
            onChange(newLines.join("\n"));
            setActiveLineIndex(newLines.length - 1);
        }
    };

    const getDynamicPlaceholder = (idx: number) => {
        if (idx === 0) return placeholder || "思いつくことを直感で書いてみましょう";
        if (idx === 1) return "それってどういうこと？ 具体的な行動や状態は？";
        if (idx === 2) return "さらに本質的な意味や状態へ深掘りしてみる...";
        return "最も解像度の高い言葉へ結晶化させる...";
    };

    return (
        <div className="w-full space-y-3">
            <div className="relative space-y-3">
                <AnimatePresence initial={false}>
                    {lines.map((line, index) => {
                        const isLastLine = index === lines.length - 1 && lines.length > 1;
                        const isFocused = activeLineIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                {index > 0 && (
                                    <div className="flex items-center gap-2.5 py-1.5 pl-4 text-xs font-semibold text-indigo-700">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-xs">
                                            <ArrowDown size={13} />
                                        </div>
                                        <span className="bg-indigo-50/80 text-indigo-800 px-3 py-0.5 rounded-full border border-indigo-200/80 font-medium tracking-wide text-[11px] sm:text-xs">
                                            {questionPrompt}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "group relative flex items-center gap-3.5 rounded-2xl border transition-all duration-200 px-4 sm:px-5 py-3.5 sm:py-4",
                                        isFocused
                                            ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-500/10"
                                            : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                                    )}
                                >
                                    {/* Line Number Badge */}
                                    <div
                                        className={cn(
                                            "shrink-0 flex items-center justify-center w-9 h-9 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors select-none",
                                            isFocused
                                                ? "bg-indigo-600 text-white shadow-xs font-black"
                                                : "bg-slate-100 text-slate-700 font-bold"
                                        )}
                                    >
                                        {stepPrefix}-{index + 1}
                                    </div>

                                    {/* Text Input */}
                                    <input
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        autoFocus={autoFocus && index === 0}
                                        value={line}
                                        onChange={(e) => updateLine(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onFocus={() => setActiveLineIndex(index)}
                                        placeholder={getDynamicPlaceholder(index)}
                                        className="flex-1 bg-transparent text-slate-900 font-semibold placeholder:text-slate-400 text-base sm:text-xl focus:outline-none leading-relaxed tracking-wide"
                                    />

                                    {/* Last line highlight indicator */}
                                    {isLastLine && line.trim() && (
                                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg shrink-0">
                                            <Sparkles size={13} className="text-emerald-600" />
                                            解像度MAX
                                        </span>
                                    )}

                                    {/* Delete line button */}
                                    {lines.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => deleteLine(index)}
                                            tabIndex={-1}
                                            className="opacity-70 group-hover:opacity-100 focus:opacity-100 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                                            aria-label={`行 ${stepPrefix}-${index + 1} を削除`}
                                        >
                                            <X size={17} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Action Bar & Keyboard Guide */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                        <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold bg-slate-100 border border-slate-300 rounded-md text-slate-700 shadow-xs">Enter ⏎</kbd>
                        で深掘りを追加
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="hidden sm:inline-flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-bold bg-slate-100 border border-slate-300 rounded-md text-slate-700 shadow-xs">↑</kbd>
                        <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-bold bg-slate-100 border border-slate-300 rounded-md text-slate-700 shadow-xs">↓</kbd>
                        で行移動
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addLine}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 gap-1.5 rounded-xl border border-indigo-200"
                    disabled={lines[lines.length - 1].trim() === ""}
                >
                    <Plus className="w-3.5 h-3.5" />
                    深掘りを追加する
                </Button>
            </div>
        </div>
    );
}
