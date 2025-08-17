# チケット #015: マインドマップ統合・人生俯瞰機能

## 概要
すべての日記のマインドマップを統合し、カテゴリー別に整理された人生の全体像を可視化する機能

## 受け入れ条件
- 全マインドマップの統合表示
- 自動カテゴリー分類（仕事、人間関係、趣味、健康など）
- ズーム可能な巨大マップ
- 時系列フィルター機能
- 関連性の高いノード間の接続表示

## 技術要件

### データ構造
```typescript
interface LifeMapCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  keywords: string[]; // カテゴリー判定用キーワード
}

interface IntegratedMindMap {
  categories: Map<string, {
    category: LifeMapCategory;
    nodes: MindMapNode[];
    subCategories: Map<string, MindMapNode[]>;
  }>;
  connections: Array<{
    source: string;
    target: string;
    type: 'temporal' | 'semantic' | 'causal';
    strength: number;
  }>;
  timeline: {
    start: Date;
    end: Date;
    milestones: Array<{
      date: Date;
      title: string;
      category: string;
    }>;
  };
}
```

### カテゴリー自動分類
```typescript
const categorizeNode = async (node: MindMapNode): Promise<string> => {
  const categories: LifeMapCategory[] = [
    { id: 'work', name: '仕事', keywords: ['仕事', '会議', 'プロジェクト', '締切'] },
    { id: 'relationship', name: '人間関係', keywords: ['友達', '家族', '恋人', '同僚'] },
    { id: 'hobby', name: '趣味', keywords: ['読書', '映画', 'ゲーム', '旅行'] },
    { id: 'health', name: '健康', keywords: ['運動', '体調', '睡眠', '食事'] },
    { id: 'growth', name: '成長', keywords: ['学習', '勉強', 'スキル', '目標'] },
    { id: 'emotion', name: '感情', keywords: ['嬉しい', '悲しい', '不安', '幸せ'] }
  ];
  
  // AIでカテゴリー判定
  const prompt = `
  以下のテキストを最も適切なカテゴリーに分類してください。
  テキスト: "${node.content}"
  カテゴリー: ${categories.map(c => c.id).join(', ')}
  `;
  
  const category = await geminiService.classify(prompt);
  return category;
};
```

### 関連性の検出
```typescript
const findRelatedNodes = (
  node: MindMapNode, 
  allNodes: MindMapNode[]
): Array<{ node: MindMapNode; similarity: number }> => {
  return allNodes
    .map(n => ({
      node: n,
      similarity: calculateSimilarity(node.content, n.content)
    }))
    .filter(r => r.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity);
};

const calculateSimilarity = (text1: string, text2: string): number => {
  // TF-IDFやコサイン類似度を使用
  // または、埋め込みベクトルの類似度計算
  return cosineSimilarity(getEmbedding(text1), getEmbedding(text2));
};
```

### 巨大マップのレンダリング最適化
```typescript
const OptimizedLifeMap: React.FC = () => {
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.5 });
  const [visibleNodes, setVisibleNodes] = useState<MindMapNode[]>([]);
  
  // ビューポート内のノードのみレンダリング
  useEffect(() => {
    const nodes = getNodesInViewport(allNodes, viewport);
    setVisibleNodes(nodes);
  }, [viewport]);
  
  // クラスタリング（ズームレベルに応じて）
  const clusters = useMemo(() => {
    if (viewport.zoom < 0.3) {
      return clusterNodes(visibleNodes);
    }
    return visibleNodes;
  }, [visibleNodes, viewport.zoom]);
  
  return (
    <ReactFlow
      nodes={clusters}
      edges={edges}
      onViewportChange={setViewport}
    />
  );
};
```

## UI設計
```
[人生マップ]

フィルター: [全期間] [2024年] [カテゴリー選択]
表示: [2D] [3D] [タイムライン]

┌─────────────────────────────────────┐
│                                     │
│    [仕事]          [人間関係]        │
│     ○━━━○           ○━━━○          │
│     ┃   ┃           ┃              │
│   ○━┻━○ ┃         ○━┻━○           │
│         ┃         ┃                │
│    [趣味]┃    [健康]                │
│     ○━━━●━━━━━○                   │
│     ┃                              │
│   ○━┻━○                           │
│                                     │
│ ズーム: [+][-] パン: ドラッグ        │
└─────────────────────────────────────┘

📊 統計
総ノード数: 2,543
カテゴリー分布:
- 仕事: 35%
- 人間関係: 25%
- 趣味: 20%
- 健康: 15%
- その他: 5%

🔍 インサイト
"仕事と健康の関連性が強く見られます"
"2023年から趣味の活動が増加傾向"

[エクスポート] [共有] [印刷]
```

### マイルストーン表示
```typescript
const MilestoneView: React.FC = () => {
  return (
    <div className="timeline">
      {milestones.map(m => (
        <div key={m.date} className="milestone">
          <div className="date">{format(m.date, 'yyyy/MM/dd')}</div>
          <div className="event" style={{ borderColor: getCategoryColor(m.category) }}>
            {m.title}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## タスクリスト
- [ ] マップ統合エンジン
- [ ] カテゴリー分類AI
- [ ] 関連性検出アルゴリズム
- [ ] 巨大マップ最適化
- [ ] 3D表示モード（Three.js）
- [ ] タイムラインビュー
- [ ] エクスポート機能