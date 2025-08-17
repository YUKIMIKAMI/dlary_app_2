import React from 'react';
import type { DiaryEntry } from '../../types/diary';

interface DiaryStatsProps {
  entries: DiaryEntry[];
}

export const DiaryStats: React.FC<DiaryStatsProps> = ({ entries }) => {
  // 統計情報を計算
  const totalCharacters = entries.reduce((sum, entry) => sum + entry.content.length, 0);
  const totalQuestions = entries.reduce((sum, entry) => {
    const questions = entry.mindMapData?.nodes.filter(
      node => node.type === 'question' && node.content !== 'Loading...'
    ).length || 0;
    return sum + questions;
  }, 0);
  const totalAnswers = entries.reduce((sum, entry) => {
    const answers = entry.mindMapData?.nodes.filter(
      node => node.type === 'answer'
    ).length || 0;
    return sum + answers;
  }, 0);
  const averageCharacters = entries.length > 0 
    ? Math.round(totalCharacters / entries.length) 
    : 0;

  // 最も長い日記
  const longestEntry = entries.reduce((longest, entry) => 
    entry.content.length > (longest?.content.length || 0) ? entry : longest
  , entries[0]);

  // 最も多くのノードを持つ日記
  const mostNodesEntry = entries.reduce((most, entry) => {
    const currentNodes = entry.mindMapData?.nodes.length || 0;
    const mostNodes = most?.mindMapData?.nodes.length || 0;
    return currentNodes > mostNodes ? entry : most;
  }, entries[0]);

  if (entries.length === 0) return null;

  return (
    <div className="card bg-gradient-to-r from-pastel-pink to-pastel-lavender bg-opacity-20 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        📊 日記の統計
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {entries.length}
          </div>
          <div className="text-sm text-gray-600">日記数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {totalCharacters.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">総文字数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {totalQuestions}
          </div>
          <div className="text-sm text-gray-600">総質問数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {totalAnswers}
          </div>
          <div className="text-sm text-gray-600">総回答数</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">平均文字数:</span>
            <span className="font-semibold">{averageCharacters}文字</span>
          </div>
          {longestEntry && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">最長日記:</span>
              <span className="font-semibold">{longestEntry.content.length}文字</span>
            </div>
          )}
          {mostNodesEntry && mostNodesEntry.mindMapData && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">最多ノード:</span>
              <span className="font-semibold">{mostNodesEntry.mindMapData.nodes.length}個</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">平均質問/日記:</span>
            <span className="font-semibold">
              {entries.length > 0 ? (totalQuestions / entries.length).toFixed(1) : 0}個
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};