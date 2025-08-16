// Test file to verify imports
import type { DiaryEntry } from './types/diary';

const testEntry: DiaryEntry = {
  id: 'test',
  content: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('Import test successful:', testEntry);

export {};