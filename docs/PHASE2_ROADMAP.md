# Phase 2 ロードマップ - 日記アプリ拡張機能

## 概要
Phase 1（MVP）完成後の拡張機能群。より深い自己理解と長期的な成長支援を目的とした高度な機能セット。

## 機能一覧と優先度

### 🎯 高優先度（推奨実装順序）

#### 1. チケット#016: 対話形式日記作成アシスタント
- **価値**: 日記作成のハードルを下げる
- **実装難易度**: 中
- **推定工数**: 3-4日
- **必要技術**: 既存のGemini API活用

#### 2. チケット#012: 感情分析機能
- **価値**: 感情の可視化で自己理解促進
- **実装難易度**: 低〜中
- **推定工数**: 2-3日
- **必要技術**: Gemini API + UIの拡張

### 📊 中優先度（データ分析系）

#### 3. チケット#013: 単語集計・可視化機能
- **価値**: 関心事の変化を可視化
- **実装難易度**: 中
- **推定工数**: 3-4日
- **必要技術**: 形態素解析ライブラリ、グラフライブラリ

#### 4. チケット#014: 感情傾向の可視化
- **価値**: 長期的な感情パターンの把握
- **実装難易度**: 中
- **推定工数**: 2-3日
- **必要技術**: Recharts、データ集計ロジック
- **前提**: チケット#012の完成

### 🚀 低優先度（高度な機能）

#### 5. チケット#011: 過去の自分との対話モード
- **価値**: 深い内省と成長の確認
- **実装難易度**: 高
- **推定工数**: 4-5日
- **必要技術**: 大量データのコンテキスト管理

#### 6. チケット#015: マインドマップ統合・人生俯瞰
- **価値**: 人生全体の可視化
- **実装難易度**: 高
- **推定工数**: 5-7日
- **必要技術**: 大規模データの可視化、パフォーマンス最適化

## 技術スタック追加

### 必要なライブラリ
```json
{
  "dependencies": {
    // グラフ・可視化
    "recharts": "^2.5.0",          // グラフ表示
    "react-wordcloud": "^1.2.7",   // ワードクラウド
    "d3": "^7.8.0",                // 高度な可視化
    
    // 自然言語処理
    "kuromoji": "^0.1.2",          // 日本語形態素解析
    "wanakana": "^5.1.0",          // 日本語処理ヘルパー
    
    // パフォーマンス
    "react-window": "^1.8.8",      // 仮想スクロール
    "lodash": "^4.17.21",          // ユーティリティ
    
    // 3D表示（オプション）
    "three": "^0.150.0",           // 3Dグラフィックス
    "@react-three/fiber": "^8.0.0" // React用Three.js
  }
}
```

## 実装計画

### Phase 2.1（2週間）
1. **Week 1**: チケット#016（対話アシスタント）
2. **Week 2**: チケット#012（感情分析）

### Phase 2.2（2週間）
1. **Week 3**: チケット#013（単語集計）
2. **Week 4**: チケット#014（感情傾向）

### Phase 2.3（2週間）
1. **Week 5**: チケット#011（過去の自分との対話）
2. **Week 6**: チケット#015の基礎実装

## データベース設計（将来の本番環境用）

```sql
-- 感情分析データ
CREATE TABLE emotion_analyses (
  id UUID PRIMARY KEY,
  node_id UUID REFERENCES mindmap_nodes(id),
  emotion_type VARCHAR(50),
  confidence FLOAT,
  analyzed_at TIMESTAMP
);

-- 単語頻度データ
CREATE TABLE word_frequencies (
  id UUID PRIMARY KEY,
  word VARCHAR(100),
  count INTEGER,
  period_start DATE,
  period_end DATE,
  user_id UUID REFERENCES users(id)
);

-- 対話履歴
CREATE TABLE conversation_histories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  messages JSONB,
  generated_diary_id UUID REFERENCES diary_entries(id),
  created_at TIMESTAMP
);
```

## API設計（バックエンド実装時）

```typescript
// 新規エンドポイント
POST   /api/diary/assist        // 対話アシスタント
POST   /api/analyze/emotion     // 感情分析
GET    /api/analyze/words       // 単語集計
GET    /api/analyze/trends      // 感情傾向
POST   /api/dialogue/past-self  // 過去の自分との対話
GET    /api/mindmap/integrated  // 統合マインドマップ
```

## パフォーマンス考慮事項

### データ量の増加への対策
1. **ページネーション**: 大量データの分割読み込み
2. **キャッシング**: 頻繁にアクセスするデータのキャッシュ
3. **インデックス**: 検索性能の向上
4. **遅延読み込み**: 必要時のみデータ取得
5. **Web Worker**: 重い処理のバックグラウンド実行

### 最適化のポイント
```typescript
// 仮想スクロール例
import { FixedSizeList } from 'react-window';

const VirtualizedDiaryList = ({ entries }) => (
  <FixedSizeList
    height={600}
    itemCount={entries.length}
    itemSize={100}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <DiaryCard entry={entries[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

## セキュリティ考慮事項

### Phase 2で追加される懸念点
1. **大量データの処理**: DoS攻撃の可能性
2. **感情データ**: センシティブ情報の保護
3. **AIコンテキスト**: プロンプトインジェクション対策

### 対策
- レート制限の実装
- データの暗号化
- 入力値検証の強化
- プロンプトのサニタイゼーション

## まとめ

Phase 2は、MVPを基盤として、より高度な自己分析と成長支援機能を追加します。
実装は段階的に行い、各機能の価値を検証しながら進めることを推奨します。

優先度の高い機能から実装し、ユーザーフィードバックを収集しながら改善を重ねていくアジャイルなアプローチが効果的です。