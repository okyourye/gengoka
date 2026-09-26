
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pause, Play, Plus } from "lucide-react";

interface TimerProps {
    currentSeconds: number;
    maxSeconds: number; // For progress calculation
    className?: string;
    label?: string;
    size?: "sm" | "md" | "lg";
    isPaused?: boolean;
    onTogglePause?: () => void;
    onAddTime?: (seconds: number) => void;
    showControls?: boolean;
}

export function Timer({
    currentSeconds,
    maxSeconds,
    className,
    label,
    size = "md",
    isPaused = false,
    onTogglePause,
    onAddTime,
    showControls = false,
}: TimerProps) {
    const progress = Math.max(0, Math.min(100, (currentSeconds / maxSeconds) * 100));

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const isUrgent = currentSeconds <= 15 && currentSeconds > 0;
    const isFinished = currentSeconds === 0;

    // Size configs
    const sizeConfig = {
        sm: { width: 44, height: 44, radius: 18, stroke: 3.5, fontSize: "text-xs font-semibold", labelShow: false },
        md: { width: 140, height: 140, radius: 62, stroke: 5, fontSize: "text-4xl font-bold tracking-tight", labelShow: true },
        lg: { width: 180, height: 180, radius: 80, stroke: 6, fontSize: "text-5xl font-extrabold tracking-tight", labelShow: true },
    }[size];

    const { width, height, radius, stroke, fontSize, labelShow } = sizeConfig;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className={cn("relative flex flex-col items-center justify-center select-none", className, size === "md" && "p-4")}>
            {labelShow && (
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80 mb-3 tracking-widest uppercase">
                    <span className={cn(
                        "w-2 h-2 rounded-full",
                        isFinished ? "bg-rose-500" : isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                    )} />
                    {isFinished ? "TIME EXPIRED" : isPaused ? "PAUSED" : (label || "REMAINING TIME")}
                </div>
            )}

            <div className="relative">
                <svg width={width} height={height} className="-rotate-90 drop-shadow-md">
                    {/* Background track */}
                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={radius}
                        className="stroke-slate-200 fill-none"
                        strokeWidth={stroke}
                    />
                    {/* Dynamic Progress Circle */}
                    <motion.circle
                        cx={width / 2}
                        cy={height / 2}
                        r={radius}
                        className={cn(
                            "fill-none transition-colors duration-300",
                            isFinished
                                ? "stroke-rose-500"
                                : isUrgent
                                ? "stroke-amber-500"
                                : "stroke-indigo-600"
                        )}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (circumference * progress) / 100}
                        strokeLinecap="round"
                        initial={false}
                        animate={{
                            strokeDashoffset: circumference - (circumference * progress) / 100,
                        }}
                        transition={{ type: "tween", ease: "linear", duration: 0.5 }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className={cn(
                            "tabular-nums transition-colors font-mono",
                            fontSize,
                            isFinished
                                ? "text-rose-600"
                                : isUrgent
                                ? "text-amber-600"
                                : isPaused
                                ? "text-slate-400"
                                : "text-slate-900"
                        )}
                    >
                        {formatTime(currentSeconds)}
                    </motion.span>
                    {size !== "sm" && isPaused && (
                        <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider mt-0.5">一時停止中</span>
                    )}
                </div>
            </div>

            {/* Optional inline timer controls (Pause, +30s) */}
            {showControls && size !== "sm" && (
                <div className="flex items-center gap-2 mt-4">
                    {onTogglePause && (
                        <button
                            type="button"
                            onClick={onTogglePause}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-all shadow-xs"
                            aria-label={isPaused ? "タイマーを再開" : "タイマーを一時停止"}
                        >
                            {isPaused ? <Play size={13} className="text-emerald-600 fill-emerald-600" /> : <Pause size={13} />}
                            {isPaused ? "再開" : "一時停止"}
                        </button>
                    )}
                    {onAddTime && (
                        <button
                            type="button"
                            onClick={() => onAddTime(30)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-all shadow-xs"
                            title="30秒延長"
                        >
                            <Plus size={13} />
                            +30秒
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
