import type { DiaryEntry } from '../types/diary';

const STORAGE_KEY = 'diary_entries';

export const storageService = {
  saveDiaryEntry(entry: DiaryEntry): boolean {
    try {
      const entries = this.getAllEntries();
      entries.push(entry);
      
      const serialized = JSON.stringify(entries);
      if (serialized.length > 4 * 1024 * 1024) {
        console.warn('Data size approaching LocalStorage limit');
      }
      
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save diary entry:', error);
      return false;
    }
  },

  getAllEntries(): DiaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const entries = JSON.parse(data);
      return entries.map((entry: DiaryEntry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to load diary entries:', error);
      return [];
    }
  },

  getEntry(id: string): DiaryEntry | null {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.id === id) || null;
  },

  updateEntry(id: string, updates: Partial<DiaryEntry>): boolean {
    try {
      const entries = this.getAllEntries();
      const index = entries.findIndex(entry => entry.id === id);
      
      if (index === -1) return false;
      
      entries[index] = { ...entries[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('Failed to update diary entry:', error);
      return false;
    }
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};