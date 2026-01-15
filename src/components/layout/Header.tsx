import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Sparkles size={18} />
                    </div>
                    <span className="font-bold tracking-tight text-lg">Gengoka</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link
                        href="/about"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
}
