import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { settingsService } from '../services/settings';
import { APP_CONFIG } from '../config/app.config';

interface Settings {
  geminiApiKey?: string;
  theme?: 'light' | 'pastel' | 'dark';
  language?: 'ja' | 'en';
  autoSave?: boolean;
  initialQuestionCount?: number;
  followupQuestionCount?: number;
}

type TabType = 'api' | 'display' | 'data' | 'advanced';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('api');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failure' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<'light' | 'pastel' | 'dark'>('pastel');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [autoSave, setAutoSave] = useState(true);
  const [initialQuestionCount, setInitialQuestionCount] = useState(APP_CONFIG.AI_QUESTIONS.INITIAL_QUESTION_COUNT);
  const [followupQuestionCount, setFollowupQuestionCount] = useState(APP_CONFIG.AI_QUESTIONS.FOLLOWUP_QUESTION_COUNT);
  const [dataSize, setDataSize] = useState(0);

  useEffect(() => {
    // 保存されている設定を読み込み
    const loadSettings = () => {
      const settings = settingsService.loadSettings();
      if (settings.geminiApiKey) setApiKey(settings.geminiApiKey);
      if (settings.theme) setTheme(settings.theme);
      if (settings.language) setLanguage(settings.language);
      if (settings.autoSave !== undefined) setAutoSave(settings.autoSave);
      if (settings.initialQuestionCount) setInitialQuestionCount(settings.initialQuestionCount);
      if (settings.followupQuestionCount) setFollowupQuestionCount(settings.followupQuestionCount);
      
      // データサイズを計算
      setDataSize(settingsService.calculateStorageSize());
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settings: Settings = {
        geminiApiKey: apiKey,
        theme,
        language,
        autoSave,
        initialQuestionCount,
        followupQuestionCount,
      };
      
      const success = settingsService.saveSettings(settings);
      if (success) {
        geminiService.setApiKey(apiKey);
        
        // app.config.tsの値も更新（実行時のみ）
        APP_CONFIG.AI_QUESTIONS.INITIAL_QUESTION_COUNT = initialQuestionCount;
        APP_CONFIG.AI_QUESTIONS.FOLLOWUP_QUESTION_COUNT = followupQuestionCount;
        
        alert('設定を保存しました');
      } else {
        alert('設定の保存に失敗しました');
      }
    } catch (error) {
      console.error('設定の保存エラー:', error);
      alert('設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      alert('APIキーを入力してください');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    
    try {
      // APIキーを設定して初期化
      geminiService.initialize(apiKey);
      
      // 少し待ってから接続テスト
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = await geminiService.testConnection();
      setTestResult(success ? 'success' : 'failure');
      
      if (!success) {
        console.log('APIキーの形式を確認してください。正しい形式: AIzaSy...');
      }
    } catch (error) {
      console.error('接続テストエラー:', error);
      setTestResult('failure');
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearData = () => {
    if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      settingsService.clearAllData();
      alert('すべてのデータを削除しました');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    try {
      const dataStr = settingsService.exportData();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `diary_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('データエクスポートエラー:', error);
      alert('データのエクスポートに失敗しました');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        if (confirm('既存のデータを上書きしますか？')) {
          const success = settingsService.importData(jsonData);
          if (success) {
            alert('データをインポートしました');
            window.location.reload();
          } else {
            alert('データのインポートに失敗しました');
          }
        }
      } catch (error) {
        console.error('データインポートエラー:', error);
        alert('データのインポートに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'api', label: 'API設定', icon: '🔑' },
    { key: 'display', label: '表示設定', icon: '🎨' },
    { key: 'data', label: 'データ管理', icon: '💾' },
    { key: 'advanced', label: '詳細設定', icon: '⚙️' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">設定</h2>
        
        {/* タブナビゲーション */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* API設定タブ */}
        {activeTab === 'api' && (
          <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">API設定</h3>
          
          <div className="mb-4">
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini APIキー
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field pr-12"
                placeholder="AIzaSy..."
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google AI Studio
              </a>
              でAPIキーを取得できます
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey}
              className="px-4 py-2 bg-pastel-green hover:bg-green-300 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? '接続テスト中...' : '接続テスト'}
            </button>
            
            {testResult === 'success' && (
              <span className="text-green-600 py-2">✅ 接続成功</span>
            )}
            {testResult === 'failure' && (
              <span className="text-red-600 py-2">❌ 接続失敗</span>
            )}
          </div>
          </div>
        )}

        {/* 表示設定タブ */}
        {activeTab === 'display' && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">表示設定</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  テーマ
                </label>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="light"
                      checked={theme === 'light'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'pastel' | 'dark')}
                      className="mr-2"
                      disabled
                    />
                    <span className="text-gray-400">ライト（今後実装）</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pastel"
                      checked={theme === 'pastel'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'pastel' | 'dark')}
                      className="mr-2"
                    />
                    <span>パステル</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'pastel' | 'dark')}
                      className="mr-2"
                      disabled
                    />
                    <span className="text-gray-400">ダーク（今後実装）</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  言語
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ja' | 'en')}
                  className="input-field"
                  disabled
                >
                  <option value="ja">日本語</option>
                  <option value="en" disabled>English（今後実装）</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="mr-2"
                  />
                  <span>自動保存を有効にする</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  マインドマップの変更を自動的に保存します
                </p>
              </div>
            </div>
          </div>
        )}

        {/* データ管理タブ */}
        {activeTab === 'data' && (
          <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">データ管理</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              LocalStorageの使用状況
            </p>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-xs text-gray-500">
                データサイズ: {(dataSize / 1024).toFixed(2)} KB
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pastel-blue transition-all" 
                  style={{ width: `${Math.min((dataSize / (5 * 1024 * 1024)) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                使用率: {((dataSize / (5 * 1024 * 1024)) * 100).toFixed(1)}% / 5MB
              </div>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b">
            <h4 className="text-sm font-medium text-gray-700 mb-3">データのバックアップ</h4>
            <div className="flex space-x-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-pastel-green hover:bg-green-300 text-gray-800 rounded-lg"
              >
                📥 データをエクスポート
              </button>
              <label className="px-4 py-2 bg-pastel-blue hover:bg-blue-300 text-gray-800 rounded-lg cursor-pointer">
                📤 データをインポート
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              日記データをJSON形式でバックアップ・復元できます
            </p>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-pastel-red hover:bg-red-300 text-gray-800 rounded-lg"
            >
              ⚠️ 全データを削除
            </button>
            <p className="mt-2 text-xs text-red-600">
              この操作は取り消せません
            </p>
          </div>
          </div>
        )}

        {/* 詳細設定タブ */}
        {activeTab === 'advanced' && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">詳細設定</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  初回の質問数
                </label>
                <select
                  value={initialQuestionCount}
                  onChange={(e) => setInitialQuestionCount(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={1}>1つ</option>
                  <option value={2}>2つ</option>
                  <option value={3}>3つ</option>
                  <option value={4}>4つ</option>
                  <option value={5}>5つ</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  日記作成時に生成される質問の数
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  フォローアップ質問数
                </label>
                <select
                  value={followupQuestionCount}
                  onChange={(e) => setFollowupQuestionCount(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={1}>1つ</option>
                  <option value={2}>2つ</option>
                  <option value={3}>3つ</option>
                  <option value={4}>4つ</option>
                  <option value={5}>5つ</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  回答後に生成される追加質問の数
                </p>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    if (confirm('すべての設定を初期値に戻しますか？')) {
                      const defaultSettings = settingsService.getDefaultSettings();
                      setTheme(defaultSettings.theme || 'pastel');
                      setLanguage(defaultSettings.language || 'ja');
                      setAutoSave(defaultSettings.autoSave !== undefined ? defaultSettings.autoSave : true);
                      setInitialQuestionCount(defaultSettings.initialQuestionCount || 2);
                      setFollowupQuestionCount(defaultSettings.followupQuestionCount || 2);
                      setApiKey('');
                      alert('設定を初期値に戻しました');
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                  🔄 設定を初期値に戻す
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 保存ボタン */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};