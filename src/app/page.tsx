"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  Sparkles,
  Shuffle,
  History as HistoryIcon,
  ListChecks,
  ArrowRight,
  CheckCircle2,
  Brain,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { PREDEFINED_THEMES, CATEGORIES } from "@/lib/themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Interactive Before/After showcase examples
const SHOWCASE_EXAMPLES = [
  {
    id: "work",
    label: "仕事のモヤモヤ",
    theme: "なぜ今の仕事にやりがいを感じにくいのか？",
    before: "なんとなくモチベーションが上がらないし、毎日がただ過ぎていく感じがする...",
    beforeResolution: "解像度 20%",
    step1: "「指示されたタスクを消化するだけになっており、自分で仮説を立てて検証する裁量がない」",
    step2: "「なぜなら、自分は試行錯誤を通じて成果を出し、チームに新しい価値を提案することに最も喜びを感じるタイプだから」",
    after: "裁量権を持って新しい仮説検証を行う機会を自ら企画・提案する",
    afterResolution: "解像度 100%",
  },
  {
    id: "future",
    label: "将来のキャリア",
    theme: "3年後、どんな働き方をしていたいか？",
    before: "今より自由で、もっと収入も高くて、充実した生活を送っていたい...",
    beforeResolution: "解像度 25%",
    step1: "「場所に縛られず、専門性の高い領域でチームの意思決定をリードする立場になる」",
    step2: "「なぜなら、自分の専門知識で人に頼られ、成果で信頼を築く実感が一番の原動力だから」",
    after: "特定領域の技術顧問やテックリードとして、自律したリモート環境で価値を発揮する",
    afterResolution: "解像度 100%",
  },
  {
    id: "relationship",
    label: "チーム・人間関係",
    theme: "理想のリーダーシップとは何か？",
    before: "みんなから好かれて、スムーズに指示が通るような頼れる人になりたい...",
    beforeResolution: "解像度 15%",
    step1: "「相手の背景や視点を尊重し、心理的安心感のある対話の場を作ること」",
    step2: "「なぜなら、リーダー1人の視点には限界があり、メンバーの潜在能力を引き出すことがチームの総合力を最大化するから」",
    after: "メンバーが臆せず意見を発信できる心理的安全性を担保し、強みを掛け合わせる",
    afterResolution: "解像度 100%",
  },
];

