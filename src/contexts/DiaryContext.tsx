/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { DiaryEntry } from '../types/diary';
import { storageService } from '../services/storage';
import { DiaryContextType } from './DiaryContextType';

export const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);

  const loadEntries = useCallback(() => {
    const loadedEntries = storageService.getAllEntries();
    setEntries(loadedEntries);
  }, []);

  const saveDiary = useCallback((content: string): DiaryEntry | null => {
    if (!content.trim()) return null;

    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const success = storageService.saveDiaryEntry(newEntry);
    if (success) {
      setEntries(prev => [...prev, newEntry]);
      setCurrentEntry(newEntry);
      return newEntry;
    }
    
    return null;
  }, []);

  return (
    <DiaryContext.Provider 
      value={{ 
        entries, 
        currentEntry, 
        saveDiary, 
        loadEntries,
        setCurrentEntry 
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

