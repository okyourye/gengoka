"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 pt-24 text-center">
        <div className="max-w-3xl w-full space-y-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              思考の解像度を上げる
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-foreground">言葉にすれば、</span>
              <span className="block mt-2 text-gradient">思考は現実になる。</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              「なんとなく」感じていることを、明確な言葉に。
              <br className="hidden md:block" />
              2分間の集中的な自問自答で、あなたの思考を深掘りします。
            </p>
          </motion.div>

          {/* Action Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_-5px_var(--color-primary)] transition-all hover:scale-105" onClick={() => router.push("/training")}>
              <PenTool className="mr-2 h-5 w-5" />
              トレーニングを始める
            </Button>

            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 bg-black/20 backdrop-blur-sm text-foreground hover:text-primary transition-colors" onClick={() => router.push("/history")}>
              履歴を見る
            </Button>
          </motion.div>

          {/* Feature Grid (Optional decorative) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left"
          >
            {[
              { title: "思考", desc: "思い浮かんだことを直感的に書き出す" },
              { title: "深掘り", desc: "「なぜ？」を問いかけ本質に迫る" },
              { title: "記録", desc: "日々の思考の軌跡を蓄積する" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl glass-card hover:bg-white/5 transition-colors">
                <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </main>
    </div>
  );
}
