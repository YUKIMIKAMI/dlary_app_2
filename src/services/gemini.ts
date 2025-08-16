import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private apiKey: string | null = null;

  initialize(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini APIキーが設定されていません');
    }
    console.log('Initializing Gemini with API key:', apiKey.substring(0, 10) + '...');
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    // gemini-1.5-flash を使用（無料で利用可能）
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini initialized successfully with model: gemini-1.5-flash');
  }

  isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  async generateQuestions(diaryContent: string): Promise<string[]> {
    if (!this.isInitialized()) {
      const apiKey = this.getApiKeyFromEnv() || this.getApiKeyFromStorage();
      if (apiKey) {
        this.initialize(apiKey);
      } else {
        console.warn('Gemini APIキーが設定されていません。フォールバック質問を使用します。');
        return this.getFallbackQuestions(diaryContent);
      }
    }

    try {
      const prompt = `
あなたは経験豊富な心理カウンセラーです。以下の日記を丁寧に読み、書いた人の内面を深く理解した上で、自己探求を促す質問を3つ生成してください。

【質問作成の指針】

質問は必ず以下の要素を含めてください：

1. **日記の具体的な内容への言及**
   - 日記に登場する具体的な人物名、場所、出来事、感情表現を必ず引用する
   - 例：「〇〇さんと話したときに感じた△△という気持ちについて...」

2. **深層心理への問いかけ**
   - 表面的な出来事の奥にある本当の願望、恐れ、価値観を探る
   - 「本当は」「実は」「もしかすると」などの言葉を使って深層を探る

3. **具体的な場面の想起**
   - 「その瞬間」「そのとき」など、特定の場面を思い出させる
   - 五感（見た、聞いた、感じた）に訴える質問

4. **矛盾や葛藤の探求**
   - 日記に現れる矛盾した感情や迷いに焦点を当てる
   - 「一方で...他方で...」という両面性を探る

5. **未来への橋渡し**
   - この経験が今後どう影響するか、何を変えたいかを問う

【良い質問の例】
- 「プレゼンで緊張したと書かれていますが、その緊張の奥にある『認められたい』という願望と『失敗への恐れ』のバランスをどう感じていますか？」
- 「友人との会話で感じた違和感は、あなたの中のどんな価値観が反応したのでしょうか？」

【避けるべき質問】
- 単純な「なぜ？」「どうして？」
- 日記の内容を無視した一般論
- Yes/Noで答えられる閉じた質問

日記内容：
${diaryContent}

出力形式（JSON配列、各質問は必ず日記の具体的内容に言及し、40-80文字程度にする）:
["質問1", "質問2", "質問3"]
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // JSONを抽出してパース
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(questions) && questions.length >= 3) {
          return questions.slice(0, 3);
        }
      }
      
      // パースに失敗した場合はフォールバック
      return this.getFallbackQuestions(diaryContent);
    } catch (error) {
      console.error('質問生成エラー:', error);
      return this.getFallbackQuestions(diaryContent);
    }
  }

  async generateFollowUpQuestions(originalQuestion: string, answer: string, diaryContent?: string): Promise<string[]> {
    if (!this.isInitialized()) {
      return this.getFallbackFollowUpQuestions(originalQuestion, answer);
    }

    try {
      const prompt = `
あなたは深層心理学に精通したカウンセラーです。以下の対話を注意深く分析し、回答者がまだ言語化できていない深層を探るフォローアップ質問を3つ生成してください。

【フォローアップ質問作成の指針】

質問は必ず以下の要素を含めてください：

1. **回答の具体的な言葉を引用**
   - 回答者が使った特定の言葉、表現、例えを必ず引用する
   - 例：「あなたが『○○』と表現したとき、その言葉の裏には...」

2. **矛盾やアンビバレントな感情の探求**
   - 回答に潜む「でも」「しかし」「一方で」のような両価性を探る
   - 言い淀み、ためらい、間があった部分に注目

3. **感覚や身体感覚への問いかけ**
   - 「そのとき身体のどこにどんな感覚があったか」
   - 「その感情を色や形で表すとしたら」

4. **時間軸の探求**
   - 過去の似た経験とのつながり
   - 未来への影響や希望
   - 「この感覚を初めて感じたのはいつ」

5. **関係性のパターンを探る**
   - 回答に現れた人物との関係性
   - 自分自身との関係
   - 「その人があなたにとって象徴しているもの」

6. **本質的なニーズや恐れの探求**
   - 「本当に欲しかったのは」
   - 「最も恐れていたのは」
   - 「もし制限がなかったら」

【良いフォローアップ質問の例】
- 「『仕事が大変だった』と書かれていますが、その『大変』の中に隐れている、認められたい気持ちや貢献したい思いはどのくらいありますか？」
- 「『友人に理解されなかった』とありますが、理解されなかったあなたのどの部分が、実は最も大切にしている部分だったのでしょうか？」
${diaryContent ? `
元の日記内容：
${diaryContent}
` : ''}
元の質問：${originalQuestion}
回答：${answer}

出力形式（JSON配列、各質問は回答の具体的内容を引用した40-80文字の深い質問）:
["質問1", "質問2", "質問3"]
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(questions) && questions.length >= 3) {
          return questions.slice(0, 3);
        }
      }
      
      return this.getFallbackFollowUpQuestions(originalQuestion, answer);
    } catch (error) {
      console.error('フォローアップ質問生成エラー:', error);
      return this.getFallbackFollowUpQuestions(originalQuestion, answer);
    }
  }

  private getApiKeyFromEnv(): string | null {
    return import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  private getApiKeyFromStorage(): string | null {
    try {
      const settings = localStorage.getItem('app_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.geminiApiKey || null;
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
    return null;
  }

  private getFallbackQuestions(content: string): string[] {
    // 日記の内容に基づいてより具体的な質問を生成
    const contentSnippet = content.slice(0, 50);
    const hasFeeling = content.includes('嬉しい') || content.includes('楽しい') || 
                       content.includes('悲しい') || content.includes('辛い') ||
                       content.includes('不安') || content.includes('イライラ');
    const hasActivity = content.includes('行った') || content.includes('した') || 
                        content.includes('やった') || content.includes('会った');
    const hasPerson = content.includes('さん') || content.includes('友') || 
                      content.includes('家族') || content.includes('同僚');
    
    const questions = [];
    
    if (hasFeeling) {
      questions.push(`今日感じた感情の中で、特に強く心に残っているものは何でしょうか？その感情があなたに教えてくれていることは？`);
    } else {
      questions.push(`「${contentSnippet}...」と書かれていますが、この出来事があなたにとって特別だった理由は何でしょうか？`);
    }
    
    if (hasPerson) {
      questions.push(`今日の人との関わりの中で、あなたが本当に求めていたもの、または与えたかったものは何でしたか？`);
    } else if (hasActivity) {
      questions.push(`今日の行動の中で、あなたが無意識に避けていたこと、または選んでいたことはありましたか？`);
    } else {
      questions.push(`今日一日を振り返って、もし一つだけやり直せるとしたら、どの瞬間を選びますか？それはなぜ？`);
    }
    
    questions.push(`今日のあなたが、半年前のあなたと違う点は何でしょうか？その変化をどう感じていますか？`);
    
    return questions.slice(0, 3);
  }

  private getFallbackFollowUpQuestions(originalQuestion?: string, answer?: string): string[] {
    // 回答内容からキーワードを抽出してより具体的な質問を生成
    const answerSnippet = answer ? answer.slice(0, 30) : '';
    
    const questions = [];
    
    if (answer && answer.length > 20) {
      questions.push(
        `「${answerSnippet}...」という回答の中で、あなたが本当に伝えたかったが言葉にできなかったことは何でしょうか？`
      );
      
      if (answer.includes('思') || answer.includes('感')) {
        questions.push(
          `その感覚や思いを体感したとき、身体のどこにどんな感覚がありましたか？それは何を教えてくれていますか？`
        );
      } else {
        questions.push(
          `この経験を通して、あなたの中で変化した価値観や優先順位はありますか？それともより強固になったものは？`
        );
      }
      
      questions.push(
        `このテーマについて、5年後のあなたが今のあなたにアドバイスするとしたら、何と言うと思いますか？`
      );
    } else {
      // 回答が短い場合のデフォルト質問
      questions.push(
        '今の答えの背景にある、あなたにとって大切な価値観や信念は何でしょうか？',
        'このテーマに関して、過去の自分と今の自分で最も大きく変わった点は何ですか？',
        'もし今、あなたの内心が本当に求めているものがあるとしたら、それは何でしょうか？'
      );
    }
    
    return questions.slice(0, 3);
  }

  setApiKey(apiKey: string) {
    this.initialize(apiKey);
    // 設定を保存
    try {
      const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');
      settings.geminiApiKey = apiKey;
      localStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('APIキーの保存エラー:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.isInitialized()) {
        return false;
      }

      const result = await this.model.generateContent('Test connection: respond with "OK"');
      const response = await result.response;
      const text = response.text();
      console.log('Connection test response:', text);
      return text.length > 0;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();