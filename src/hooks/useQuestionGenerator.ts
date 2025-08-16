import { useState, useCallback } from 'react';
import { geminiService } from '../services/gemini';
import type { MindMapNode } from '../types/diary';

interface UseQuestionGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  generateQuestions: (diaryContent: string) => Promise<string[]>;
  generateFollowUpQuestions: (originalQuestion: string, answer: string, diaryContent?: string) => Promise<string[]>;
}

export const useQuestionGenerator = (): UseQuestionGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = useCallback(async (diaryContent: string): Promise<string[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const questions = await geminiService.generateQuestions(diaryContent);
      return questions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '質問生成に失敗しました';
      setError(errorMessage);
      console.error('質問生成エラー:', err);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateFollowUpQuestions = useCallback(async (
    originalQuestion: string,
    answer: string,
    diaryContent?: string
  ): Promise<string[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const questions = await geminiService.generateFollowUpQuestions(originalQuestion, answer, diaryContent);
      return questions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'フォローアップ質問生成に失敗しました';
      setError(errorMessage);
      console.error('フォローアップ質問生成エラー:', err);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    isGenerating,
    error,
    generateQuestions,
    generateFollowUpQuestions,
  };
};