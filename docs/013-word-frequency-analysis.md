# チケット #013: 単語集計・可視化機能

## 概要
期間ごとの頻出単語を棒グラフやワードクラウドで可視化する機能

## 受け入れ条件
- 週/月/年単位での集計
- ワードクラウド表示
- 棒グラフ表示
- 除外単語の設定（助詞、接続詞など）
- CSVエクスポート機能

## 技術要件

### 必要なライブラリ
```json
{
  "dependencies": {
    "react-wordcloud": "^1.2.7",
    "recharts": "^2.5.0",
    "kuromoji": "^0.1.2"  // 日本語形態素解析
  }
}
```

### データ構造
```typescript
interface WordFrequency {
  word: string;
  count: number;
  firstAppearance: Date;
  contexts: string[]; // 使用された文脈
}

interface WordAnalysisResult {
  period: {
    start: Date;
    end: Date;
    type: 'week' | 'month' | 'year';
  };
  totalWords: number;
  uniqueWords: number;
  topWords: WordFrequency[];
  trends: {
    increasing: string[];  // 増加傾向の単語
    decreasing: string[];  // 減少傾向の単語
    new: string[];        // 新出単語
  };
}
```

### 形態素解析
```typescript
import kuromoji from 'kuromoji';

const analyzeText = async (text: string): Promise<string[]> => {
  const tokenizer = await loadTokenizer();
  const tokens = tokenizer.tokenize(text);
  
  return tokens
    .filter(token => {
      // 名詞、動詞、形容詞のみ抽出
      return ['名詞', '動詞', '形容詞'].includes(token.pos);
    })
    .filter(token => {
      // ストップワードを除外
      return !STOP_WORDS.includes(token.surface_form);
    })
    .map(token => token.basic_form || token.surface_form);
};
```

### ワードクラウド表示
```typescript
import ReactWordcloud from 'react-wordcloud';

const WordCloudView: React.FC<{ words: WordFrequency[] }> = ({ words }) => {
  const data = words.map(w => ({
    text: w.word,
    value: w.count
  }));
  
  const options = {
    rotations: 0,
    fontSizes: [12, 60],
    colors: ['#FFE4B5', '#FFD4E5', '#D4E5FF', '#E5D4FF'],
  };
  
  return <ReactWordcloud words={data} options={options} />;
};
```

### 棒グラフ表示
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const FrequencyChart: React.FC<{ data: WordFrequency[] }> = ({ data }) => {
  const chartData = data.slice(0, 20).map(d => ({
    word: d.word,
    count: d.count
  }));
  
  return (
    <BarChart width={800} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="word" angle={-45} textAnchor="end" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#B8E0FF" />
    </BarChart>
  );
};
```

## UI設計
```
[単語分析]

期間選択: [週] [月] [年]
期間: [2024年1月] [<] [>]

表示形式: [ワードクラウド] [棒グラフ] [表]

┌─────────────────────────────┐
│   [ワードクラウド表示]       │
│     仕事  プロジェクト       │
│   会議  成長  挑戦          │
│     チーム  目標            │
└─────────────────────────────┘

トレンド:
📈 増加: "成長", "挑戦", "学習"
📉 減少: "不安", "疲れ"
✨ 新出: "プロモーション", "リーダー"

[CSVエクスポート]
```

## タスクリスト
- [ ] 形態素解析の導入
- [ ] 単語集計サービス
- [ ] ワードクラウドコンポーネント
- [ ] 棒グラフコンポーネント
- [ ] 期間選択UI
- [ ] トレンド分析機能
- [ ] エクスポート機能