import type { DiaryEntry } from '../types/diary';

export interface DiaryContextType {
  entries: DiaryEntry[];
  currentEntry: DiaryEntry | null;
  saveDiary: (content: string) => DiaryEntry | null;
  loadEntries: () => void;
  setCurrentEntry: (entry: DiaryEntry | null) => void;
}