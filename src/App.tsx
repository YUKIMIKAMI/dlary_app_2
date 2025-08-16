import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DiaryProvider } from './contexts/DiaryContext';
import { MindMapProvider } from './contexts/MindMapContext';
import { Header } from './components/common/Header';
import { DiaryPage } from './pages/DiaryPage';
import { MindMapPage } from './pages/MindMapPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
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