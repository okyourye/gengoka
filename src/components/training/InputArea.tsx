"use client";

import { useRef, useEffect } from "react";
import { TextareaHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
}

export function InputArea({ label, helperText, className, value, ...props }: InputAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [value]);

    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-medium text-muted-foreground ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <textarea
                    ref={textareaRef}
                    className={`
            w-full bg-secondary/30 text-foreground 
            rounded-xl p-4 min-h-[120px] 
            border-2 border-transparent 
            focus:border-primary/50 focus:bg-secondary/50 focus:outline-none 
            resize-none transition-all duration-200
            text-lg leading-relaxed
            placeholder:text-muted-foreground/50
            ${className}
          `}
                    value={value}
                    {...props}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground pointer-events-none">
                    {String(value || "").length}文字
                </div>
            </div>
            <AnimatePresence>
                {helperText && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-muted-foreground ml-1"
                    >
                        {helperText}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
