// ============================================================
// AI Integration: Mock AI Service (for local development)
// Replace with real AI provider in production via AI_PROVIDER env
// ============================================================

const { detectLanguage } = require('./language.detector');

// Human handoff keywords
const HANDOFF_KEYWORDS = {
  en: ['talk to human', 'speak to someone', 'real person', 'human agent', 'contact support'],
  hi: ['किसी से बात', 'इंसान से बात', 'व्यक्ति से बात', 'मुझे किसी से'],
  mr: ['माणसाशी बोलायचं', 'व्यक्तीशी बोलायचं', 'direct बोलायचं', 'तुमच्याशी बोलायचं'],
};

function isHumanHandoff(text) {
  const lower = text.toLowerCase();
  for (const keywords of Object.values(HANDOFF_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k.toLowerCase()))) return true;
  }
  return false;
}

function getGreeting(language) {
  const greetings = {
    en: "Hello! 👋 Welcome to Aarav Enterprises! We offer professional graphic design services:\n\n🎨 *Logo Design* — ₹999 onwards\n📇 *Visiting Card* — ₹299 onwards\n📖 *Brochure* — ₹799 onwards\n🚩 *Banner/Flex* — ₹499 onwards\n🍽️ *Menu Card* — ₹599 onwards\n📱 *Social Media Post* — ₹199 per post\n\nWhich service do you need today? 😊",
    hi: "नमस्ते! 👋 Aarav Enterprises में आपका स्वागत! हमारी सेवाएं:\n\n🎨 *लोगो डिजाइन* — ₹999 से\n📇 *विजिटिंग कार्ड* — ₹299 से\n📖 *ब्रोशर* — ₹799 से\n🚩 *बैनर/फ्लेक्स* — ₹499 से\n🍽️ *मेनू कार्ड* — ₹599 से\n📱 *सोशल मीडिया पोस्ट* — ₹199 प्रति पोस्ट\n\nआज आपको कौन सी सेवा चाहिए? 😊",
    mr: "नमस्कार! 👋 Aarav Enterprises मध्ये स्वागत! आमच्या सेवा:\n\n🎨 *लोगो डिझाईन* — ₹999 पासून\n📇 *व्हिजिटिंग कार्ड* — ₹299 पासून\n📖 *ब्रोशर* — ₹799 पासून\n🚩 *बॅनर/फ्लेक्स* — ₹499 पासून\n🍽️ *मेनू कार्ड* — ₹599 पासून\n📱 *सोशल मीडिया पोस्ट* — ₹199 प्रति पोस्ट\n\nतुम्हाला कोणती सेवा हवी आहे? 😊",
    mixed: "Hello! 👋 Aarav Enterprises मध्ये स्वागत! आमच्या services:\n\n🎨 Logo Design — ₹999+\n📇 Visiting Card — ₹299+\n📖 Brochure — ₹799+\n🚩 Banner — ₹499+\n🍽️ Menu Card — ₹599+\n📱 Social Media Post — ₹199/post\n\nकोणती service हवी? 😊",
  };
  return greetings[language] || greetings.en;
}

