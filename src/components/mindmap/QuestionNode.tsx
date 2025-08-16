import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const QuestionNode = memo<NodeProps>(({ data }) => {
  const isLoading = data.label === 'Loading...';
  
  return (
    <div className={`
      ${isLoading ? 'bg-gray-200' : 'bg-pastel-green'} 
      border-2 ${isLoading ? 'border-gray-400' : 'border-green-400'} 
      rounded-lg p-3 min-w-[200px] max-w-[300px] 
      shadow-md hover:shadow-lg transition-all 
      cursor-pointer hover:scale-105
    `}>
      <div className="flex items-center mb-2">
        <span className="text-lg mr-2">{isLoading ? '⏳' : '❓'}</span>
        <span className="font-semibold text-gray-700 text-sm">
          {isLoading ? '生成中...' : '質問'}
        </span>
      </div>
      <div className="text-xs text-gray-600">
        {data.label}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ left: '-8px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ right: '-8px' }}
      />
    </div>
  );
});