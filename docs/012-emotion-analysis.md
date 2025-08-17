# チケット #012: 感情分析機能

## 概要
各ノードの内容から感情を分析し、視覚的にマークを表示する機能

## 受け入れ条件
- ノードの右上に感情アイコンを表示
- 主要な8つの感情を識別（喜び、悲しみ、怒り、恐れ、驚き、期待、信頼、嫌悪）
- AIによる自動判定
- 手動で感情を修正可能

## 技術要件

### 感情の定義
```typescript
type EmotionType = 
  | 'joy'      // 😊 喜び
  | 'sadness'  // 😢 悲しみ
  | 'anger'    // 😠 怒り
  | 'fear'     // 😨 恐れ
  | 'surprise' // 😮 驚き
  | 'anticipation' // 🤗 期待
  | 'trust'    // 🤝 信頼
  | 'disgust'; // 😣 嫌悪

interface EmotionAnalysis {
  primary: EmotionType;
  confidence: number; // 0-1
  secondary?: EmotionType;
  intensity: 'low' | 'medium' | 'high';
}
```

### Gemini APIでの感情分析
```typescript
const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
  const prompt = `
  以下のテキストの感情を分析してください。
  
  テキスト: "${text}"
  
  以下の形式でJSONを返してください：
  {
    "primary": "感情タイプ",
    "confidence": 0.8,
    "intensity": "medium"
  }
  
  感情タイプ: joy, sadness, anger, fear, surprise, anticipation, trust, disgust
  `;
  
  const response = await geminiService.analyze(prompt);
  return JSON.parse(response);
};
```

### UIデザイン
```typescript
// ノードコンポーネントの拡張
<div className="relative">
  {/* 感情マーク */}
  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
    <span className="text-lg">{getEmotionEmoji(emotion)}</span>
    <span className="text-xs text-gray-500">{confidence}%</span>
  </div>
  
  {/* 既存のノード内容 */}
  <div className="node-content">...</div>
</div>
```

## タスクリスト
- [ ] 感情分析サービスの実装
- [ ] ノードUIの拡張
- [ ] 感情アイコンの表示
- [ ] 感情データの保存
- [ ] 手動修正機能