function getMockResponse(userMessage, language, conversationHistory, collectedData, serviceContext) {
  const lower = userMessage.toLowerCase();

  // Human handoff detection
  if (isHumanHandoff(userMessage)) {
    const messages = {
      en: "I understand you'd like to speak with our team directly. I'll flag your conversation for immediate attention. Our team will get back to you shortly during business hours (Mon-Sat: 10AM-7PM). 🙏",
      hi: "मैं समझता हूं कि आप हमारी टीम से सीधे बात करना चाहते हैं। मैं आपकी बातचीत को तुरंत ध्यान के लिए चिह्नित करूंगा। हमारी टीम जल्द ही आपसे संपर्क करेगी (सोम-शनि: सुबह 10 बजे - शाम 7 बजे)। 🙏",
      mr: "मला समजते की तुम्हाला आमच्या टीमशी थेट बोलायचे आहे. मी तुमची बातचीत तात्काळ लक्षात येण्यासाठी चिन्हांकित करतो. आमची टीम लवकरच तुमच्याशी संपर्क साधेल (सोम-शनि: सकाळी 10 - संध्याकाळी 7). 🙏",
      mixed: "I understand! मी तुमची conversation team साठी flag करतो. आमची team लवकरच संपर्क करेल. 🙏",
    };
    return {
      message: messages[language] || messages.en,
      collectedData: collectedData || {},
      inquiryReady: false,
      humanHandoff: true,
      language,
      aiSummary: null,
    };
  }

  // Price inquiries
  const priceKeywords = ['price', 'cost', 'rate', 'kitila', 'kitilahe', 'कितीला', 'कितना', 'दर', 'किंमत', 'कीमत', 'how much', 'charges'];
  if (priceKeywords.some(k => lower.includes(k))) {
    const priceResponses = {
      en: "Here are our starting prices:\n\n🎨 Logo Design: ₹999 onwards\n📇 Visiting Card: ₹299 onwards\n📖 Brochure: ₹799 onwards\n🍽️ Menu Card: ₹599 onwards\n🚩 Banner Design: ₹499 onwards\n📱 Social Media Post: ₹199 per post\n📄 Pamphlet/Flyer: ₹499 onwards\n\nFinal price depends on complexity and requirements. Which service are you interested in? 😊",
      hi: "हमारी शुरुआती कीमतें:\n\n🎨 लोगो डिजाइन: ₹999 से\n📇 विजिटिंग कार्ड: ₹299 से\n📖 ब्रोशर: ₹799 से\n🍽️ मेनू कार्ड: ₹599 से\n🚩 बैनर डिजाइन: ₹499 से\n📱 सोशल मीडिया पोस्ट: ₹199 प्रति पोस्ट\n\nआप कौन सी सेवा में रुचि रखते हैं? 😊",
      mr: "आमच्या सुरुवातीच्या किंमती:\n\n🎨 लोगो डिझाईन: ₹999 पासून\n📇 व्हिजिटिंग कार्ड: ₹299 पासून\n📖 ब्रोशर: ₹799 पासून\n🍽️ मेनू कार्ड: ₹599 पासून\n🚩 बॅनर डिझाईन: ₹499 पासून\n📱 सोशल मीडिया पोस्ट: ₹199 प्रति पोस्ट\n\nतुम्हाला कोणत्या सेवेत रुची आहे? 😊",
      mixed: "Starting prices:\n🎨 Logo Design: ₹999+\n📇 Visiting Card: ₹299+\n📖 Brochure: ₹799+\n🚩 Banner: ₹499+\n🍽️ Menu Card: ₹599+\n📱 Social Media: ₹199/post\n\nकोणती service हवी? 😊",
    };
    return {
      message: priceResponses[language] || priceResponses.en,
      collectedData: collectedData || {},
      inquiryReady: false,
      humanHandoff: false,
      language,
      aiSummary: null,
    };
  }

  // Logo inquiry
  const logoKeywords = ['logo', 'लोगो', 'logo design'];
  if (logoKeywords.some(k => lower.includes(k))) {
    const cd = collectedData || {};
    if (!cd.businessName) {
      const asks = {
        en: "Great! 😊 We create professional logos starting at ₹999. Could you tell me your **business or company name** and what industry you're in?",
        hi: "बहुत अच्छा! 😊 हम ₹999 से प्रोफेशनल लोगो बनाते हैं। आपके **बिजनेस या कंपनी का नाम** और किस इंडस्ट्री में हैं, बता सकते हैं?",
        mr: "नक्की! 😊 आम्ही ₹999 पासून प्रोफेशनल लोगो डिझाईन करतो. तुमच्या **व्यवसायाचे नाव** आणि कोणत्या क्षेत्रात आहात ते सांगा?",
        mixed: "Great! 😊 Logo design ₹999+ पासून. तुमचं **business name** आणि industry सांगा.",
      };
      return {
        message: asks[language] || asks.en,
        collectedData: { ...cd, service: 'Logo Design' },
        inquiryReady: false,
        humanHandoff: false,
        language,
        aiSummary: null,
      };
    }
  }

  // Visiting card inquiry
  const vcKeywords = ['visiting card', 'business card', 'card design', 'व्हिजिटिंग कार्ड', 'विजिटिंग कार्ड', 'visiting'];
  if (vcKeywords.some(k => lower.includes(k))) {
    const cd = collectedData || {};
    const asks = {
      en: "Excellent! 😊 Visiting cards start at ₹299. Could you share your **full name**, **company name**, and **designation** for the card?",
      hi: "बहुत अच्छा! 😊 विजिटिंग कार्ड ₹299 से शुरू। कार्ड के लिए **पूरा नाम**, **कंपनी का नाम** और **पदनाम** बता सकते हैं?",
      mr: "छान! 😊 व्हिजिटिंग कार्ड ₹299 पासून. कार्डसाठी **पूर्ण नाव**, **कंपनीचे नाव** आणि **पद** सांगा.",
      mixed: "Great! 😊 Visiting card ₹299+. **नाव**, **company** आणि **designation** सांगा.",
    };
    return {
      message: asks[language] || asks.en,
      collectedData: { ...cd, service: 'Visiting Card Design' },
      inquiryReady: false,
      humanHandoff: false,
      language,
      aiSummary: null,
    };
  }

  // Brochure inquiry — includes common typos
  const brochureKeywords = ['brochure', 'broucher', 'brocher', 'brosher', 'ब्रोशर', 'पुस्तिका', 'booklet'];
  if (brochureKeywords.some(k => lower.includes(k))) {
    const cd = collectedData || {};
    const asks = {
      en: "Great! 😊 We design professional brochures starting at ₹799. Could you tell me your **business name** and what the brochure is for (marketing, product showcase, etc.)?",
      hi: "बहुत अच्छा! 😊 हम ₹799 से ब्रोशर डिजाइन करते हैं। **बिजनेस का नाम** और ब्रोशर किस काम के लिए चाहिए (मार्केटिंग, प्रोडक्ट, आदि)?",
      mr: "नक्की! 😊 आम्ही ₹799 पासून ब्रोशर डिझाईन करतो. **व्यवसायाचे नाव** आणि ब्रोशर कोणत्या उद्देशासाठी हवे (मार्केटिंग, प्रोडक्ट इ.)?",
      mixed: "Great! 😊 Brochure ₹799+. **Business name** आणि purpose सांगा.",
    };
    return {
      message: asks[language] || asks.en,
      collectedData: { ...cd, service: 'Brochure Design' },
      inquiryReady: false,
      humanHandoff: false,
      language,
      aiSummary: null,
    };
  }

  // Banner/Flex inquiry
  const bannerKeywords = ['banner', 'flex', 'hoarding', 'बॅनर', 'बैनर', 'फ्लेक्स', 'flex board'];
  if (bannerKeywords.some(k => lower.includes(k))) {
    const cd = collectedData || {};
    const asks = {
      en: "Perfect! 😊 Banner/Flex designs start at ₹499. Could you tell me the **size** (width × height in feet) and what content goes on it?",
      hi: "बिल्कुल! 😊 बैनर/फ्लेक्स ₹499 से। कृपया **साइज** (चौड़ाई × ऊंचाई फीट में) और content बताएं?",
      mr: "नक्की! 😊 बॅनर/फ्लेक्स ₹499 पासून. **आकार** (रुंदी × उंची फुटात) आणि काय content हवे ते सांगा?",
      mixed: "Great! 😊 Banner ₹499+. **Size** (feet) आणि content सांगा.",
    };
    return {
      message: asks[language] || asks.en,
      collectedData: { ...cd, service: 'Banner/Flex Design' },
      inquiryReady: false,
      humanHandoff: false,
      language,
      aiSummary: null,
    };
  }

  // Menu card inquiry
  const menuKeywords = ['menu', 'menu card', 'मेनू', 'restaurant menu'];
  if (menuKeywords.some(k => lower.includes(k))) {
    const cd = collectedData || {};
    const asks = {
      en: "Wonderful! 😊 Menu cards start at ₹599. Could you tell me your **restaurant name** and roughly how many items/categories you have?",
      hi: "बहुत अच्छा! 😊 मेनू कार्ड ₹599 से। **रेस्तरां का नाम** और लगभग कितने items/categories हैं, बताएं?",
      mr: "छान! 😊 मेनू कार्ड ₹599 पासून. **रेस्टॉरंटचे नाव** आणि किती items/categories आहेत ते सांगा?",
      mixed: "Great! 😊 Menu card ₹599+. **Restaurant name** आणि items count सांगा.",
    };
    return {
      message: asks[language] || asks.en,
      collectedData: { ...cd, service: 'Menu Card Design' },
      inquiryReady: false,
      humanHandoff: false,
      language,
      aiSummary: null,
    };
  }

  // Pamphlet/Flyer/Social Media
  const pamphletKeywords = ['pamphlet', 'flyer', 'पत्रक', 'flyer design'];
  if (pamphletKeywords.some(k => lower.includes(k))) {
    const cd = collectedData || {};
    return {
      message: language === 'hi'
        ? "बहुत अच्छा! 😊 पैम्फलेट/फ्लायर ₹499 से। इसका उद्देश्य क्या है और कितनी quantity चाहिए?"
        : language === 'mr'
        ? "नक्की! 😊 पत्रक/फ्लायर ₹499 पासून. उद्देश काय आहे आणि किती quantity हवी?"
        : "Great! 😊 Pamphlet/Flyer design starts at ₹499. What is the purpose and how many copies do you need?",
      collectedData: { ...cd, service: 'Pamphlet/Flyer Design' },
      inquiryReady: false,
      humanHandoff: false,
      language,
      aiSummary: null,
    };
  }

  // Default — always show services (never show a confusing generic message)
  return {
    message: getGreeting(language),
    collectedData: collectedData || {},
    inquiryReady: false,
    humanHandoff: false,
    language,
    aiSummary: null,
  };
}

module.exports = { getMockResponse, isHumanHandoff, getGreeting };
