
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimerProps {
    currentSeconds: number;
    maxSeconds: number; // For progress calculation
    className?: string;
    label?: string;
}

export function Timer({ currentSeconds, maxSeconds, className, label }: TimerProps) {
    const progress = (currentSeconds / maxSeconds) * 100;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const isUrgent = currentSeconds <= 10;

    return (
        <div className={cn("relative flex flex-col items-center justify-center p-4", className)}>
            <div className="text-sm font-medium text-muted-foreground mb-2 tracking-widest uppercase">
                {label || "REMAINING TIME"}
            </div>
            <div className="relative">
                <svg className="w-32 h-32 -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        className="stroke-muted fill-none"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="64"
                        cy="64"
                        r="60"
                        className={cn(
                            "fill-none transition-colors duration-500",
                            isUrgent ? "stroke-destructive" : "stroke-primary"
                        )}
                        strokeWidth="4"
                        strokeDasharray="377"
                        strokeDashoffset={377 - (377 * progress) / 100}
                        strokeLinecap="round"
                        initial={false}
                        animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                        transition={{ type: "tween", ease: "linear", duration: 1 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                        "text-4xl font-bold tabular-nums tracking-tighter transition-colors",
                        isUrgent ? "text-destructive" : "text-foreground"
                    )}>
                        {formatTime(currentSeconds)}
                    </span>
                </div>
            </div>
        </div>
    );
}
