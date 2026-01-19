"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeepDiveInputProps {
    value: string; // "Line 1\nLine 2\nLine 3"
    onChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export function DeepDiveInput({ value, onChange, placeholder, autoFocus }: DeepDiveInputProps) {
    // Convert unified string value to array of strings for UI state
    const lines = value ? value.split("\n") : [""];
    const [activeLineIndex, setActiveLineIndex] = useState(lines.length - 1);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Sync external value changes if needed, but mostly we drive from internal state
    }, [value]);

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
            // Add new line if current line is not empty
            if (lines[index].trim() !== "") {
                const newLines = [...lines];
                // Insert after current index
                newLines.splice(index + 1, 0, "");
                onChange(newLines.join("\n"));
                setActiveLineIndex(index + 1);
            }
        } else if (e.key === "Backspace" && lines[index] === "" && lines.length > 1) {
            e.preventDefault();
            const newLines = [...lines];
            newLines.splice(index, 1);
            onChange(newLines.join("\n"));
            setActiveLineIndex(Math.max(0, index - 1));
        } else if (e.key === "ArrowUp" && index > 0) {
            e.preventDefault();
            setActiveLineIndex(index - 1);
        } else if (e.key === "ArrowDown" && index < lines.length - 1) {
            e.preventDefault();
            setActiveLineIndex(index + 1);
        }
    };

    const addLine = () => {
        if (lines[lines.length - 1].trim() !== "") {
            const newLines = [...lines, ""];
            onChange(newLines.join("\n"));
            setActiveLineIndex(newLines.length - 1);
        }
    };

    return (
        <div className="w-full space-y-2">
            <div className="space-y-0">
                <AnimatePresence initial={false}>
                    {lines.map((line, index) => (
                        <motion.div
                            key={index} // Using index as key is acceptable here as we mostly append
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative"
                        >
                            {index > 0 && (
                                <div className="flex items-center gap-2 py-2 pl-4 text-xs text-muted-foreground/70">
                                    <ArrowDown size={14} className="text-primary/50" />
                                    <span>それってどういうこと？</span>
                                </div>
                            )}

                            <div className="relative group">
                                <div className={`
                    absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 transition-all duration-300
                    ${activeLineIndex === index ? 'h-full bg-primary' : 'bg-transparent'}
                `} />

                                <input
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    value={line}
                                    onChange={(e) => updateLine(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onFocus={() => setActiveLineIndex(index)}
                                    placeholder={index === 0 ? placeholder : "さらに深掘りして具体化..."}
                                    className={`
                    w-full bg-secondary/30 text-foreground 
                    rounded-lg px-4 py-3
                    border-2 border-transparent
                    focus:border-primary/50 focus:bg-secondary/50 focus:outline-none 
                    transition-all duration-200
                    text-lg leading-relaxed
                    placeholder:text-muted-foreground/50
                    ${activeLineIndex === index ? 'shadow-lg shadow-primary/5' : ''}
                  `}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="pt-2 flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addLine}
                    className="text-muted-foreground hover:text-foreground"
                    disabled={lines[lines.length - 1].trim() === ""}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    深掘りを追加
                </Button>
            </div>
        </div>
    );
}
