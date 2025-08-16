import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDiary } from '../hooks/useDiary';
import { useMindMap } from '../hooks/useMindMap';
import { useQuestionGenerator } from '../hooks/useQuestionGenerator';
import { storageService } from '../services/storage';
import { MindMapView } from '../components/mindmap/MindMapView';
import { AnswerModal } from '../components/mindmap/AnswerModal';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { DiaryEntry, MindMapNode, MindMapEdge } from '../types/diary';

export const MindMapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEntry, setCurrentEntry } = useDiary();
  const { 
    currentNodes, 
    currentEdges, 
    initializeMindMap, 
    updateDiaryMindMap,
    setNodes,
    setEdges 
  } = useMindMap();
  const { generateQuestions, generateFollowUpQuestions, isGenerating, error: genError } = useQuestionGenerator();
  const [localEntry, setLocalEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<MindMapNode | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    let entry: DiaryEntry | null = null;

    if (currentEntry && currentEntry.id === id) {
      entry = currentEntry;
    } else {
      entry = storageService.getEntry(id);
      if (entry) {
        setLocalEntry(entry);
        setCurrentEntry(entry);
      } else {
        navigate('/');
        return;
      }
    }

    if (entry) {
      if (entry.mindMapData) {
        // 既存のマインドマップデータがある場合
        setNodes(entry.mindMapData.nodes);
        setEdges(entry.mindMapData.edges);
        setQuestionsGenerated(true);
      } else {
        // 新規作成の場合
        initializeMindMap(entry.content);
        setQuestionsGenerated(false);
      }
      setIsLoading(false);
    }
  }, [id, currentEntry, navigate, setCurrentEntry, initializeMindMap, setNodes, setEdges]);

  const displayEntry = currentEntry || localEntry;

  // AI質問生成
  useEffect(() => {
    const generateAIQuestions = async () => {
      if (!displayEntry || questionsGenerated || isGenerating) return;
      
      const hasLoadingNodes = currentNodes.some(
        node => node.type === 'question' && node.content === 'Loading...'
      );
      
      if (!hasLoadingNodes) return;

      try {
        const questions = await generateQuestions(displayEntry.content);
        
        if (questions.length > 0) {
          // 質問ノードを更新
          const updatedNodes = currentNodes.map((node, index) => {
            if (node.type === 'question' && node.content === 'Loading...') {
              const questionIndex = parseInt(node.id.split('-')[1]) - 1;
              if (questions[questionIndex]) {
                return {
                  ...node,
                  content: questions[questionIndex],
                };
              }
            }
            return node;
          });
          
          setNodes(updatedNodes);
          updateDiaryMindMap(displayEntry.id, updatedNodes, currentEdges);
          setQuestionsGenerated(true);
        }
      } catch (error) {
        console.error('質問生成エラー:', error);
      }
    };

    if (displayEntry && !questionsGenerated) {
      generateAIQuestions();
    }
  }, [displayEntry, questionsGenerated, currentNodes, currentEdges, generateQuestions, 
      isGenerating, setNodes, updateDiaryMindMap]);

  if (!displayEntry || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-2xl mx-auto text-center">
          <p className="text-gray-600">マインドマップを読み込み中...</p>
        </div>
      </div>
    );
  }

  const handleNodeClick = (nodeId: string) => {
    const node = currentNodes.find(n => n.id === nodeId);
    if (node && node.type === 'question' && node.content !== 'Loading...') {
      setSelectedQuestion(node);
      setIsAnswerModalOpen(true);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    if (!selectedQuestion || !displayEntry) return;

    // 回答ノードを作成（質問の右側に配置）
    const answerNode: MindMapNode = {
      id: `answer-${Date.now()}`,
      type: 'answer',
      content: answer,
      position: {
        x: selectedQuestion.position.x + 300,
        y: selectedQuestion.position.y,
      },
      parentId: selectedQuestion.id,
      createdAt: new Date(),
    };

    // エッジを作成
    const answerEdge: MindMapEdge = {
      id: `edge-${selectedQuestion.id}-to-${answerNode.id}`,
      source: selectedQuestion.id,
      target: answerNode.id,
    };

    // ノードとエッジを追加
    const updatedNodes = [...currentNodes, answerNode];
    const updatedEdges = [...currentEdges, answerEdge];
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);

    // フォローアップ質問を生成（日記の内容も渡す）
    try {
      const followUpQuestions = await generateFollowUpQuestions(
        selectedQuestion.content,
        answer,
        displayEntry.content
      );

      if (followUpQuestions.length > 0) {
        // フォローアップ質問を縦に配置（重ならないように）
        const newQuestionNodes: MindMapNode[] = followUpQuestions.map((q, index) => {
          const ySpacing = 150; // ノード間の垂直間隔を増やす
          const startY = answerNode.position.y - ySpacing; // 中央から上下に配置
          return {
            id: `question-${Date.now()}-${index}`,
            type: 'question' as const,
            content: q,
            position: {
              x: answerNode.position.x + 300, // 回答ノードの右側
              y: startY + (index * ySpacing),
            },
            parentId: answerNode.id,
            createdAt: new Date(),
          };
        });

        const newEdges: MindMapEdge[] = newQuestionNodes.map(node => ({
          id: `edge-${answerNode.id}-to-${node.id}`,
          source: answerNode.id,
          target: node.id,
        }));

        const finalNodes = [...updatedNodes, ...newQuestionNodes];
        const finalEdges = [...updatedEdges, ...newEdges];

        setNodes(finalNodes);
        setEdges(finalEdges);
        updateDiaryMindMap(displayEntry.id, finalNodes, finalEdges);
      } else {
        updateDiaryMindMap(displayEntry.id, updatedNodes, updatedEdges);
      }
    } catch (error) {
      console.error('フォローアップ質問生成エラー:', error);
      updateDiaryMindMap(displayEntry.id, updatedNodes, updatedEdges);
    }

    setIsAnswerModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleNodesChange = (nodes: typeof currentNodes) => {
    if (displayEntry) {
      updateDiaryMindMap(displayEntry.id, nodes, currentEdges);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link 
              to="/history" 
              className="text-sm text-gray-600 hover:text-gray-800 mb-2 inline-block"
            >
              ← 日記一覧に戻る
            </Link>
            <h2 className="text-2xl font-bold text-gray-800">
              {format(new Date(displayEntry.createdAt), 'yyyy年M月d日 (E)', { locale: ja })}
              の日記
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {currentNodes.length} ノード / {currentEdges.length} 接続
          </div>
        </div>

        {/* マインドマップ */}
        <div className="card p-0 overflow-hidden">
          <MindMapView
            diaryContent={displayEntry.content}
            nodes={currentNodes}
            edges={currentEdges}
            onNodeClick={handleNodeClick}
            onNodesChange={handleNodesChange}
          />
        </div>

        {/* 操作説明 */}
        <div className="mt-6 card bg-pastel-lavender bg-opacity-30">
          <h3 className="text-lg font-semibold mb-3">操作方法</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>🖱️ ドラッグ: ノードを移動</li>
            <li>📜 スクロール: ズームイン/アウト</li>
            <li>❓ 質問ノードをクリック: 回答を入力</li>
            <li>💬 右クリック: コメントを追加（実装予定）</li>
          </ul>
        </div>

        {/* 回答モーダル */}
        <AnswerModal
          isOpen={isAnswerModalOpen}
          question={selectedQuestion?.content || ''}
          onClose={() => {
            setIsAnswerModalOpen(false);
            setSelectedQuestion(null);
          }}
          onSubmit={handleAnswerSubmit}
        />

        {/* デバッグ情報（開発中のみ） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 card bg-gray-100">
            <h4 className="font-semibold mb-2">デバッグ情報</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({ 
                entryId: displayEntry.id,
                nodesCount: currentNodes.length,
                edgesCount: currentEdges.length,
                hasQuestions: currentNodes.some(n => n.type === 'question' && n.content !== 'Loading...')
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};