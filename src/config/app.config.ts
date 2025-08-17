// アプリケーション設定
export const APP_CONFIG = {
  // AI質問生成の設定
  AI_QUESTIONS: {
    // 初期質問の数（2または3を推奨）
    INITIAL_QUESTION_COUNT: 2, // 3に変更すると3つの質問が生成されます
    
    // フォローアップ質問の数
    FOLLOWUP_QUESTION_COUNT: 2, // 3に変更すると3つのフォローアップ質問が生成されます
    
    // ノード間の垂直間隔（px）
    NODE_VERTICAL_SPACING: 200,
    
    // フォローアップノード間の垂直間隔（px）
    FOLLOWUP_NODE_VERTICAL_SPACING: 150,
    
    // ノード間の水平間隔（px）
    NODE_HORIZONTAL_SPACING: 300,
    
    // メインノードから質問ノードまでの距離（px）
    MAIN_TO_QUESTION_DISTANCE: 450,
  },
  
  // マインドマップの設定
  MINDMAP: {
    // メインノードの初期位置
    MAIN_NODE_POSITION: { x: 50, y: 250 },
    
    // 質問ノードの初期X座標
    QUESTION_NODE_X: 500,
  },
} as const;