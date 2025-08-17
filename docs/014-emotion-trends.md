# チケット #014: 感情傾向の可視化機能

## 概要
期間ごとの感情の変化を時系列グラフで可視化し、感情の傾向を分析する機能

## 受け入れ条件
- 週/月/年単位での感情推移グラフ
- 感情の円グラフ（構成比）
- 感情スコアの推移（ポジティブ/ネガティブ）
- 特定の感情が強い日のハイライト

## 技術要件

### データ構造
```typescript
interface EmotionTrend {
  date: Date;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    anticipation: number;
    trust: number;
    disgust: number;
  };
  dominantEmotion: EmotionType;
  positivityScore: number; // -1 to 1
  entries: string[]; // 関連する日記ID
}

interface EmotionSummary {
  period: { start: Date; end: Date };
  averagePositivity: number;
  emotionDistribution: Record<EmotionType, number>;
  peakEmotions: {
    happiest: { date: Date; score: number };
    saddest: { date: Date; score: number };
  };
  insights: string[]; // AI生成の洞察
}
```

### 感情スコア計算
```typescript
const calculatePositivityScore = (emotions: EmotionAnalysis[]): number => {
  const positive = ['joy', 'anticipation', 'trust'];
  const negative = ['sadness', 'anger', 'fear', 'disgust'];
  
  let positiveSum = 0;
  let negativeSum = 0;
  
  emotions.forEach(e => {
    if (positive.includes(e.primary)) {
      positiveSum += e.confidence;
    } else if (negative.includes(e.primary)) {
      negativeSum += e.confidence;
    }
  });
  
  const total = positiveSum + negativeSum;
  return total > 0 ? (positiveSum - negativeSum) / total : 0;
};
```

### 時系列グラフ
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const EmotionTimelineChart: React.FC<{ data: EmotionTrend[] }> = ({ data }) => {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="emotions.joy" stroke="#FFD700" name="喜び" />
      <Line type="monotone" dataKey="emotions.sadness" stroke="#4169E1" name="悲しみ" />
      <Line type="monotone" dataKey="emotions.anger" stroke="#DC143C" name="怒り" />
      <Line type="monotone" dataKey="emotions.fear" stroke="#8B008B" name="恐れ" />
    </LineChart>
  );
};
```

### 感情の円グラフ
```typescript
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const EmotionPieChart: React.FC<{ data: Record<EmotionType, number> }> = ({ data }) => {
  const COLORS = {
    joy: '#FFD700',
    sadness: '#4169E1',
    anger: '#DC143C',
    fear: '#8B008B',
    surprise: '#FF69B4',
    anticipation: '#32CD32',
    trust: '#00CED1',
    disgust: '#8B4513'
  };
  
  const pieData = Object.entries(data).map(([emotion, value]) => ({
    name: getEmotionLabel(emotion),
    value,
    color: COLORS[emotion as EmotionType]
  }));
  
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={pieData}
        cx={200}
        cy={200}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
```

### 感情カレンダービュー
```typescript
const EmotionCalendar: React.FC<{ year: number; month: number }> = ({ year, month }) => {
  return (
    <div className="emotion-calendar">
      {days.map(day => {
        const emotion = getEmotionForDay(day);
        return (
          <div 
            key={day}
            className="day-cell"
            style={{ backgroundColor: getEmotionColor(emotion) }}
          >
            <span>{day}</span>
            <span className="emotion-emoji">{getEmotionEmoji(emotion)}</span>
          </div>
        );
      })}
    </div>
  );
};
```

## UI設計
```
[感情分析ダッシュボード]

期間: [2024年1月] [週] [月] [年]

📊 感情スコア推移
┌─────────────────────────────┐
│     ポジティブ              │
│  ___/\___/\                 │
│ /         \                 │
│            \___/\___        │
│     ネガティブ              │
└─────────────────────────────┘

📈 今月の傾向
ポジティブ: 65% (+5% from 先月)
最も多い感情: 😊 喜び (35%)
最も少ない感情: 😠 怒り (5%)

🎯 ハイライト
最も幸せだった日: 1/15 (プロジェクト完了)
最も落ち込んだ日: 1/8 (体調不良)

💡 AIからの洞察
"今月は全体的にポジティブな傾向。
特に仕事関連の達成感が多く見られます。
週末は比較的リラックスした感情が..."

[詳細レポート] [エクスポート]
```

## タスクリスト
- [ ] 感情データ集計サービス
- [ ] 時系列グラフコンポーネント
- [ ] 円グラフコンポーネント
- [ ] 感情カレンダー実装
- [ ] AI洞察生成機能
- [ ] ダッシュボードページ