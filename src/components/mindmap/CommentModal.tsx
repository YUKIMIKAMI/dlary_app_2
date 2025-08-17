import React, { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CommentModalProps {
  isOpen: boolean;
  targetNodeContent: string;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  targetNodeContent,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    await onSubmit(comment.trim());
    setComment('');
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">コメントを追加</h2>
              <p className="text-sm text-gray-600 mt-1">
                {format(today, 'yyyy年M月d日 (E)', { locale: ja })}のコメント
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="bg-pastel-lavender bg-opacity-20 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <span className="text-lg mr-2">📝</span>
              <div>
                <p className="text-sm text-gray-500 mb-1">対象ノード：</p>
                <p className="text-gray-700 text-sm">{targetNodeContent}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                コメント内容
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="textarea-field min-h-[120px]"
                placeholder="後から思い出したこと、追加の考察、関連する情報などを入力..."
                disabled={isSubmitting}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                このコメントは過去の日記に追加されます
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !comment.trim()}
              >
                {isSubmitting ? '追加中...' : 'コメントを追加'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};