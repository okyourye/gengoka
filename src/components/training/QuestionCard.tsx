"use client";

import { motion } from "framer-motion";

interface QuestionCardProps {
    step: number;
    title: string;
    subtitle?: string;
    description: React.ReactNode;
}

export function QuestionCard({ step, title, subtitle, description }: QuestionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full mb-8 text-center"
        >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm">
                Step {step}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                {title}
            </h2>
            {subtitle && (
                <h3 className="text-xl text-foreground/80 mb-4">{subtitle}</h3>
            )}
            <div className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                {description}
            </div>
        </motion.div>
    );
}
