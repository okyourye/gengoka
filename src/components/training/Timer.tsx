
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimerProps {
    currentSeconds: number;
    maxSeconds: number; // For progress calculation
    className?: string;
    label?: string;
    size?: "sm" | "md" | "lg";
}

export function Timer({ currentSeconds, maxSeconds, className, label, size = "md" }: TimerProps) {
    const progress = (currentSeconds / maxSeconds) * 100;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const isUrgent = currentSeconds <= 10;

    // Size configs
    const sizeConfig = {
        sm: { width: 40, height: 40, radius: 16, stroke: 3, fontSize: "text-xs", labelShow: false },
        md: { width: 128, height: 128, radius: 60, stroke: 4, fontSize: "text-4xl", labelShow: true },
        lg: { width: 160, height: 160, radius: 76, stroke: 5, fontSize: "text-5xl", labelShow: true },
    }[size];

    const { width, height, radius, stroke, fontSize, labelShow } = sizeConfig;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className, size === "md" && "p-4")}>
            {labelShow && (
                <div className="text-sm font-medium text-muted-foreground mb-2 tracking-widest uppercase">
                    {label || "REMAINING TIME"}
                </div>
            )}
            <div className="relative">
                <svg width={width} height={height} className="-rotate-90">
                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={radius}
                        className="stroke-muted fill-none"
                        strokeWidth={stroke}
                    />
                    <motion.circle
                        cx={width / 2}
                        cy={height / 2}
                        r={radius}
                        className={cn(
                            "fill-none transition-colors duration-500",
                            isUrgent ? "stroke-destructive" : "stroke-primary"
                        )}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (circumference * progress) / 100}
                        strokeLinecap="round"
                        initial={false}
                        animate={{ strokeDashoffset: circumference - (circumference * progress) / 100 }}
                        transition={{ type: "tween", ease: "linear", duration: 1 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                        "font-bold tabular-nums tracking-tighter transition-colors",
                        fontSize,
                        isUrgent ? "text-destructive" : "text-foreground"
                    )}>
                        {formatTime(currentSeconds)}
                    </span>
                </div>
            </div>
        </div>
    );
}
