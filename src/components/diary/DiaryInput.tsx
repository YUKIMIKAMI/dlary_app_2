import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiary } from '../../hooks/useDiary';

export const DiaryInput: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { saveDiary } = useDiary();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('日記の内容を入力してください');
      return;
    }

    setIsSaving(true);
    const entry = saveDiary(content);
    
    if (entry) {
      setTimeout(() => {
        navigate(`/mindmap/${entry.id}`);
      }, 500);
    } else {
      alert('日記の保存に失敗しました');
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">今日の日記</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="diary-content" className="block text-sm font-medium text-gray-700 mb-2">
              今日はどんな一日でしたか？
            </label>
            <textarea
              id="diary-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="textarea-field min-h-[300px] text-gray-800"
              placeholder="今日の出来事、感じたこと、考えたことを自由に書いてください..."
              disabled={isSaving}
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {content.length > 0 && `${content.length} 文字`}
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => setContent('')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSaving || !content}
              >
                クリア
              </button>
              <button
                type="submit"
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving || !content.trim()}
              >
                {isSaving ? '保存中...' : '保存してマインドマップへ'}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            ヒント: Ctrl+Enter (Mac: Cmd+Enter) でも送信できます
          </div>
        </form>
      </div>

      <div className="mt-8 card bg-pastel-yellow bg-opacity-30">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">この日記アプリについて</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📝 日記を書くと自動的にマインドマップが生成されます</li>
          <li>🤖 AIが日記の内容から3つの質問を生成します</li>
          <li>💭 質問に答えることで、より深い自己理解ができます</li>
          <li>📅 過去の日記はいつでも見返すことができます</li>
        </ul>
      </div>
    </div>
  );
};