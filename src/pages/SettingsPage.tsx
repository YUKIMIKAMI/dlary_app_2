import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/gemini';

interface Settings {
  geminiApiKey?: string;
}

export const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failure' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 保存されている設定を読み込み
    const loadSettings = () => {
      try {
        const settings = localStorage.getItem('app_settings');
        if (settings) {
          const parsed: Settings = JSON.parse(settings);
          if (parsed.geminiApiKey) {
            setApiKey(parsed.geminiApiKey);
          }
        }
      } catch (error) {
        console.error('設定の読み込みエラー:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settings: Settings = {
        geminiApiKey: apiKey,
      };
      localStorage.setItem('app_settings', JSON.stringify(settings));
      geminiService.setApiKey(apiKey);
      alert('設定を保存しました');
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
      localStorage.clear();
      alert('すべてのデータを削除しました');
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">設定</h2>
        
        {/* API設定 */}
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

        {/* データ管理 */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">データ管理</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              LocalStorageの使用状況
            </p>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-xs text-gray-500">
                データサイズ: 計算中...
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-pastel-blue" style={{ width: '20%' }}></div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                使用率: 約20% / 5MB
              </div>
            </div>
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

        {/* その他の設定（将来用） */}
        <div className="card opacity-50 pointer-events-none">
          <h3 className="text-lg font-semibold mb-4">その他の設定</h3>
          <p className="text-sm text-gray-500">
            テーマ設定、言語設定などは今後実装予定です
          </p>
        </div>

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