# チケット #009: エラーハンドリングとユーザー通知

## 概要
アプリケーション全体のエラーハンドリングとユーザーへの通知システムの実装

## 受け入れ条件
- エラーが発生してもアプリケーションがクラッシュしないこと
- ユーザーに分かりやすいエラーメッセージが表示されること
- 成功・警告・エラーの通知が適切に表示されること
- エラーログが開発時に確認できること

## タスクリスト

### Error Boundary
- [ ] ErrorBoundaryコンポーネントの作成
- [ ] エラー画面のデザイン実装
- [ ] リカバリーボタンの実装
- [ ] エラーログの記録

### 通知システム
- [ ] Toastコンポーネントの作成
- [ ] 通知のタイプ別スタイリング（成功・警告・エラー・情報）
- [ ] 自動消去タイマー機能
- [ ] 通知のスタック表示

### APIエラー処理
- [ ] Gemini APIエラーのハンドリング
- [ ] ネットワークエラーの処理
- [ ] タイムアウトエラーの処理
- [ ] レート制限エラーの処理

### LocalStorageエラー
- [ ] 容量超過エラーの処理
- [ ] データ破損時の処理
- [ ] 読み込みエラーの処理
- [ ] フォールバック処理

### ユーザーフレンドリーメッセージ
- [ ] エラーコードとメッセージのマッピング
- [ ] 日本語エラーメッセージの定義
- [ ] 解決方法の提案表示

## 技術的詳細

### エラータイプ定義
```typescript
enum ErrorType {
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}
```

### 通知コンポーネント
```typescript
interface ToastProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  duration?: number;  // デフォルト: 5000ms
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### エラーメッセージマッピング
```typescript
const errorMessages = {
  API_KEY_INVALID: 'APIキーが無効です。設定画面で確認してください。',
  API_RATE_LIMIT: 'API呼び出し回数の上限に達しました。しばらく待ってから再試行してください。',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。接続を確認してください。',
  STORAGE_FULL: 'ローカルストレージの容量が不足しています。古いデータを削除してください。',
  // ...
};
```

### Toast表示位置とスタイル
```css
/* 右上に表示 */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

/* 成功 */
.toast-success {
  background: #C8E6C9;  /* パステルグリーン */
  border-left: 4px solid #4CAF50;
}

/* エラー */
.toast-error {
  background: #FFCDD2;  /* パステルレッド */
  border-left: 4px solid #F44336;
}
```

## 依存関係
- すべての機能チケットと連携

## 備考
- エラーは本番環境でも適切にログ記録
- 開発環境ではコンソールに詳細情報を出力
- 重大なエラーは将来的に外部サービスに送信