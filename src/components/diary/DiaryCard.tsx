import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { DiaryEntry } from '../../types/diary';

interface DiaryCardProps {
  entry: DiaryEntry;
  onSelect: (entry: DiaryEntry) => void;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ entry, onSelect }) => {
  // 内容のプレビューを生成（最初の150文字）
  const contentPreview = entry.content.length > 150
    ? entry.content.substring(0, 150) + '...'
    : entry.content;

  // 質問の数を取得
  const questionCount = entry.mindMapData?.nodes.filter(
    node => node.type === 'question' && node.content !== 'Loading...'
  ).length || 0;

  // 回答の数を取得
  const answerCount = entry.mindMapData?.nodes.filter(
    node => node.type === 'answer'
  ).length || 0;

  return (
    <Link
      to={`/mindmap/${entry.id}`}
      onClick={() => onSelect(entry)}
      className="block card hover:shadow-xl transition-all duration-200 hover:bg-pastel-beige hover:bg-opacity-30 hover:scale-[1.02]"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {format(new Date(entry.createdAt), 'yyyy年M月d日 (E)', { locale: ja })}
          </h3>
          <span className="text-sm text-gray-500">
            {format(new Date(entry.createdAt), 'HH:mm')}
          </span>
        </div>
        {entry.mindMapData && (
          <div className="flex items-center space-x-2">
            {questionCount > 0 && (
              <span className="px-2 py-1 bg-pastel-green bg-opacity-50 rounded-full text-xs">
                ❓ {questionCount}
              </span>
            )}
            {answerCount > 0 && (
              <span className="px-2 py-1 bg-pastel-sky bg-opacity-50 rounded-full text-xs">
                💭 {answerCount}
              </span>
            )}
          </div>
        )}
      </div>
      
      <p className="text-gray-600 line-clamp-3 mb-3">
        {contentPreview}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <span>📝 {entry.content.length}文字</span>
          {entry.mindMapData && (
            <span>🗺️ {entry.mindMapData.nodes.length}ノード</span>
          )}
        </div>
        <span className="text-xs">
          {format(new Date(entry.updatedAt), 'M/d HH:mm')}更新
        </span>
      </div>
    </Link>
  );
};