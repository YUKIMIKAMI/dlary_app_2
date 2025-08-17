import React, { useState } from 'react';
import { DiaryCard } from './DiaryCard';
import type { DiaryEntry } from '../../types/diary';

interface MonthlyGroupProps {
  monthLabel: string;
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
  defaultExpanded?: boolean;
}

export const MonthlyGroup: React.FC<MonthlyGroupProps> = ({
  monthLabel,
  entries,
  onSelectEntry,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-pastel-lavender bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg font-semibold text-gray-800">
            📅 {monthLabel}
          </span>
          <span className="text-sm text-gray-600">
            ({entries.length}件)
          </span>
        </div>
        <span className="text-xl text-gray-600">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {entries.map((entry) => (
            <DiaryCard
              key={entry.id}
              entry={entry}
              onSelect={onSelectEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
};