export type DiaryEntry = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  mindMapData?: MindMapData;
}

export type MindMapData = {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export type MindMapNode = {
  id: string;
  type: 'main' | 'question' | 'answer' | 'comment';
  content: string;
  position: { x: number; y: number };
  parentId?: string;
  createdAt: Date;
  commentDate?: Date;
}

export type MindMapEdge = {
  id: string;
  source: string;
  target: string;
}