export default function Home() {
  const router = useRouter();
  const historyCount = useLiveQuery(() => db.trainings.count(), []);
  const recentTraining = useLiveQuery(() => db.trainings.orderBy("createdAt").reverse().first(), []);
  const [activeExampleTab, setActiveExampleTab] = useState(0);

  const handleRandomStart = () => {
    const randomTheme = PREDEFINED_THEMES[Math.floor(Math.random() * PREDEFINED_THEMES.length)];
    router.push(`/training?theme=${encodeURIComponent(randomTheme)}`);
  };

  const activeExample = SHOWCASE_EXAMPLES[activeExampleTab];

  return (
    <div className="min-h-screen bg-background text-foreground ambient-bg flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-28 pb-20">
        <div className="max-w-4xl w-full space-y-16 sm:space-y-24">

          {/* ================= HERO SECTION ================= */}
          <section className="text-center space-y-6 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              思考の解像度を上げる 2分間トレーニング
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900"
            >
              <span className="block text-slate-900">言葉にすれば、</span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700">思考は現実になる。</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              「なんとなく」感じているモヤモヤを、明確で説得力のある言葉に。
              <br className="hidden sm:block" />
              「どう思う？」と「なぜ？」を繰り返す2分間の自問自答で、思考の解像度を極限まで高めます。
            </motion.p>

            {/* Main Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-base sm:text-lg rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                onClick={() => router.push("/training")}
              >
                <PenTool className="mr-2 h-5 w-5" />
                トレーニングを始める (2分)
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 px-6 text-base rounded-2xl border-slate-300 hover:bg-slate-50 bg-white text-slate-800 shadow-xs transition-all gap-2 font-semibold"
                onClick={handleRandomStart}
              >
                <Shuffle className="h-4 w-4 text-indigo-600" />
                おまかせ出題で即スタート
              </Button>
            </motion.div>

            {/* Quick Links / Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center gap-6 pt-2 text-xs sm:text-sm text-slate-500 font-medium"
            >
              <Link href="/questions" className="hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors">
                <ListChecks size={15} className="text-indigo-600" />
                全500問のお題ライブラリ
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/history" className="hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors">
                <HistoryIcon size={15} className="text-indigo-600" />
                過去の思考ログを見る
                {typeof historyCount === "number" && historyCount > 0 && (
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                    {historyCount}
                  </span>
                )}
              </Link>
            </motion.div>
          </section>

          {/* ================= RECENT ACTIVITY BANNER (if any) ================= */}
          {recentTraining && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <Brain size={20} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    前回の言語化トレーニング
                  </div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {recentTraining.theme}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/training?theme=${encodeURIComponent(recentTraining.theme)}`)}
                  className="rounded-xl border-slate-300 text-xs h-9 hover:bg-slate-50 text-slate-700 shadow-xs"
                >
                  再トレーニング
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/history")}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs h-9 font-medium"
                >
                  履歴で確認
                </Button>
              </div>
            </motion.div>
          )}

          {/* ================= INTERACTIVE SHOWCASE: BEFORE & AFTER ================= */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                <Sparkles size={14} />
                言語化で起こる変化
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                「なんとなく」が「確信」に変わる瞬間
              </h2>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                言葉の解像度が上がると、自ずと取るべき行動とブレない軸が見えてきます。
              </p>
            </div>

            {/* Showcase Tabs */}
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {SHOWCASE_EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveExampleTab(idx)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border",
                    activeExampleTab === idx
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Showcase Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  お題例
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {activeExample.theme}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* Before Card */}
                <div className="rounded-xl p-5 bg-rose-50/60 border border-rose-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                        BEFORE: 思考前のモヤモヤ
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-medium">
                        {activeExample.beforeResolution}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                      “{activeExample.before}”
                    </p>
                  </div>
                  <div className="text-[11px] text-rose-700 pt-2 border-t border-rose-200 font-medium">
                    ⚠️ 曖昧で具体性がなく、次の行動に繋がらない
                  </div>
                </div>

                {/* After Card */}
                <div className="rounded-xl p-5 bg-emerald-50/60 border border-emerald-300 space-y-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        AFTER: 2分間の言語化後
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        {activeExample.afterResolution}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-emerald-950 leading-relaxed">
                      “{activeExample.after}”
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-emerald-200 text-xs text-slate-600">
                    <div className="text-[10px] text-emerald-800 font-bold">深掘りの軌跡：</div>
                    <div className="text-[11px] line-clamp-1">Step 1: {activeExample.step1}</div>
                    <div className="text-[11px] line-clamp-1">Step 2: {activeExample.step2}</div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <Button
                  onClick={() => router.push(`/training?theme=${encodeURIComponent(activeExample.theme)}`)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs h-9 gap-1.5 font-semibold shadow-xs"
                >
                  このテーマで今すぐ言語化してみる
                  <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          </section>

          {/* ================= 3 STEPS METHODOLOGY ================= */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                <Zap size={14} />
                シンプルで本質的なメソッド
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                2分で解像度を高める3ステップ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  step: "01",
                  title: "思考の吐き出し",
                  prompt: "「どう思う？」",
                  desc: "頭に浮かんだ思いを直感で入力。「それってどういうこと？」と自問自答を重ねて具体化します。",
                  tagColor: "text-indigo-700 bg-indigo-50 border border-indigo-200",
                },
                {
                  step: "02",
                  title: "理由の深掘り",
                  prompt: "「なぜそう思う？」",
                  desc: "導いた思考に対して理由を問いかけます。「〜だから」と根本的な動機や価値観を明らかにします。",
                  tagColor: "text-sky-700 bg-sky-50 border border-sky-200",
                },
                {
                  step: "03",
                  title: "言語化と蓄積",
                  prompt: "「言葉の結晶化」",
                  desc: "思考と理由が揃ったとき、言葉は相手に伝わり行動に変わります。履歴に保存し成長を実感できます。",
                  tagColor: "text-emerald-700 bg-emerald-50 border border-emerald-200",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-slate-300">{item.step}</span>
                      <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full", item.tagColor)}>
                        {item.prompt}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= CATEGORY SHORTCUTS ================= */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">どのお題から始めますか？</h2>
              <p className="text-slate-600 text-sm">
                気になるカテゴリを選んで、思考の深掘りを体験してみましょう。
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/questions?category=${encodeURIComponent(cat)}`}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shadow-xs"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                onClick={() => router.push("/training")}
                className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-md shadow-indigo-500/20"
              >
                今すぐトレーニングを始める
              </Button>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-600">Gengoka — 思考の解像度を上げる言語化トレーニング</p>
          <p className="text-[11px] text-slate-400">2分間の集中的な自問自答で、思考を言葉へ。</p>
        </div>
      </footer>
    </div>
  );
}
