
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/10 bg-background/50 backdrop-blur-md">
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <Sparkles size={18} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Gengoka</span>
                </Link>

                {/* Future controls for history or settings could go here */}
                <nav className="flex items-center gap-4">
                    {/* <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            履歴
          </Link> */}
                </nav>
            </div>
        </header>
    );
}
