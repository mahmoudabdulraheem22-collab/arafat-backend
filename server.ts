import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const currentDir = process.cwd();

type ProposedAction = {
  actionType: string;
  payload: Record<string, unknown>;
  summary: string;
};

type GeminiStructuredResponse = {
  message?: string;
  intent?: string;
  requiresConfirmation?: boolean;
  proposedAction?: ProposedAction | null;
  suggestedReplies?: string[];
};

async function startServer(): Promise<void> {
  const app = express();

  const PORT = Number(process.env.PORT) || 8080;

  app.disable('x-powered-by');

  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use(express.json({ limit: '12mb' }));

  const getGeminiClient = (): GoogleGenAI | null => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn(
        'GEMINI_API_KEY is not defined. Falling back to default assistant responses.',
      );
      return null;
    }

    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'arafat-platform',
        },
      },
    });
  };

  // ==========================================
  // Health Check
  // ==========================================

  app.get('/api/health', (_req: Request, res: Response) => {
    return res.status(200).json({
      status: 'ok',
      service: 'Arafat Platform Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // Main Arafat AI Agent
  // ==========================================

  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const conversationId =
      typeof req.body?.conversationId === 'string' &&
      req.body.conversationId.trim()
        ? req.body.conversationId.trim()
        : `conv_${Date.now()}`;

    try {
      const {
        message,
        language = 'ar',
        currency = 'SAR',
        userContext = {},
        image = null,
      } = req.body ?? {};

      const hasValidMessage =
        typeof message === 'string' && message.trim().length > 0;

      if (!hasValidMessage && !image) {
        return res.status(400).json({
          success: false,
          conversationId,
          error: 'الرسالة أو الصورة مطلوبة لتنفيذ الاستجابة',
        });
      }

      const userText = hasValidMessage
        ? message.trim()
        : 'الرجاء تحليل هذه الصورة الملتقطة بالكاميرا وإفادتي بالإرشادات المناسبة.';

      if (userText.length > 2000) {
        return res.status(400).json({
          success: false,
          conversationId,
          error: 'عذراً، يتجاوز طول الرسالة الحد المسموح به.',
        });
      }

      const selectedLanguage =
        typeof language === 'string' ? language : 'ar';

      const selectedCurrency =
        typeof currency === 'string' ? currency : 'SAR';

      const ai = getGeminiClient();

      if (!ai) {
        const isArabic = selectedLanguage === 'ar';

        let fallbackIntent = 'general_question';
        let requiresConfirmation = false;
        let proposedAction: ProposedAction | null = null;
        let fallbackText = '';

        if (image) {
          fallbackIntent = 'ritual_guidance';

          fallbackText = isArabic
            ? 'تم استقبال الصورة بنجاح. يمكنني مساعدتك في فهم ما يظهر فيها وتقديم إرشادات مناسبة.'
            : 'The image was received successfully. I can help explain what appears in it and provide suitable guidance.';
        } else if (
          userText.includes('فندق') ||
          userText.includes('حجز') ||
          userText.includes('فنادق')
        ) {
          fallbackIntent = 'hotel_search';
          requiresConfirmation = true;

          proposedAction = {
            actionType: 'REQUEST_HOTEL_BOOKING',
            payload: {
              city: 'مكة المكرمة',
              nights: 3,
              guests: 2,
              budget: `1,200 ${selectedCurrency}`,
            },
            summary:
              'طلب البحث عن فندق في مكة المكرمة لمدة 3 ليالٍ',
          };

          fallbackText = isArabic
            ? `السلام عليكم ورحمة الله وبركاته. بخصوص طلبك: "${userText}"، أستطيع مساعدتك في البحث عن فندق مناسب خطوة بخطوة.`
            : `Welcome. Regarding your request: "${userText}", I can help you find a suitable hotel step by step.`;
        } else {
          fallbackText = isArabic
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات، رفيقك الذكي. بخصوص طلبك: "${userText}"، أستطيع إرشادك بدقة.`
            : `Welcome. I am Arafat, your intelligent companion. Regarding your request: "${userText}", I can guide you clearly.`;
        }

        return res.status(200).json({
          success: true,
          conversationId,
          message: fallbackText,
          intent: fallbackIntent,
          requiresConfirmation,
          proposedAction,
          suggestedReplies: isArabic
            ? [
                'اشرح لي العمرة خطوة بخطوة',
                'احسب ميزانيتي',
                'ابحث عن فندق',
                'أرشدني إلى مكان',
              ]
            : [
                'Explain Umrah step by step',
                'Calculate my budget',
                'Find a hotel',
                'Guide me to a place',
              ],
        });
      }

      const systemInstruction = `
أنت عرفات، الرفيق الإيماني والوكيل الذكي لضيوف الرحمن.
مهمتك مساعدة الحجاج والمعتمرين في التخطيط للرحلة، وفهم المناسك، والوصول إلى الأماكن، وتنظيم الطلبات الخدمية.
تحدث بأسلوب مهذب وهادئ ووقور وواضح ومطمئن.
لا تدّعِ تنفيذ حجز أو دفع أو إجراء فعلي قبل تأكيد المستخدم.
أعد الاستجابة بصيغة JSON صحيحة فقط.
`;

      const promptText = `
User Context:
${JSON.stringify(userContext)}

User Message:
${userText}

Language:
${selectedLanguage}

Currency:
${selectedCurrency}

Return valid JSON with exactly these fields:
{
  "message": "string",
  "intent": "string",
  "requiresConfirmation": true,
  "proposedAction": null,
  "suggestedReplies": ["string"]
}
`;

      const parts: Array<Record<string, unknown>> = [];

      if (image) {
        let base64Data = '';
        let mimeType = 'image/jpeg';

        if (typeof image === 'string') {
          const match = image.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
          );

          if (match) {
            mimeType = match[1];
            base64Data = match[2];
          } else {
            base64Data = image;
          }
        } else if (
          typeof image === 'object' &&
          image !== null &&
          typeof image.data === 'string'
        ) {
          base64Data = image.data;

          if (typeof image.mimeType === 'string') {
            mimeType = image.mimeType;
          }
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

      parts.push({
        text: promptText,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '{}';

      let parsedResponse: GeminiStructuredResponse;

      try {
        parsedResponse = JSON.parse(rawText) as GeminiStructuredResponse;
      } catch {
        parsedResponse = {
          message:
            response.text ||
            'أهلاً بك في منصة عرفات، كيف أستطيع خدمتك اليوم؟',
          intent: 'general_question',
          requiresConfirmation: false,
          proposedAction: null,
          suggestedReplies: [
            'صمّم رحلتي',
            'احسب ميزانيتي',
            'مناسك العمرة',
          ],
        };
      }

      return res.status(200).json({
        success: true,
        conversationId,
        message:
          parsedResponse.message ||
          'أهلاً بك في منصة عرفات، كيف أستطيع خدمتك اليوم؟',
        intent: parsedResponse.intent || 'general_question',
        requiresConfirmation: Boolean(
          parsedResponse.requiresConfirmation,
        ),
        proposedAction: parsedResponse.proposedAction || null,
        suggestedReplies: Array.isArray(
          parsedResponse.suggestedReplies,
        )
          ? parsedResponse.suggestedReplies
          : [],
      });
    } catch (error) {
      console.error('Error in /api/ai/chat:', error);

      return res.status(500).json({
        success: false,
        conversationId,
        message:
          'نعتذر، حدثت صعوبة مؤقتة في التواصل مع الوكيل الذكي.',
        intent: 'unknown',
        requiresConfirmation: false,
        proposedAction: null,
        suggestedReplies: ['إعادة المحاولة', 'التحدث مع موظف'],
      });
    }
  });

  // ==========================================
  // Legacy Gemini Chat
  // ==========================================

  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { message } = req.body ?? {};

      if (typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          error: 'Message is required',
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          response: `أهلاً بك في منصة عرفات. بخصوص استفسارك: "${message.trim()}"`,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: message.trim(),
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        response: response.text || '',
      });
    } catch (error) {
      console.error('Error in /api/gemini/chat:', error);

      return res.status(500).json({
        error: 'Failed to generate response',
      });
    }
  });

  // ==========================================
  // Translation
  // ==========================================

  app.post('/api/translate', async (req: Request, res: Response) => {
    try {
      const {
        text,
        sourceLang = 'auto',
        targetLang = 'ar',
      } = req.body ?? {};

      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({
          error: 'Text required',
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          translatedText: text.trim(),
          sourceLang,
          targetLang,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text:\n\n${text.trim()}`,
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        translatedText: response.text?.trim() || text.trim(),
        sourceLang,
        targetLang,
      });
    } catch (error) {
      console.error('Error in /api/translate:', error);

      return res.status(500).json({
        error: 'Failed to translate',
      });
    }
  });

  // ==========================================
  // Temporary Simulator Routes
  // ==========================================

  app.post('/api/auth/register', (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'تم التسجيل بنجاح',
    });
  });

  app.post('/api/auth/login', (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
    });
  });

  app.post('/api/whatsapp/connect', (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
    });
  });

  app.post('/api/payments/subscribe', (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
    });
  });

  // ==========================================
  // Serve Frontend
  // ==========================================

  const distPath = path.join(currentDir, 'dist');
  const indexPath = path.join(distPath, 'index.html');

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    fs.existsSync(indexPath);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }

      if (!fs.existsSync(indexPath)) {
        return res.status(404).json({
          success: false,
          error: 'Frontend build not found',
        });
      }

      return res.sendFile(indexPath);
    });
  }

  // ==========================================
  // API 404
  // ==========================================

  app.use('/api', (_req: Request, res: Response) => {
    return res.status(404).json({
      success: false,
      error: 'API route not found',
    });
  });

  // ==========================================
  // Global Error Handler
  // ==========================================

  app.use(
    (
      error: unknown,
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      console.error('Unhandled server error:', error);

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    },
  );

  // ==========================================
  // Start Server
  // ==========================================

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Arafat Platform Full-Stack Server running on 0.0.0.0:${PORT}`,
    );
  });

  server.on('error', (error) => {
    console.error('HTTP server error:', error);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
