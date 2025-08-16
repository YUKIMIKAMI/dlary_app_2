import React from 'react';
import { DiaryInput } from '../components/diary/DiaryInput';

export const DiaryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <DiaryInput />
    </div>
  );
};