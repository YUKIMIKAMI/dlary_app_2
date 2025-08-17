import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useDiary } from '../hooks/useDiary';
import { DiaryCard } from '../components/diary/DiaryCard';
import { MonthlyGroup } from '../components/diary/MonthlyGroup';
import { DiaryStats } from '../components/diary/DiaryStats';
import type { DiaryEntry } from '../types/diary';

const ITEMS_PER_PAGE = 10;

export const HistoryPage: React.FC = () => {
  const { entries, loadEntries, setCurrentEntry } = useDiary();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'group'>('list');

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // フィルタリングされたエントリ
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // キーワード検索
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 日付フィルター
    if (dateFilter.startDate || dateFilter.endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        const start = dateFilter.startDate ? new Date(dateFilter.startDate) : new Date('1900-01-01');
        const end = dateFilter.endDate ? new Date(dateFilter.endDate + 'T23:59:59') : new Date('2100-12-31');
        return isWithinInterval(entryDate, { start, end });
      });
    }

    // 日付順ソート（新しい順）
    return filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [entries, searchTerm, dateFilter]);

  // 月別にグループ化
  const groupedEntries = useMemo(() => {
    const groups = new Map<string, DiaryEntry[]>();
    
    filteredEntries.forEach(entry => {
      const monthKey = format(new Date(entry.createdAt), 'yyyy年M月');
      if (!groups.has(monthKey)) {
        groups.set(monthKey, []);
      }
      groups.get(monthKey)!.push(entry);
    });

    return Array.from(groups.entries());
  }, [filteredEntries]);

  // ページネーション
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearchTerm('');
    setDateFilter({ startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  if (entries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">過去の日記</h2>
          <p className="text-gray-600 mb-6">まだ日記がありません</p>
          <Link to="/" className="btn-primary">
            最初の日記を書く
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">過去の日記</h2>
          <Link 
            to="/" 
            className="btn-primary text-sm"
          >
            ➕ 新しい日記を書く
          </Link>
        </div>
        
        {/* 統計情報 */}
        {entries.length > 0 && (
          <DiaryStats entries={filteredEntries} />
        )}
        
        {/* 検索・フィルターセクション */}
        <div className="card mb-6 bg-pastel-lavender bg-opacity-20">
          <div className="space-y-4">
            {/* キーワード検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                キーワード検索
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="日記の内容を検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue"
              />
            </div>

            {/* 日付フィルター */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始日
                </label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => {
                    setDateFilter(prev => ({ ...prev, startDate: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  終了日
                </label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => {
                    setDateFilter(prev => ({ ...prev, endDate: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue"
                />
              </div>
            </div>

            {/* リセットボタン */}
            {(searchTerm || dateFilter.startDate || dateFilter.endDate) && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                フィルターをリセット
              </button>
            )}
          </div>
        </div>

        {/* 表示モード切り替え */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {(searchTerm || dateFilter.startDate || dateFilter.endDate) && (
              <span>{filteredEntries.length}件の日記が見つかりました</span>
            )}
            {!searchTerm && !dateFilter.startDate && !dateFilter.endDate && (
              <span>全{entries.length}件</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'list'
                  ? 'bg-pastel-blue text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              📋 一覧表示
            </button>
            <button
              onClick={() => setViewMode('group')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'group'
                  ? 'bg-pastel-blue text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              📅 月別表示
            </button>
          </div>
        </div>
        
        {/* 日記一覧 */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {paginatedEntries.map((entry) => (
              <DiaryCard
                key={entry.id}
                entry={entry}
                onSelect={setCurrentEntry}
              />
            ))}
          </div>
        ) : (
          <div>
            {groupedEntries.map(([monthKey, monthEntries]) => (
              <MonthlyGroup
                key={monthKey}
                monthLabel={monthKey}
                entries={monthEntries}
                onSelectEntry={setCurrentEntry}
                defaultExpanded={groupedEntries.length <= 3}
              />
            ))}
          </div>
        )}

        {/* ページネーション（一覧表示のみ） */}
        {viewMode === 'list' && totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-pastel-blue text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-80"
            >
              前へ
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === pageNumber
                      ? 'bg-pastel-pink text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-pastel-blue text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-80"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};