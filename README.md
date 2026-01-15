# Gengoka - 言語化トレーニング

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

**言葉にすれば、思考は現実になる。**

Gengokaは、曖昧な思考を明確な言葉に変えるためのトレーニングアプリケーションです。「どう思う？」と「なぜ？」を繰り返すシンプルな2分間のトレーニングで、あなたの言語化能力（解像度）を高めます。

![Screenshot](docs/images/screenshot.png) <!-- スクリーンショットがあれば配置 -->

## ✨ 特徴

- **書きながら考える**: 思考を整理してから書くのではなく、書きながら整理する「深掘り入力」インターフェース。
- **2分間の集中**: Step 1（思考）と Step 2（理由）を合わせて合計2分間。制限時間が集中力を高めます。
- **深掘りのサポート**: 入力に対して「それってどういうこと？」と問いかけるガイドが、思考の深掘りを促します。
- **モバイルファースト**: スマートフォンでの操作に最適化されたUIで、いつでもどこでもトレーニングが可能。

## 🚀 始め方

### 必須環境
- Node.js 18.17 以降

### インストールと起動

1. リポジトリをクローンします:
   ```bash
   git clone https://github.com/okyourye/gengoka.git
   cd gengoka
   ```

2. 依存関係をインストールします:
   ```bash
   npm install
   ```

3. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```

4. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

## 🛠️ 技術スタック

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 📂 プロジェクト構成

```
src/
├── app/             # App Router pages & layouts
├── components/
│   ├── layout/      # Layout components (Header etc.)
│   ├── training/    # Training specific components (Timer, Input, etc.)
│   └── ui/          # Generic UI components (Button, etc.)
└── ...
```

## 📝 ライセンス

This project is licensed under the MIT License.
