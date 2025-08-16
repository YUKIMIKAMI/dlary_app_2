import { useContext } from 'react';
import { MindMapContext } from '../contexts/MindMapContext';

export const useMindMap = () => {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMap must be used within MindMapProvider');
  }
  return context;
};