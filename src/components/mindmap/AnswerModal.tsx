import React, { useState } from 'react';

interface AnswerModalProps {
  isOpen: boolean;
  question: string;
  onClose: () => void;
  onSubmit: (answer: string) => void;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  question,
  onClose,
  onSubmit,
}) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);
    await onSubmit(answer.trim());
    setAnswer('');
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
            <h2 className="text-xl font-bold text-gray-800">質問への回答</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="bg-pastel-green bg-opacity-20 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <span className="text-lg mr-2">❓</span>
              <p className="text-gray-700">{question}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                あなたの回答
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="textarea-field min-h-[150px]"
                placeholder="質問について思うことを自由に書いてください..."
                disabled={isSubmitting}
                autoFocus
              />
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
                disabled={isSubmitting || !answer.trim()}
              >
                {isSubmitting ? '送信中...' : '回答を送信'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500">
            ヒント: 回答を送信すると、AIがさらに深掘りする質問を生成します
          </div>
        </div>
      </div>
    </div>
  );
};