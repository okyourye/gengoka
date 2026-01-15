"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TimerProps {
    duration: number; // seconds
    timeLeft: number;
    isRunning: boolean;
}

export function Timer({ duration, timeLeft, isRunning }: TimerProps) {
    const percent = (timeLeft / duration) * 100;
    const isUrgent = timeLeft <= 30;

    // Normalize radius and circumference for SVG scaling
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    // Hydration fix: ensure client-side only rendering for time if needed, 
    // but timeLeft is passed top-down so it should be fine. 
    // However, avoid mismatch if initial render differs.

    return (
        <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16">
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-secondary"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * percent) / 100}
                    strokeLinecap="round"
                    className={`transition-colors duration-300 ${isUrgent ? 'text-destructive' : 'text-primary'}`}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: circumference - (circumference * percent) / 100 }}
                />
            </svg>
            <div className={`font-bold font-mono text-foreground ${isUrgent ? 'text-destructive' : ''} text-xs sm:text-sm`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
        </div>
    );
}
