# チケット #016: 対話形式日記作成アシスタント

## 概要
AIアシスタントが質問を通じて、ユーザーの1日の出来事や感情を引き出し、充実した日記作成を支援する機能

## 受け入れ条件
- チャット形式の対話UI
- 段階的な質問による内容の深掘り
- 回答から日記の下書き自動生成
- 質問のパーソナライズ（過去の日記を学習）
- スキップ可能な対話フロー

## 技術要件

### 対話フロー設計
```typescript
interface ConversationFlow {
  stages: Array<{
    id: string;
    question: string;
    followUpLogic: (answer: string) => string | null;
    required: boolean;
  }>;
  context: {
    previousDiaries: DiaryEntry[];
    userPatterns: string[];
    timeOfDay: 'morning' | 'afternoon' | 'evening';
  };
}

const conversationStages = [
  {
    id: 'greeting',
    question: '今日はどんな一日でしたか？簡単に教えてください。',
    followUp: (answer) => {
      if (answer.includes('忙しい')) {
        return '忙しい中で、特に印象に残ったことは？';
      }
      return null;
    }
  },
  {
    id: 'highlight',
    question: '今日の中で最も印象的だった出来事は何ですか？',
    followUp: (answer) => '${event}についてもう少し詳しく教えてください。'
  },
  {
    id: 'emotion',
    question: 'その時、どんな気持ちでしたか？',
    followUp: (answer) => 'なぜそう感じたと思いますか？'
  },
  {
    id: 'learning',
    question: '今日学んだことや気づいたことはありますか？',
    followUp: null
  },
  {
    id: 'tomorrow',
    question: '明日に向けて考えていることはありますか？',
    followUp: null
  }
];
```

### AIアシスタントのペルソナ
```typescript
const generateAssistantResponse = async (
  stage: string,
  userAnswer: string,
  context: ConversationContext
): Promise<string> => {
  const prompt = `
  あなたは優しく共感的な日記作成アシスタントです。
  ユーザーの回答を受けて、自然な会話で深掘りしてください。
  
  現在のステージ: ${stage}
  ユーザーの回答: "${userAnswer}"
  
  過去の傾向:
  - よく話すトピック: ${context.frequentTopics.join(', ')}
  - 感情の傾向: ${context.emotionalPattern}
  
  次の質問を生成してください。
  注意点:
  - 押し付けがましくない
  - 共感的で温かい
  - 具体的すぎない（プライバシーに配慮）
  `;
  
  return await geminiService.generate(prompt);
};
```

### 日記生成機能
```typescript
interface DiaryDraft {
  content: string;
  suggestedTitle: string;
  extractedKeywords: string[];
  emotion: EmotionType;
  confidence: number;
}

const generateDiaryFromConversation = async (
  conversation: ConversationHistory
): Promise<DiaryDraft> => {
  const prompt = `
  以下の対話から、第一人称の日記を生成してください。
  
  対話履歴:
  ${conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n')}
  
  要件:
  - 自然な日記の文体
  - 時系列に沿った構成
  - 感情を含める
  - 500文字程度
  `;
  
  const content = await geminiService.generate(prompt);
  
  return {
    content,
    suggestedTitle: extractTitle(content),
    extractedKeywords: extractKeywords(content),
    emotion: analyzeEmotion(content),
    confidence: 0.85
  };
};
```

### UI設計
```typescript
const InteractiveDiaryAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  return (
    <div className="diary-assistant">
      {/* チャットUI */}
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && <span className="avatar">🤖</span>}
              <div className="content">{msg.content}</div>
              {msg.role === 'user' && <span className="avatar">👤</span>}
            </div>
          ))}
          {isTyping && <TypingIndicator />}
        </div>
        
        {/* クイック返答 */}
        <div className="quick-replies">
          <button>特になし</button>
          <button>覚えていない</button>
          <button>スキップ</button>
        </div>
        
        {/* 入力エリア */}
        <div className="input-area">
          <textarea 
            placeholder="回答を入力..."
            onKeyPress={handleEnter}
          />
          <button onClick={sendMessage}>送信</button>
        </div>
      </div>
      
      {/* プログレスバー */}
      <div className="progress">
        <div className="bar" style={{ width: `${(currentStage / totalStages) * 100}%` }} />
        <span>{currentStage + 1} / {totalStages}</span>
      </div>
      
      {/* 生成された日記プレビュー */}
      {isDraftReady && (
        <div className="diary-preview">
          <h3>生成された日記</h3>
          <div className="draft-content">{draftContent}</div>
          <div className="actions">
            <button onClick={editDraft}>編集</button>
            <button onClick={saveDiary}>保存</button>
            <button onClick={regenerate}>再生成</button>
          </div>
        </div>
      )}
    </div>
  );
};
```

## UIモックアップ
```
[日記アシスタント]

🤖 アシスタント:
こんばんは！今日も一日お疲れ様でした。
今日はどんな一日でしたか？

👤 あなた:
朝から会議が続いて忙しかったです。
でも新しいプロジェクトが決まって...

🤖 アシスタント:
新しいプロジェクトが決まったんですね！
それはワクワクしますね。どんなプロジェクトですか？

[特になし] [スキップ] [詳しく話す]

進捗: ━━━━━━━━━━━━━━━━━━━━ 60%

[下書きを見る] [会話を終了]
```

### 学習機能
```typescript
const learnFromDiaries = (diaries: DiaryEntry[]): UserPattern => {
  return {
    writingStyle: analyzeWritingStyle(diaries),
    commonTopics: extractFrequentTopics(diaries),
    emotionalPatterns: analyzeEmotionalPatterns(diaries),
    activeTimeOfDay: getMostActiveTime(diaries),
    averageLength: calculateAverageLength(diaries),
    vocabularyLevel: analyzeVocabulary(diaries)
  };
};

// パーソナライズされた質問生成
const personalizedQuestion = (pattern: UserPattern): string => {
  if (pattern.commonTopics.includes('仕事')) {
    return '今日の仕事で達成感を感じたことは？';
  }
  if (pattern.emotionalPatterns.recent === 'stressed') {
    return '今日はリラックスできる時間はありましたか？';
  }
  return getDefaultQuestion();
};
```

## タスクリスト
- [ ] チャットUIコンポーネント
- [ ] 対話フロー管理
- [ ] AI応答生成
- [ ] 日記下書き生成
- [ ] 学習機能実装
- [ ] プログレス表示
- [ ] クイック返答機能