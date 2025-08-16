import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const AnswerNode = memo<NodeProps>(({ data }) => {
  return (
    <div className="bg-pastel-sky border-2 border-blue-400 rounded-lg p-3 min-w-[200px] max-w-[300px] shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center mb-2">
        <span className="text-lg mr-2">💭</span>
        <span className="font-semibold text-gray-700 text-sm">回答</span>
      </div>
      <div className="text-xs text-gray-600">
        {typeof data.label === 'string' && data.label.length > 100
          ? data.label.substring(0, 100) + '...'
          : data.label}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ left: '-8px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ right: '-8px' }}
      />
    </div>
  );
});