import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const CommentNode = memo<NodeProps>(({ data }) => {
  const commentDate = data.commentDate ? new Date(data.commentDate) : new Date();
  
  return (
    <div className="bg-pastel-lavender border-2 border-dashed border-purple-400 rounded-lg p-3 min-w-[200px] max-w-[300px] shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-lg mr-2">💬</span>
          <span className="font-semibold text-gray-700 text-sm">コメント</span>
        </div>
        <span className="text-xs text-purple-600">
          {format(commentDate, 'M/d', { locale: ja })}
        </span>
      </div>
      <div className="text-xs text-gray-600">
        {typeof data.label === 'string' && data.label.length > 100
          ? data.label.substring(0, 100) + '...'
          : data.label}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ left: '-8px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ right: '-8px' }}
      />
    </div>
  );
});