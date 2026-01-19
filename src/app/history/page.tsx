
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Download, History as HistoryIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
    const router = useRouter();
    const trainings = useLiveQuery(() => db.trainings.orderBy('createdAt').reverse().toArray());

    const handleDelete = async (id: number) => {
        if (confirm("この履歴を削除しますか？")) {
            await db.trainings.delete(id);
        }
    };

    const handleExport = () => {
        if (!trainings) return;
        const dataStr = JSON.stringify(trainings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'gengoka-history.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (!trainings) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background">
            <Header />

            <main className="container mx-auto p-4 py-12 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <HistoryIcon className="text-primary" />
                            トレーニング履歴
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport} disabled={trainings.length === 0}>
                            <Download className="mr-2 h-4 w-4" />
                            JSON出力
                        </Button>
                    </div>
                </div>

                {trainings.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-card/30 rounded-xl border border-dashed border-border">
                        <p>まだ履歴がありません。</p>
                        <Button className="mt-4" onClick={() => router.push("/training")}>
                            トレーニングを始める
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trainings.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="bg-card/50 hover:bg-card/80 transition-colors border-primary/10">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(session.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <CardTitle className="text-xl mt-1">{session.theme}</CardTitle>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id!)} className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-2">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-secondary/20 rounded text-sm">
                                                <div className="text-xs font-semibold text-primary mb-1">思考</div>
                                                {session.step1_thought}
                                            </div>
                                            <div className="p-3 bg-secondary/20 rounded text-sm">
                                                <div className="text-xs font-semibold text-primary mb-1">理由</div>
                                                {session.step2_reason}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
