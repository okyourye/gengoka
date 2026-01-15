"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, BookOpen } from "lucide-react";
import { useState } from "react";

interface HintSectionProps {
    step: number;
}

export function HintSection({ step }: HintSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full max-w-sm ml-0 lg:ml-8 mt-8 lg:mt-0">
            <div className="bg-secondary/20 rounded-xl border border-white/5 overflow-hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/40 transition-colors"
                >
                    <div className="flex items-center gap-2 font-medium">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <span>ヒント & 実例</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{isOpen ? "閉じる" : "開く"}</span>
                </button>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 space-y-6 text-sm text-muted-foreground">
                                <section>
                                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                        <BookOpen className="w-3 h-3" />
                                        実例: 理想の上司に必要なこと
                                    </h4>

                                    {step === 1 ? (
                                        <div className="space-y-3 pl-2 border-l-2 border-primary/20">
                                            <div>
                                                <p className="text-xs mb-1">1. まず思い浮かんだこと</p>
                                                <p className="text-foreground">「チームメンバーの意見を聞く」</p>
                                            </div>
                                            <div>
                                                <p className="text-xs mb-1">↓ それってどういうこと？</p>
                                                <p className="text-foreground">「相手の意見を否定しない」</p>
                                            </div>
                                            <div>
                                                <p className="text-xs mb-1">↓ つまり？</p>
                                                <p className="text-foreground">「相手を年齢や社歴で判断しない」</p>
                                            </div>
                                            <div className="font-medium text-primary">
                                                <p className="text-xs mb-1">↓ 解像度が高い言葉</p>
                                                <p>「相手の視点を尊重する」</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 pl-2 border-l-2 border-primary/20">
                                            <p className="mb-2 italic border-b border-white/5 pb-2">対象: 「相手の視点を尊重する」</p>
                                            <div>
                                                <p className="text-xs mb-1">1. なぜそう思う？</p>
                                                <p className="text-foreground">「上司一人の視点には限界があるから」</p>
                                            </div>
                                            <div>
                                                <p className="text-xs mb-1">↓ それってどういうこと？</p>
                                                <p className="text-foreground">「チームメンバーを活かすことがチームを強くする」</p>
                                            </div>
                                            <div>
                                                <p className="text-xs mb-1">↓ さらに深掘り</p>
                                                <p className="text-foreground">「尊重し合うことで人間関係のストレスも減る」</p>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <h4 className="font-bold text-foreground mb-2">💡 コツ</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>「書きながら考える」感覚でOK</li>
                                        <li>最後の1行に対して「それってどういうこと？」と問いかける</li>
                                        <li>あえて反対意見も考えてみる（視野が広がる）</li>
                                    </ul>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
