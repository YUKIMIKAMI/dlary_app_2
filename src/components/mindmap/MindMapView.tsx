import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DiaryNode } from './DiaryNode';
import { QuestionNode } from './QuestionNode';
import { AnswerNode } from './AnswerNode';
import type { MindMapNode, MindMapEdge } from '../../types/diary';

interface MindMapViewProps {
  diaryContent: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onNodeClick?: (nodeId: string) => void;
  onNodesChange?: (nodes: MindMapNode[]) => void;
}

const nodeTypes: NodeTypes = {
  diary: DiaryNode,
  question: QuestionNode,
  answer: AnswerNode,
};

const MindMapViewContent: React.FC<MindMapViewProps> = ({
  diaryContent,
  nodes: initialNodes,
  edges: initialEdges,
  onNodeClick,
  onNodesChange,
}) => {
  const { fitView } = useReactFlow();
  // Convert custom nodes to ReactFlow nodes
  const flowNodes = useMemo(() => {
    const convertedNodes: Node[] = initialNodes.map(node => {
      let nodeType = 'diary';
      if (node.type === 'question') nodeType = 'question';
      if (node.type === 'answer') nodeType = 'answer';
      if (node.type === 'main') nodeType = 'diary';

      return {
        id: node.id,
        type: nodeType,
        position: node.position,
        data: {
          label: node.content,
          type: node.type,
        },
      };
    });

    return convertedNodes;
  }, [initialNodes]);

  // Convert custom edges to ReactFlow edges
  const flowEdges = useMemo(() => {
    return initialEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#B8E0FF', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#B8E0FF',
      },
    }));
  }, [initialEdges]);

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // ノードとエッジの更新を監視
  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  // 新しいノードが追加されたときにビューを調整
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
    return () => clearTimeout(timer);
  }, [initialNodes.length, fitView]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  return (
    <div className="w-full h-[600px] bg-pastel-gray rounded-lg overflow-auto">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-right"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#E5E5E5" gap={16} />
        <Controls className="bg-white border-2 border-pastel-blue rounded-lg" />
        <MiniMap 
          className="bg-white border-2 border-pastel-blue rounded-lg"
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'main':
                return '#FFF9C4'; // パステルイエロー
              case 'question':
                return '#C8E6C9'; // パステルグリーン
              case 'answer':
                return '#B3E5FC'; // パステルスカイブルー
              default:
                return '#E0E0E0';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};

export const MindMapView: React.FC<MindMapViewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <MindMapViewContent {...props} />
    </ReactFlowProvider>
  );
};