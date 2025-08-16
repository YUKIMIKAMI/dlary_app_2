import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const DiaryNode = memo<NodeProps>(({ data }) => {
  return (
    <div className="bg-pastel-yellow border-2 border-yellow-400 rounded-lg p-4 min-w-[200px] max-w-[400px] shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-2">
        <span className="text-xl mr-2">📔</span>
        <span className="font-bold text-gray-700">日記</span>
      </div>
      <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
        {typeof data.label === 'string' && data.label.length > 150
          ? data.label.substring(0, 150) + '...'
          : data.label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
        style={{ right: '-8px' }}
      />
    </div>
  );
});