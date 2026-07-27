import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          success: false,
          error: 'الرسالة مطلوبة لتنفيذ الاستجابة',
        });
      }

      // Max length limit
      if (message.length > 1500) {
        return res.status(400).json({
          success: false,
          error: 'عذراً، يتجاوز طول الرسالة الحد المسموح به (1500 حرف).',
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback simulated smart response if API Key is not set in environment
        const isAr = language === 'ar';
        let fallbackIntent = 'general_question';
        let requiresConfirmation = false;
        let proposedAction = null;

        if (message.includes('فندق') || message.includes('حجز') || message.includes('فنادق')) {
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
        } else if (message.includes('ميزانية') || message.includes('تكلفة')) {
          fallbackIntent = 'budget_planning';
          requiresConfirmation = true;
          proposedAction = {
            actionType: 'CALCULATE_BUDGET',
            payload: {
              travelersCount: 2,
              days: 7,
              currency,
            },
            summary: `حساب ميزانية رحلة العمرة لشخصين لمدة 7 أيام بالعملة (${currency})`,
          };
        }

        return res.json({
          success: true,
          conversationId,
          message: isAr
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات رفيقك الذكي. بخصوص طلبك حول "${message.trim()}"، أستطيع إرشادك بدقة خطوة بخطوة وإعداد خيارات السكن والتنقل والحسابات المعتمدة.`
            : `Welcome Pilgrim! Regarding your request "${message.trim()}", I can guide you step-by-step through rituals, hotels, transport, and budget planning.`,
          intent: fallbackIntent,
          requiresConfirmation,
          proposedAction,
          suggestedReplies: isAr
            ? ['اشرح لي العمرة خطوة بخطوة', 'صمّم رحلتي', 'احسب ميزانيتي', 'أبحث عن فندق']
            : ['Explain Umrah steps', 'Design my trip', 'Calculate budget', 'Find hotel'],
        });
      }

      const systemInstruction = `
أنت عرفات، الرفيق الإيماني والوكيل الذكي لضيوف الرحمن.

مهمتك مساعدة الحجاج والمعتمرين في التخطيط للرحلة، وفهم المناسك، والوصول إلى الأماكن، وطلب الفنادق والنقل والخدمات، وحل المشكلات التي قد تواجههم.

تحدث بأسلوب مهذب، هادئ، وقور، واضح ومطمئن.

استخدم لغة المستخدم المختارة (${language})، والعملة (${currency})، وراعِ اتجاه اللغة وثقافتها.

في المسائل الدينية:
- لا تخترع حكمًا شرعيًا.
- لا تنسب قولًا إلى عالم أو جهة دون مصدر موثوق.
- وضّح عند وجود اختلاف فقهي معتبر.
- في المسائل الحساسة وجّه المستخدم إلى الجهات الرسمية أو أهل العلم المؤهلين.
- لا تقدم الفتوى الشخصية بصيغة جازمة.
- ميّز بين الإرشاد العام والحكم الشرعي.

في الحجوزات والخدمات:
- لا تدّعِ أن الحجز تم ما لم تؤكد نظام التنفيذ نجاحه.
- لا تخترع توفرًا أو سعرًا أو رقم حجز.
- اعرض الطلب على المستخدم بوضوح قبل تنفيذه.
- اطلب تأكيد المستخدم قبل أي إجراء مدفوع أو ملزم.
- اذكر بوضوح عندما يكون السعر تقديريًا.

في المواقع:
- لا تفترض موقع المستخدم.
- اطلب إذنه قبل استخدام موقعه.
- استخدم خدمات الخرائط عند توفرها.

في الصحة والطوارئ:
- لا تشخّص حالة طبية.
- قدم إرشادات عامة آمنة.
- وجّه المستخدم إلى الطوارئ أو الجهات الطبية عند وجود خطر.
- أعطِ الأولوية لسلامة المستخدم.

في البيانات:
- لا تطلب بيانات حساسة إلا عند الحاجة الفعلية.
- لا تعرض البيانات الشخصية في الرد.
- لا تطلب كلمات مرور أو رموز تحقق أو معلومات بطاقات بنكية داخل المحادثة.

إذا كان الطلب يحتاج تنفيذًا بشريًا أو نظامًا خارجيًا، حوّله إلى إجراء منظم ولا تدّعِ إتمامه قبل وصول نتيجة حقيقية من نظام التنفيذ.

يجب أن تصنف النية (intent) إلى واحدة من الفئات التالية:
[general_question, ritual_guidance, journey_planning, budget_planning, hotel_search, transport_request, booking_request, places_search, directions_request, permit_guidance, dua_and_adhkar, health_guidance, emergency, human_support, complaint, unknown]

المخرج المرجو يجب أن يكون JSON حصراً بالشكل التالي:
{
  "message": "نص الرد الموجه للمستخدم بلغة مهذبة وواضحة",
  "intent": "اسم النية المكتشفة",
  "requiresConfirmation": true_or_false,
  "proposedAction": null_or_object_with_actionType_payload_summary,
  "suggestedReplies": ["مقترح 1", "مقترح 2", "مقترح 3"]
}

أنواع الإجراءات المسجلة المتاحة لـ actionType فقط:
[SEARCH_HOTELS, REQUEST_HOTEL_BOOKING, REQUEST_TRANSPORT, DESIGN_JOURNEY, CALCULATE_BUDGET, SEARCH_PLACE, OPEN_DIRECTIONS, REQUEST_HUMAN_SUPPORT, CREATE_SERVICE_REQUEST]
`;

      const promptText = `User Context: ${JSON.stringify(userContext)}
User Message: "${message.trim()}"
Language: ${language}
Currency: ${currency}

Respond ONLY with valid JSON conforming to the requested schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
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
        message: 'نعتذر، حدثت صعوبة مؤقتة في التواصل مع الوكيل الذكي. يمكنك إعادت المحاولة.',
        intent: 'unknown',
        requiresConfirmation: false,
        proposedAction: null,
        suggestedReplies: ['إعادة المحاولة', 'التحدث مع موظف'],
      });
    }
  });

  // 1.1 🤖 وكيل عرفات (Legacy Compatible Route)
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, lang = 'ar', history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient();

      if (!ai) {
        const fallbackText = lang === 'ar'
          ? `أهلاً بك في منصة عرفات! أنا وكيلك الذكي. بخصوص استفسارك حول: "${message}"، يسعدني إرشادك في كافة مناسك الحج والعمرة، حساب الميزانية، وتحديد الأماكن والمواقيت بدقة.`
          : `Welcome to Arafat Platform! Regarding your question: "${message}", I am here to guide you through Hajj, Umrah, budget calculation, and holy sites navigation.`;
        return res.json({ response: fallbackText });
      }

      const systemInstruction = `أنت عرفات - وكيلك الذكي، المستشار والمساعد الإرشادي لمناسك الحج والعمرة والزيارة في مكة المكرمة والمدينة المنورة والمشاعر المقدسة.`;

      const formattedContents = [
        ...history.map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || (lang === 'ar' ? 'نعتذر، لم نتمكن من جلب الإجابة حالياً.' : 'Sorry, unable to get response.');
      return res.json({ response: replyText });

    } catch (err: any) {
      console.error('Error calling Gemini API:', err);
      return res.status(500).json({
        error: 'Failed to generate response from Arafat AI Agent',
        details: err.message,
      });
    }
  });

  // 1.5 🌐 خدمة الترجمة الفورية المباشرة لضيوف الرحمن (Instant Translation API)
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, sourceLang = 'auto', targetLang = 'ar' } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text to translate is required' });
      }

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback simulated translation if API key is not present
        return res.json({
          translatedText: text,
          sourceLang,
          targetLang,
          note: 'Offline/Default response mode',
        });
      }

      const prompt = `Translate the following text accurately for a Hajj/Umrah pilgrim or Saudi service provider.
Source Language: ${sourceLang}
Target Language: ${targetLang}
Text to Translate: "${text}"

Provide ONLY the clean translated text without any explanation, quotes, or markdown wrappers.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2,
        },
      });

      const translatedText = (response.text || text).trim();
      return res.json({
        translatedText,
        sourceLang,
        targetLang,
      });
    } catch (err: any) {
      console.error('Translation endpoint error:', err);
      return res.status(500).json({
        error: 'Failed to translate text',
        details: err.message,
      });
    }
  });

  // 10. 👤 حساب المستخدم والتسجيل والدخول والاشتراك
  app.post('/api/auth/register', (req, res) => {
    const { country, phone, email, name, subscription = 'free' } = req.body;
    if (!phone || !email) {
      return res.status(400).json({ error: 'Phone and Email are required' });
    }
    const user = {
      id: 'usr_' + Date.now(),
      name: name || 'ضيف الرحمن',
      country: country || 'المملكة العربية السعودية',
      phone,
      email,
      subscriptionPlan: subscription,
      trialDaysLeft: subscription === 'free' ? 7 : 30,
      whatsappConnected: true,
      createdAt: new Date().toISOString(),
    };
    return res.json({ success: true, user, message: 'تم إنشاء حسابك بنجاح وربطه بالواتساب' });
  });

  app.post('/api/auth/login', (req, res) => {
    const { phoneOrEmail } = req.body;
    if (!phoneOrEmail) {
      return res.status(400).json({ error: 'Phone or Email is required' });
    }
    const user = {
      id: 'usr_active',
      name: 'ضيف الرحمن',
      country: 'المملكة العربية السعودية',
      phone: phoneOrEmail.includes('@') ? '+966500000000' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'user@arafat.app',
      subscriptionPlan: '7_days_trial',
      trialDaysLeft: 7,
      whatsappConnected: true,
    };
    return res.json({ success: true, user });
  });

  // 8. 📱 WhatsApp Cloud API Connection Simulator
  app.post('/api/whatsapp/connect', (req, res) => {
    const { phone } = req.body;
    return res.json({
      success: true,
      phone,
      status: 'connected',
      message: `تم ربط رقمك ${phone} ببرنامج الواتساب السحابي لمنصة عرفات لتلقي التنبيهات وإشعار الحجوزات.`,
    });
  });

  // 9. 💳 Payment Processing Simulator
  app.post('/api/payments/subscribe', (req, res) => {
    const { plan, paymentMethod, amount, currency } = req.body;
    return res.json({
      success: true,
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      plan,
      amount,
      currency,
      paymentMethod,
      message: 'تمت عملية الاشتراك بنجاح! تم تفعيل حسابك المتقدم في عرفات.',
    });
  });

  // Vite or Static file serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arafat Platform Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
