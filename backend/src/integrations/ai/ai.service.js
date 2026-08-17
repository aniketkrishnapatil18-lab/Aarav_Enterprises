// ============================================================
// AI Integration: Main AI Service
// Supports: mock (default), openai, gemini
// Configure via AI_PROVIDER env variable
// ============================================================

require('dotenv').config();
const axios = require('axios');
const { buildSystemPrompt, buildConversationContext } = require('./prompts');
const { getMockResponse } = require('./mock.ai');
const { detectLanguage } = require('./language.detector');

function extractCleanTextMessage(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    if (val.message) return extractCleanTextMessage(val.message);
    if (val.text) return extractCleanTextMessage(val.text);
    return '';
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && (trimmed.endsWith('}') || trimmed.includes('"message"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.message) return extractCleanTextMessage(parsed.message);
        if (parsed.text) return extractCleanTextMessage(parsed.text);
      } catch (e) {}
    }
    return val;
  }
  return String(val);
}

function sanitizeAiResult(res) {
  if (!res) return res;
  if (res.message) {
    res.message = extractCleanTextMessage(res.message);
  }
  return res;
}

/**
 * Process incoming WhatsApp message through AI
 * Returns structured response with message, collectedData, inquiryReady, humanHandoff
 */
async function processMessage({
  userMessage,
  language,
  conversationHistory = [],
  collectedData = {},
  serviceContext = null,
  knowledge = {},
  products = [],
}) {
  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  let result;
  try {
    if (provider === 'openai') {
      result = await callOpenAI({ userMessage, language, conversationHistory, collectedData, serviceContext, knowledge, products });
    } else if (provider === 'gemini') {
      result = await callGemini({ userMessage, language, conversationHistory, collectedData, serviceContext, knowledge, products });
    } else {
      result = getMockResponse(userMessage, language, conversationHistory, collectedData, serviceContext);
    }
    return sanitizeAiResult(result);
  } catch (err) {
    const status = err.response?.status;
    const errMsg = err.response?.data?.error?.message || err.message;
    if (status === 429) {
      console.error(`[AI] ❌ Rate limit hit on ${provider} (429). Falling back to mock. Consider switching AI_MODEL.`);
    } else {
      console.error(`[AI] ❌ Error from ${provider}: ${errMsg}`);
    }
    // Graceful fallback
    result = getMockResponse(userMessage, language, conversationHistory, collectedData, serviceContext);
    return sanitizeAiResult(result);
  }
}

// ── OpenAI Integration ──────────────────────────────────────

async function callOpenAI({ userMessage, language, conversationHistory, collectedData, serviceContext, knowledge, products }) {
  const systemPrompt = buildSystemPrompt(knowledge, language, serviceContext, conversationHistory, products);
  const ctxText      = buildConversationContext(conversationHistory.slice(-15));

  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  if (ctxText) {
    messages.push({ role: 'user', content: `Previous conversation:\n${ctxText}` });
    messages.push({ role: 'assistant', content: 'I understand the conversation so far.' });
  }

  if (collectedData && Object.keys(collectedData).length > 0) {
    messages.push({
      role: 'user',
      content: `Already collected data: ${JSON.stringify(collectedData)}`,
    });
    messages.push({ role: 'assistant', content: 'I have noted the collected information.' });
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model:       process.env.AI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens:  800,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type':  'application/json',
      },
      timeout: 30000,
    }
  );

  const raw = response.data.choices[0].message.content;
  return JSON.parse(raw);
}

// ── Gemini Integration ──────────────────────────────────────

async function callGemini({ userMessage, language, conversationHistory, collectedData, serviceContext, knowledge, products }) {
  const systemPrompt = buildSystemPrompt(knowledge, language, serviceContext, conversationHistory, products);
  const ctxText      = buildConversationContext(conversationHistory.slice(-15));

  const prompt = `${systemPrompt}\n\nPrevious conversation:\n${ctxText || '(none)'}\n\nCurrently collected data: ${JSON.stringify(collectedData || {})}\n\nCustomer's latest message: "${userMessage}"\n\nYou MUST respond with valid JSON. The "message" field must be a complete, helpful response.`;

  const modelName = process.env.AI_MODEL || 'gemini-3.5-flash';

  // Single clean request — no responseMimeType (avoids empty output error on all Gemini versions)
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.AI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
      },
    },
    { timeout: 30000 }
  );

  const candidate = response.data.candidates?.[0];
  const finishReason = candidate?.finishReason;
  if (!candidate?.content?.parts?.[0]?.text) {
    throw new Error(`Gemini returned empty output (finishReason: ${finishReason})`);
  }

  let raw = candidate.content.parts[0].text;

  const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // If raw output starts with { it is JSON, parse it
  if (clean.startsWith('{')) {
    try {
      return JSON.parse(clean);
    } catch (parseErr) {
      // Partial JSON — extract message field with regex
      const msgMatch = clean.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      return {
        message: msgMatch ? msgMatch[1].replace(/\\n/g, '\n') : clean,
        collectedData: {},
        inquiryReady: false,
        humanHandoff: false,
        language: language || 'en',
        aiSummary: null,
      };
    }
  }

  // Plain text response — wrap it
  return {
    message: clean,
    collectedData: {},
    inquiryReady: false,
    humanHandoff: false,
    language: language || 'en',
    aiSummary: null,
  };
}

module.exports = { processMessage };
