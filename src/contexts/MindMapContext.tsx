/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { MindMapNode, MindMapEdge, DiaryEntry } from '../types/diary';
import { storageService } from '../services/storage';
import { APP_CONFIG } from '../config/app.config';

interface MindMapContextType {
  currentNodes: MindMapNode[];
  currentEdges: MindMapEdge[];
  setNodes: (nodes: MindMapNode[]) => void;
  setEdges: (edges: MindMapEdge[]) => void;
  addNode: (node: MindMapNode) => void;
  addEdge: (edge: MindMapEdge) => void;
  updateDiaryMindMap: (diaryId: string, nodes: MindMapNode[], edges: MindMapEdge[]) => void;
  initializeMindMap: (diaryContent: string) => void;
}

export const MindMapContext = createContext<MindMapContextType | undefined>(undefined);

export const MindMapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentNodes, setCurrentNodes] = useState<MindMapNode[]>([]);
  const [currentEdges, setCurrentEdges] = useState<MindMapEdge[]>([]);

  const setNodes = useCallback((nodes: MindMapNode[]) => {
    setCurrentNodes(nodes);
  }, []);

  const setEdges = useCallback((edges: MindMapEdge[]) => {
    setCurrentEdges(edges);
  }, []);

  const addNode = useCallback((node: MindMapNode) => {
    setCurrentNodes(prev => [...prev, node]);
  }, []);

  const addEdge = useCallback((edge: MindMapEdge) => {
    setCurrentEdges(prev => [...prev, edge]);
  }, []);

  const updateDiaryMindMap = useCallback((diaryId: string, nodes: MindMapNode[], edges: MindMapEdge[]) => {
    const entry = storageService.getEntry(diaryId);
    if (entry) {
      storageService.updateEntry(diaryId, {
        mindMapData: { nodes, edges }
      });
    }
  }, []);

  const initializeMindMap = useCallback((diaryContent: string) => {
    const { MINDMAP, AI_QUESTIONS } = APP_CONFIG;
    
    // メインノードの作成（左側に配置）
    const mainNode: MindMapNode = {
      id: 'main',
      type: 'main',
      content: diaryContent.slice(0, 150) + (diaryContent.length > 150 ? '...' : ''),
      position: MINDMAP.MAIN_NODE_POSITION,
      createdAt: new Date(),
    };

    // 質問ノードのプレースホルダー作成（設定に基づいた数）
    const questionCount = AI_QUESTIONS.INITIAL_QUESTION_COUNT;
    const questionNodes: MindMapNode[] = Array.from({ length: questionCount }, (_, index) => {
      const ySpacing = AI_QUESTIONS.NODE_VERTICAL_SPACING;
      // 質問を中央に配置するための計算
      const totalHeight = (questionCount - 1) * ySpacing;
      const startY = MINDMAP.MAIN_NODE_POSITION.y - (totalHeight / 2);
      
      return {
        id: `question-${index + 1}`,
        type: 'question' as const,
        content: 'Loading...',
        position: {
          x: MINDMAP.QUESTION_NODE_X,
          y: startY + (index * ySpacing),
        },
        parentId: 'main',
        createdAt: new Date(),
      };
    });

    // エッジの作成
    const edges: MindMapEdge[] = questionNodes.map((node, index) => ({
      id: `edge-main-to-q${index + 1}`,
      source: 'main',
      target: node.id,
    }));

    setNodes([mainNode, ...questionNodes]);
    setEdges(edges);
  }, []);

  return (
    <MindMapContext.Provider
      value={{
        currentNodes,
        currentEdges,
        setNodes,
        setEdges,
        addNode,
        addEdge,
        updateDiaryMindMap,
        initializeMindMap,
      }}
    >
      {children}
    </MindMapContext.Provider>
  );
};