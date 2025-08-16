import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useDiary } from '../hooks/useDiary';

export const HistoryPage: React.FC = () => {
  const { entries, loadEntries, setCurrentEntry } = useDiary();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (entries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">過去の日記</h2>
          <p className="text-gray-600 mb-6">まだ日記がありません</p>
          <Link to="/" className="btn-primary">
            最初の日記を書く
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">過去の日記</h2>
        
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <Link
              key={entry.id}
              to={`/mindmap/${entry.id}`}
              onClick={() => setCurrentEntry(entry)}
              className="block card hover:shadow-xl transition-shadow duration-200 hover:bg-pastel-beige hover:bg-opacity-30"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {format(new Date(entry.createdAt), 'yyyy年M月d日 (E)', { locale: ja })}
                </h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(entry.createdAt), 'HH:mm')}
                </span>
              </div>
              <p className="text-gray-600 line-clamp-3">
                {entry.content}
              </p>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <span>文字数: {entry.content.length}</span>
                {entry.mindMapData && (
                  <>
                    <span className="mx-2">•</span>
                    <span>ノード数: {entry.mindMapData.nodes.length}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};