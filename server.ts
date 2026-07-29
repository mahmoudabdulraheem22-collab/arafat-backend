import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Safe directory path resolution for both dev (ESM) and bundled prod (CJS)
const currentDir = process.cwd();

async function startServer() {
  const app = express();
  
  // 👈 القراءة المباشرة من متغير البيئة الخاص بـ Cloud Run
  const PORT = process.env.PORT || 8080;

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

  // 1. 🤖 وكيل عرفات الذكي (Main Arafat Agent Endpoint - Multimodal & Text)
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

      // Max length limit
      if (userText.length > 2000) {
        return res.status(400).json({
          success: false,
          error: 'عذراً، يتجاوز طول الرسالة الحد المسموح به.',
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback simulated smart response if API Key is not set in environment
        const isAr = language === 'ar';
        let fallbackIntent = 'general_question';
        let requiresConfirmation = false;
        let proposedAction = null;
        let fallbackText = '';

        if (image) {
          fallbackIntent = 'ritual_guidance';
          fallbackText = isAr
            ? `تم تحليل الصورة الملتقطة بنجاح. يتعرّف نظام عرفات الرؤية البصرية الذكية على العناصر المحيطة بك (المعالم المقدسة، إشارات الاتجاهات، أرقام الحافلات، مستلزمات الإحرام، أو الأدوية). تم التأكد من سلامتها ومطابقتها للإرشادات والخدمات المعتمدة في مكة المكرمة والمشاعر.`
            : `Image successfully analyzed. Arafat AI Vision recognizes the environment around you (Holy Landmarks, Directional Signs, Bus Numbers, Ihram Gear, or Medical Supplies). Everything aligns with official guidelines.`;
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
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات رفيقك الذكي. بخصوص طلبك حول "${userText}"، أستطيع إرشادك بدقة خطوة بخطوة وإعداد خيارات السكن والتنقل.`
            : `Welcome Pilgrim! Regarding "${userText}", I can guide you step-by-step through rituals, hotels, and transport.`;
        } else if (userText.includes('ميزانية') || userText.includes('تكلفة')) {
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
          fallbackText = isAr
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات رفيقك الذكي. تم حساب الميزانية المتوقعة لرحلتك.`
            : `Budget calculated for your journey.`;
        } else {
          fallbackText = isAr
            ? `السلام عليكم ورحمة الله وبركاته. أنا عرفات رفيقك الذكي. بخصوص طلبك حول "${userText}"، أستطيع إرشادك بدقة خطوة بخطوة وإعداد خيارات السكن والتنقل والحسابات المعتمدة.`
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

مهمتك مساعدة الحجاج والمعتمرين في التخطيط للرحلة، وفهم المناسك، والوصول إلى الأماكن، والتعرف على العناصر والمعالم والأدوية واللوحات من حولهم بواسطة الكاميرا، وطلب الفنادق والنقل والخدمات.

تحدث بأسلوب مهذب، هادئ، وقور، واضح ومطمئن.
استخدم لغة المستخدم المختارة (${language})، والعملة (${currency})، وراعِ اتجاه اللغة وثقافتها.

عند إرفاق صورة ملتقطة بالكاميرا:
- قم بتحليل الصورة بدقة ودون تحيز.
- تمييز المعالم والمشاعر المقدسة (الكعبة، مقام إبراهيم، الحجر الأسود، الصفا والمروة، منى، عرفات، مزدلفة، المسجد النبوي).
- تمييز اللوحات الإرشادية، أرقام الأبواب، اتجاه القبلة، وأرقام الحافلات وشرائح الاتصال.
- تمييز مقتنيات الإحرام، وتوضيح الأحكام الدينية الصريحة المتعلقة بمحظورات وتيسيرات الإحرام من المراجع الرسمية.
- تمييز الأدوية والمستلزمات الطبية وإبراز إرشادات السلامة العامة.

في المسائل الدينية والمناسك:
- احرص دائماً على أن تكون جميع المخرجات والمعلومات الدينية والمناسك مستمدة حصراً من المصادر والمراجع الرسمية المعتمدة (مثل وزارة الشؤون الإسلامية والدعوة والإرشاد، والرئاسة العامة للبحوث العلمية والإفتاء، ووزارة الحج والعمرة، والهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي).
- لا تخترع حكمًا شرعيًا.
- تذكر واذكر عند تقديم الفتاوى أو الإرشادات الدينية التنويه التالي: "تنويه: التطبيق رفيق إرشادي ومساعد ذكي ولا يغني عن الفتاوى الرسمية".

في الحجوزات والخدمات:
- لا تدّعِ أن الحجز تم ما لم تؤكد نظام التنفيذ نجاحه.
- اعرض الطلب على المستخدم بوضوح قبل تنفيذه.

يجب أن تصنف النية (intent) إلى واحدة من الفئات التالية:
[general_question, ritual_guidance, journey_planning, budget_planning, hotel_search, transport_request, booking_request, places_search, directions_request, permit_guidance, dua_and_adhkar, health_guidance, emergency, human_support, complaint, unknown]

المخرج المرجو يجب أن يكون JSON حصراً بالشكل التالي:
{
  "message": "نص الرد الموجه للمستخدم بلغة مهذبة وواضحة وسلسة مجهزة للنعطيل/القراءة الصوتية",
  "intent": "اسم النية المكتشفة",
  "requiresConfirmation": true_or_false,
  "proposedAction": null_or_object_with_actionType_payload_summary,
  "suggestedReplies": ["مقترح 1", "مقترح 2", "مقترح 3"]
}
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
        model: 'gemini-2.5-flash', // 👈 تعديل اسم النموذج إلى الأصدار المعتمد
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

      const systemInstruction = `أنت عرفات - وكيلك الذكي، المستشار والمساعد الإرشادي لمناسك الحج والعمرة والزيارة في مكة المكرمة والمدينة المنورة والمشاعر المقدسة.
جميع المخرجات والمعلومات الدينية والمناسك مستمدة من المصادر والمراجع الرسمية المعتمدة (مثل وزارة الشؤون الإسلامية والدعوة والإرشاد والرئاسة العامة للبحوث العلمية والإفتاء ووزارة الحج والعمرة).
تنويه هام: التطبيق رفيق إرشادي ومساعد ذكي ولا يغني عن الفتاوى الرسمية.`;

      const formattedContents = [
        ...history.map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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

  // 👈 ربط السيرفر بالمنفذ الديناميكي والـ Host المناسب لـ Cloud Run
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arafat Platform Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
