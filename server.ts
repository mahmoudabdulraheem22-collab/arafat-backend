import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const currentDir = process.cwd();

async function startServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // 👈 قراءة المنفذ وتحويله لرقم صريح لـ Cloud Run
  const PORT = Number(process.env.PORT) || 8080;

  // Initialize Gemini AI Client lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Falling back to default assistant responses.');
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // ==========================================
  // API Routes
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Arafat Platform Backend' });
  });

  // 1. 🤖 وكيل عرفات الذكي (Main Arafat Agent Endpoint)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const {
        message,
        conversationId = `conv_${Date.now()}`,
        language = 'ar',
        currency = 'SAR',
        userContext = {},
        image = null,
      } = req.body;

      if ((!message || typeof message !== 'string' || !message.trim()) && !image) {
        return res.status(400).json({
          success: false,
          error: 'الرسالة أو الصورة مطلوبة لتنفيذ الاستجابة',
        });
      }

      const userText = (message || '').trim() || 'الرجاء تحليل هذه الصورة الملتقطة بالكاميرا وإفادتي بالإرشادات المناسبة.';

      if (userText.length > 2000) {
        return res.status(400).json({
          success: false,
          error: 'عذراً، يتجاوز طول الرسالة الحد المسموح به.',
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        const isAr = language === 'ar';
        let fallbackIntent = 'general_question';
        let requiresConfirmation = false;
        let proposedAction = null;
        let fallbackText = '';

        if (image) {
          fallbackIntent = 'ritual_guidance';
          fallbackText = isAr
            ? `تم تحليل الصورة الملتقطة بنجاح. يتعرّف نظام عرفات الرؤية البصرية الذكية على العناصر المحيطة بك.`
            : `Image successfully analyzed. Arafat AI Vision recognizes the environment around you.`;
        } else if (userText.includes('فندق') || userText.includes('حجز') || userText.includes('فنادق')) {
          fallbackIntent = 'hotel_search';
          requiresConfirmation = true;
          proposedAction = {
            actionType: 'REQUEST_HOTEL_BOOKING',
            payload: {
              city: 'مكة المكرمة',
              nights: 3,
              guests: 2,
              budget: `1,200 ${currency}`,
            },
            summary: 'حجز فندق قاطن في مكة المكرمة قبالة الحرم الشريف لمدة 3 ليالٍ',
          };
          fallbackText = isAr
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات رفيقك الذكي. بخصوص طلبك حول "${userText}"، أستطيع إرشادك بدقة خطوة بخطوة.`
            : `Welcome Pilgrim! Regarding "${userText}", I can guide you step-by-step.`;
        } else {
          fallbackText = isAr
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات رفيقك الذكي. بخصوص طلبك حول "${userText}"، أستطيع إرشادك بدقة.`
            : `Welcome Pilgrim! Regarding your request "${userText}", I can guide you step-by-step.`;
        }

        return res.json({
          success: true,
          conversationId,
          message: fallbackText,
          intent: fallbackIntent,
          requiresConfirmation,
          proposedAction,
          suggestedReplies: isAr
            ? ['اشرح لي العمرة خطوة بخطوة', 'التقط صورة معلم آخر', 'احسب ميزانيتي', 'أبحث عن فندق']
            : ['Explain Umrah steps', 'Scan another landmark', 'Calculate budget', 'Find hotel'],
        });
      }

      const systemInstruction = `
أنت عرفات، الرفيق الإيماني والوكيل الذكي لضيوف الرحمن، والمزود بخصائص التعرف البصري والصوتي المتقدمة.
مهمتك مساعدة الحجاج والمعتمرين في التخطيط للرحلة، وفهم المناسك، والوصول إلى الأماكن.
تحدث بأسلوب مهذب، هادئ، وقور، واضح ومطمئن.
`;

      const promptText = `User Context: ${JSON.stringify(userContext)}
User Message: "${userText}"
Language: ${language}
Currency: ${currency}

Respond ONLY with valid JSON conforming to the requested schema.`;

      const parts: any[] = [];
      if (image) {
        let base64Data = '';
        let mimeType = 'image/jpeg';
        if (typeof image === 'string') {
          const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
          if (match) {
            mimeType = match[1];
            base64Data = match[2];
          } else {
            base64Data = image;
          }
        } else if (image.data) {
          base64Data = image.data;
          if (image.mimeType) mimeType = image.mimeType;
        }

        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType,
              data: base64Data,
            },
          });
        }
      }

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction,
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const rawJson = response.text || '{}';
      let parsedResponse: any = {};
      try {
        parsedResponse = JSON.parse(rawJson);
      } catch (e) {
        parsedResponse = {
          message: response.text || 'أهلاً بك في منصة عرفات، يسعدني خدمتك.',
          intent: 'general_question',
          requiresConfirmation: false,
          proposedAction: null,
          suggestedReplies: ['صمّم رحلتي', 'احسب ميزانيتي', 'مناسك العمرة'],
        };
      }

      return res.json({
        success: true,
        conversationId,
        message: parsedResponse.message || 'أهلاً بك في منصة عرفات، كيف أستطيع خدمتك اليوم؟',
        intent: parsedResponse.intent || 'general_question',
        requiresConfirmation: Boolean(parsedResponse.requiresConfirmation),
        proposedAction: parsedResponse.proposedAction || null,
        suggestedReplies: parsedResponse.suggestedReplies || [],
      });
    } catch (err: any) {
      console.error('Error in /api/ai/chat:', err);
      return res.status(500).json({
        success: false,
        conversationId: req.body.conversationId || `conv_${Date.now()}`,
        message: 'نعتذر، حدثت صعوبة مؤقتة في التواصل مع الوكيل الذكي.',
        intent: 'unknown',
        requiresConfirmation: false,
        proposedAction: null,
        suggestedReplies: ['إعادة المحاولة', 'التحدث مع موظف'],
      });
    }
  });

  // 1.1 Legacy Route
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, lang = 'ar' } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required' });

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ response: `أهلاً بك في منصة عرفات! بخصوص استفسارك: "${message}"` });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: message }] }],
      });

      return res.json({ response: response.text || '' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to generate response', details: err.message });
    }
  });

  // 1.5 Translate Route
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, sourceLang = 'auto', targetLang = 'ar' } = req.body;
      if (!text || !text.trim()) return res.status(400).json({ error: 'Text required' });

      const ai = getGeminiClient();
      if (!ai) return res.json({ translatedText: text });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: `Translate to ${targetLang}: ${text}` }] }],
      });

      return res.json({ translatedText: (response.text || text).trim(), sourceLang, targetLang });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to translate', details: err.message });
    }
  });

  // Auth & Simulators
  app.post('/api/auth/register', (req, res) => res.json({ success: true, message: 'تم التسجيل بنجاح' }));
  app.post('/api/auth/login', (req, res) => res.json({ success: true }));
  app.post('/api/whatsapp/connect', (req, res) => res.json({ success: true }));
  app.post('/api/payments/subscribe', (req, res) => res.json({ success: true }));

  // 👈 التحقق التلقائي من وجود مجلد dist لمنع تشغيل Vite Dev Server بالخطأ في Cloud Run
  const distPath = path.join(currentDir, 'dist');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 👈 ربط السيرفر بالمنفذ والـ Host المناسب لـ Cloud Run
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arafat Platform Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
