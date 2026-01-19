# 言語化トレーニングアプリ 実装計画

## 概要
ユーザーが「どう思うか」「なぜそう思うか」を自問自答しながら、制限時間内に言語化能力をトレーニングするためのWebアプリケーション。

## 技術スタック
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion (プレミアムな体験のため)
- **State Management**: React Context or Zustand (トレーニング状態管理)

## 実装ステップ

### 1. プロジェクトセットアップ
- `create-next-app` でプロジェクト初期化
- 必要なライブラリのインストール
    - `lucide-react`: アイコン
    - `framer-motion`: アニメーション
    - `clsx`, `tailwind-merge`: スタイリングユーティリティ
    - `dexie`, `dexie-react-hooks`: IndexedDBラッパー

### 2. データ永続化 (IndexedDB)
- **Library**: `Dexie.js` を使用して、ブラウザ内のIndexedDBを簡単に操作する。
- **Schema**:
    - `trainings` store
        - `id`: number (auto-increment)
        - `theme`: string
        - `step1_thought`: string (思考)
        - `step2_reason`: string (理由)
        - `createdAt`: Date
- **Backup**: 将来的なエクスポート機能を見越して、全データをJSONとしてダウンロードできるユーティリティを用意する。

### 3. コンポーネント設計
#### Layout
- `MainLayout`: ヘッダー、フッターを含む基本レイアウト。

#### Training Module
- `TrainingContainer`: ステート管理と画面遷移を制御。
- `Timer`: 2分間のカウントダウンと視覚的フィードバック。
- `QuestionCard`: 「どう思う？」「なぜ？」の問いかけ表示。
- `InputArea`: ユーザーの入力を受け付ける。書きながら考えるためのUX。
- `HintSidebar`: ヒントや「実例」を表示するサイドバーまたはモーダル。

### 3. データフロー
1. **Theme Selection**: テーマ決定（またはランダム生成）。
2. **Phase 1 (Thinking)**: 
    - 問い: "どう思う？どう感じる？"
    - タイマー開始。
    - 入力。
3. **Phase 2 (Reasoning)**:
    - 問い: "なぜそう思う？"
    - 直前の入力を参照表示。
    - 入力。
4. **Review**:
    - 全体の振り返り。
    - 「解像度」についてのフィードバック（静的なアドバイス）。

## UI/UX デザイン方針
- **Premium & Focus**: 集中できるシンプルかつ美しいデザイン。
- **Dynamic**: 入力に対するフィードバックやフェーズ移行時のスムーズなアニメーション。
- **Typography**: 可読性の高いフォント設定。

## 検証計画
- ローカル環境(`localhost:3000`)での動作確認。
- 各フェーズの制限時間動作テスト。
- レスポンシブ確認。
- ユーザー入力のスムーズさの確認。
