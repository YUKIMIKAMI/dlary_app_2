# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 要件定義書

### プロジェクト概要
AIを活用した日記アプリケーション。日記を書くとマインドマップ形式で表示され、AIが生成した質問によって思考を深掘りできるツール。

### 機能要件

#### 1. 日記機能
- **日記入力**: ユーザーが日記を入力できるテキストエリア
- **日記保存**: 入力した日記を日付とともに保存
- **過去の日記閲覧**: 保存された過去の日記を一覧表示・閲覧可能
- **文字数制限**: なし
- **編集機能**: 後からの編集は不可（意図的な仕様）

#### 2. マインドマップ機能  
- **自動遷移**: 日記送信後、自動的にマインドマップ画面へ遷移
- **メインノード**: 書いた日記の内容がそのまま中央のノードに表示
- **AI質問ノード**: メインノードから3つの質問ノードが自動生成
- **階層的な深掘り**: 
  - 質問ノードをクリックすると回答入力が可能
  - 回答を入力すると、その回答から新たな質問ノードが生成
  - このプロセスを繰り返して思考を深掘り
- **コメント機能**: 後日、既存の日記ノードに対してコメントノードを追加可能（日付付き）

#### 3. データ管理
- **データ保存**: すべての日記、質問、回答、マインドマップの状態を保存
- **永続化**: ブラウザを閉じても次回アクセス時にデータが残存
- **ユーザー管理**: MVP段階では単一ユーザー用（ログイン機能なし）

### 非機能要件

#### UI/UX
- **デザイン**: パステルカラーを基調とした目に優しい色合い
- **レスポンシブ**: MVP段階ではPC向けを優先（将来的にスマホ対応予定）
- **操作性**: シンプルで直感的な操作

#### パフォーマンス
- **レスポンス**: AI質問生成は非同期処理で実行
- **データ容量**: LocalStorageの制限内で動作

### 技術スタック

#### フロントエンド
- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS（パステルカラーテーマ）
- **マインドマップ**: React Flow
- **状態管理**: React Context API + useReducer

#### バックエンド/データ
- **データ保存**: LocalStorage（MVP段階）
- **AI連携**: Google Gemini API

#### 開発環境
- **パッケージマネージャー**: npm
- **コード品質**: ESLint + Prettier
- **型チェック**: TypeScript strict mode

### ディレクトリ構造
```
diary_app_2/
├── src/
│   ├── components/        # UIコンポーネント
│   │   ├── diary/        # 日記関連
│   │   ├── mindmap/      # マインドマップ関連
│   │   └── common/       # 共通コンポーネント
│   ├── contexts/         # Context API
│   ├── hooks/            # カスタムフック
│   ├── services/         # API連携・データ処理
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ関数
│   └── styles/           # グローバルスタイル
├── public/               # 静的ファイル
└── package.json
```

### 開発フェーズ

#### Phase 1: MVP開発
1. プロジェクトセットアップ
2. 基本的な日記入力・保存機能
3. マインドマップ表示機能
4. AI質問生成機能（Google Gemini API）
5. 質問への回答と階層的深掘り機能
6. 過去の日記閲覧機能
7. コメント追加機能

#### Phase 2: 将来的な拡張（MVP後）
- ユーザー認証機能
- クラウドストレージ連携
- スマートフォン対応
- データエクスポート機能
- タグ・カテゴリー機能

## Development Commands

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
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

## 環境変数

```env
# .env.local
VITE_GEMINI_API_KEY=your_api_key_here
```

## 開発時の注意事項

1. **APIキー管理**: Gemini APIキーは環境変数で管理し、コミットしない
2. **LocalStorage容量**: 5MB制限があるため、データ量に注意
3. **エラーハンドリング**: AI API呼び出し失敗時のフォールバック処理を実装
4. **パフォーマンス**: マインドマップのノード数が増えた際のレンダリング最適化

## タスク管理

開発タスクは `/docs` ディレクトリ内のチケットファイルで管理されています。

### チケット一覧
- 001-project-setup.md - プロジェクト初期セットアップ
- 002-diary-input-feature.md - 日記入力機能
- 003-mindmap-display.md - マインドマップ表示機能
- 004-ai-question-generation.md - AI質問生成機能
- 005-question-answer-feature.md - 質問への回答機能
- 006-diary-history.md - 過去の日記閲覧機能
- 007-comment-feature.md - コメント追加機能
- 008-settings-page.md - 設定画面
- 009-error-handling.md - エラーハンドリング
- 010-performance-optimization.md - パフォーマンス最適化

### タスク進捗管理
各チケット内のタスクは以下の形式で管理：
- `- [ ]` : 未完了のタスク
- `- [x]` : 完了したタスク

