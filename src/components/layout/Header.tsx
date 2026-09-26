"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, CircleHelp, PenTool, History as HistoryIcon, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorialModal } from "@/components/feature/TutorialModal";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export function Header() {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const pathname = usePathname();
    const historyCount = useLiveQuery(() => db.trainings.count(), []);

    const navItems = [
        { href: "/training", label: "トレーニング", icon: PenTool },
        { href: "/questions", label: "お題一覧", icon: ListChecks },
        { href: "/history", label: "履歴", icon: HistoryIcon, badge: historyCount },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 max-w-6xl">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 group-hover:scale-105 group-hover:border-indigo-400 transition-all duration-300 shadow-sm">
                            <Sparkles size={18} className="transition-transform group-hover:rotate-12" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800">
                                Gengoka
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">思考の解像度を上げる</span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "text-indigo-700 bg-indigo-50 border border-indigo-200 font-semibold shadow-xs"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    )}
                                >
                                    <Icon size={15} className={cn(isActive ? "text-indigo-600" : "text-slate-500")} />
                                    <span className={item.href === "/training" ? "hidden md:inline" : ""}>{item.label}</span>
                                    {typeof item.badge === "number" && item.badge > 0 && (
                                        <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsTutorialOpen(true)}
                            className="text-muted-foreground hover:text-foreground gap-1.5 px-2.5 h-8 text-xs sm:text-sm rounded-lg"
                            aria-label="使い方を開く"
                        >
                            <CircleHelp size={16} aria-hidden="true" />
                            <span className="hidden sm:inline">使い方</span>
                        </Button>
                    </nav>
                </div>
            </header>

            <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
        </>
    );
}
