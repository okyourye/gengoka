"use client";

import { motion } from "framer-motion";
import { ArrowRight, PenLine, Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">


      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-white/5 text-xs font-medium text-muted-foreground mb-4"
          >
            <SparklesIcon className="w-3 h-3 text-yellow-400" />
            <span>言語化能力を鍛える2分間のトレーニング</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 pb-2">
            言葉にすれば、<br />思考は現実になる。
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
            曖昧な思考を明確な言葉へ。<br />
            「どう思う？」と「なぜ？」を繰り返す<br />
            シンプルな習慣が、あなたの発信力を変えます。
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="group text-base px-8 h-14" onClick={() => window.location.href = "/training"}>
            トレーニングを始める
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left"
        >
          <FeatureCard
            icon={<PenLine className="w-5 h-5" />}
            title="書きながら考える"
            desc="頭の中だけで完結させず、アウトプットしながら思考を整理します。"
          />
          <FeatureCard
            icon={<Brain className="w-5 h-5" />}
            title="深掘りする"
            desc="「なぜ？」を問いかけ、表面的な意見から本質的な考えへ到達します。"
          />
          <FeatureCard
            icon={<Lightbulb className="w-5 h-5" />}
            title="解像度を上げる"
            desc="曖昧な表現を具体的な言葉に変え、相手に伝わる力を養います。"
          />
        </motion.div>
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-bold mb-2 text-foreground/90">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
