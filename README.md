# 日記アプリ

AIを活用した日記アプリケーション。日記を書くとマインドマップ形式で表示され、AIが生成した質問によって思考を深掘りできるツールです。

## 機能

- 📝 日記の入力・保存
- 🧠 マインドマップ形式での表示
- 🤖 AI（Google Gemini）による質問生成
- 💭 質問への回答で思考を深掘り
- 📅 過去の日記閲覧
- 💬 日記へのコメント追加

## 技術スタック

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (パステルカラーテーマ)
- **Mind Map**: React Flow
- **AI**: Google Gemini API
- **Data Storage**: LocalStorage

## セットアップ

### 必要要件

- Node.js 18以上
- npm

### インストール

```bash
# 依存関係のインストール
npm install
```

### 環境変数の設定

1. `.env.local.example`を`.env.local`にコピー
2. Google Gemini APIキーを設定

```bash
cp .env.local.example .env.local
```

`.env.local`を編集:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run type-check

# リント
npm run lint

# フォーマット
npm run format
```

## プロジェクト構造

```
src/
├── components/        # UIコンポーネント
│   ├── diary/        # 日記関連
│   ├── mindmap/      # マインドマップ関連
│   └── common/       # 共通コンポーネント
├── contexts/         # Context API
├── hooks/            # カスタムフック
├── services/         # API連携・データ処理
├── types/            # TypeScript型定義
├── utils/            # ユーティリティ関数
└── styles/           # グローバルスタイル
```

## ライセンス

MIT