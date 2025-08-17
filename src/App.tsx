import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DiaryProvider } from './contexts/DiaryContext';
import { MindMapProvider } from './contexts/MindMapContext';
import { Header } from './components/common/Header';
import { DiaryPage } from './pages/DiaryPage';
import { MindMapPage } from './pages/MindMapPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { APP_CONFIG } from './config/app.config';

function App() {
  useEffect(() => {
    // アプリ起動時に設定を読み込む
    const loadSettings = () => {
      try {
        const settings = localStorage.getItem('app_settings');
        if (settings) {
          const parsed = JSON.parse(settings);
          if (parsed.initialQuestionCount) {
            APP_CONFIG.AI_QUESTIONS.INITIAL_QUESTION_COUNT = parsed.initialQuestionCount;
          }
          if (parsed.followupQuestionCount) {
            APP_CONFIG.AI_QUESTIONS.FOLLOWUP_QUESTION_COUNT = parsed.followupQuestionCount;
          }
        }
      } catch (error) {
        console.error('設定の読み込みエラー:', error);
      }
    };
    loadSettings();
  }, []);
  return (
    <DiaryProvider>
      <MindMapProvider>
        <Router>
          <div className="min-h-screen bg-pastel-gray">
            <Header />
            
            <main>
              <Routes>
                <Route path="/" element={<DiaryPage />} />
                <Route path="/mindmap/:id" element={<MindMapPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </MindMapProvider>
    </DiaryProvider>
  );
}

export default App;