タスク完了時は必ず `[ ]` を `[x]` に更新すること。

## ベストプラクティス

### コーディング規約

#### TypeScript
- **strict mode**: 常に有効化し、型安全性を確保
- **型定義**: anyの使用を避け、明示的な型定義を行う
- **インターフェース**: データ構造はinterfaceで定義
- **Enum**: 定数はEnumまたはas constで管理

```typescript
// Good
interface DiaryEntry {
  id: string;
  content: string;
  createdAt: Date;
  mindMapData?: MindMapNode;
}

// Bad
const entry: any = { ... };
```

#### React
- **関数コンポーネント**: クラスコンポーネントは使用しない
- **カスタムフック**: ロジックの再利用はカスタムフックで実装
- **メモ化**: React.memo, useMemo, useCallbackを適切に使用
- **key属性**: リストレンダリングでは必ず一意のkeyを指定

```typescript
// Good
const DiaryList: React.FC<Props> = React.memo(({ entries }) => {
  const sortedEntries = useMemo(
    () => entries.sort((a, b) => b.createdAt - a.createdAt),
    [entries]
  );
  
  return (
    <>
      {sortedEntries.map(entry => (
        <DiaryItem key={entry.id} {...entry} />
      ))}
    </>
  );
});
```

### 状態管理

#### Context API使用方針
- **分割**: 機能ごとにContextを分割（DiaryContext, MindMapContext）
- **最適化**: 頻繁に更新される状態は別Contextに分離
- **カスタムフック**: useContext直接使用を避け、カスタムフックでラップ

```typescript
// Good
const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within DiaryProvider');
  }
  return context;
};
```

### データ永続化

#### LocalStorage
- **JSON化**: 保存時は必ずJSON.stringifyを使用
- **エラーハンドリング**: try-catchで必ずラップ
- **データ検証**: 読み込み時はスキーマ検証を実施
- **容量監視**: 定期的にサイズをチェック

```typescript
// Good
const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  try {
    const serialized = JSON.stringify(data);
    if (serialized.length > 4 * 1024 * 1024) { // 4MB制限
      console.warn('Data size approaching LocalStorage limit');
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save to LocalStorage:', error);
    return false;
  }
};
```

### AI API連携

#### Gemini API
- **レート制限**: 適切なディレイとリトライ機構を実装
- **タイムアウト**: 30秒のタイムアウトを設定
- **フォールバック**: API失敗時は事前定義の質問を表示
- **キャッシュ**: 同一内容への質問生成はキャッシュから取得

```typescript
// Good
const generateQuestions = async (content: string): Promise<string[]> => {
  const cacheKey = hashContent(content);
  const cached = questionCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      geminiAPI.generateQuestions(content),
      30000
    );
    questionCache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error('AI API failed, using fallback questions');
    return getFallbackQuestions(content);
  }
};
```

### パフォーマンス最適化

#### マインドマップ
- **仮想化**: 100ノード以上は仮想スクロールを実装
- **遅延レンダリング**: 視界外のノードは簡略表示
- **バッチ更新**: 複数ノードの更新はバッチ処理
- **Web Worker**: 重い計算処理は別スレッドで実行

#### 画像・アセット
- **遅延読み込み**: Intersection Observerで実装
- **最適化**: SVGアイコンを使用、画像は適切に圧縮

### セキュリティ

#### XSS対策
- **サニタイズ**: ユーザー入力は必ずサニタイズ
- **dangerouslySetInnerHTML**: 使用を避ける
- **Content Security Policy**: 適切に設定

#### APIキー保護
- **環境変数**: 本番環境では環境変数から読み込み
- **プロキシ**: 可能であればバックエンドプロキシ経由でAPI呼び出し

### テスト方針

#### 単体テスト
- **カバレッジ**: ビジネスロジックは80%以上
- **モック**: API呼び出しは必ずモック化
- **スナップショット**: UIコンポーネントはスナップショットテスト

#### 統合テスト
- **E2E**: 主要なユーザーフローはE2Eテストでカバー
- **データ**: テストデータは固定値を使用

### アクセシビリティ

- **ARIA**: 適切なARIA属性を設定
- **キーボード**: すべての機能がキーボードで操作可能
- **色彩**: コントラスト比はWCAG AA基準を満たす
- **スクリーンリーダー**: 重要な情報は適切にアナウンス

### エラーハンドリング

- **Error Boundary**: Reactコンポーネントツリー全体をラップ
- **ユーザー通知**: エラーは分かりやすいメッセージで表示
- **ログ**: 本番環境ではSentryなどにエラーを送信
- **リカバリー**: 可能な限り自動リカバリーを実装