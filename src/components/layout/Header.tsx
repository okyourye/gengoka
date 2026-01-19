"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorialModal } from "@/components/feature/TutorialModal";

export function Header() {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);

    // Show tutorial automatically on first visit?
    // For now, only manual trigger as per task breakdown implies "button click".

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/10 bg-background/50 backdrop-blur-md">
                <div className="container mx-auto flex h-full items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <Sparkles size={18} />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Gengoka</span>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsTutorialOpen(true)}
                            className="text-muted-foreground hover:text-primary gap-2"
                        >
                            <CircleHelp size={18} />
                            <span className="hidden md:inline">使い方</span>
                        </Button>
                        {/* <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors ml-4">
                            履歴
                        </Link> */}
                    </nav>
                </div>
            </header>

            <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
        </>
    );
}
