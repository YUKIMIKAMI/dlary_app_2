interface AppSettings {
  geminiApiKey?: string;
  theme?: 'light' | 'pastel' | 'dark';
  language?: 'ja' | 'en';
  autoSave?: boolean;
  initialQuestionCount?: number;
  followupQuestionCount?: number;
}

class SettingsService {
  private readonly SETTINGS_KEY = 'app_settings';

  // 簡易的な暗号化（Base64エンコード）
  private encryptApiKey(key: string): string {
    try {
      return btoa(key);
    } catch {
      return key;
    }
  }

  // 簡易的な復号化（Base64デコード）
  private decryptApiKey(encrypted: string): string {
    try {
      return atob(encrypted);
    } catch {
      return encrypted;
    }
  }

  // 設定を読み込む
  loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        // APIキーを復号化
        if (settings.geminiApiKey) {
          settings.geminiApiKey = this.decryptApiKey(settings.geminiApiKey);
        }
        return settings;
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
    return this.getDefaultSettings();
  }

  // 設定を保存する
  saveSettings(settings: AppSettings): boolean {
    try {
      const toSave = { ...settings };
      // APIキーを暗号化
      if (toSave.geminiApiKey) {
        toSave.geminiApiKey = this.encryptApiKey(toSave.geminiApiKey);
      }
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(toSave));
      return true;
    } catch (error) {
      console.error('設定の保存エラー:', error);
      return false;
    }
  }

  // デフォルト設定を取得
  getDefaultSettings(): AppSettings {
    return {
      theme: 'pastel',
      language: 'ja',
      autoSave: true,
      initialQuestionCount: 2,
      followupQuestionCount: 2,
    };
  }

  // 設定をリセット
  resetSettings(): void {
    const defaultSettings = this.getDefaultSettings();
    this.saveSettings(defaultSettings);
  }

  // LocalStorageのデータサイズを計算
  calculateStorageSize(): number {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return totalSize;
  }

  // データをエクスポート
  exportData(): string {
    const allData: any = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        allData[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(allData, null, 2);
  }

  // データをインポート
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      for (let key in data) {
        localStorage.setItem(key, data[key]);
      }
      return true;
    } catch (error) {
      console.error('データインポートエラー:', error);
      return false;
    }
  }

  // 全データをクリア
  clearAllData(): void {
    localStorage.clear();
  }
}

export const settingsService = new SettingsService();