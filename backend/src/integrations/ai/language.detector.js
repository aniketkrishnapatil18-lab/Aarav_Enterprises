// ============================================================
// AI Integration: Language Detector
// Detects English / Hindi / Marathi / Mixed language
// ============================================================

// Marathi-specific Unicode characters and common words
const MARATHI_WORDS = [
  'आहे','नाही','माझ्या','तुमच्या','करायचा','बनवायचा','सांगा','कृपया','होय','नको',
  'आम्ही','तुम्ही','त्यांचा','करा','द्या','घ्या','मला','तुला','त्याला','आपल्या',
  'आणि','किंवा','पण','तर','जर','का','कसे','काय','केव्हा','कोठे','कोण','किती',
  'बनवा','डिझाईन','लोगो','व्हिजिटिंग','बॅनर','ब्रोशर','मेनू','फ्लेक्स','जाहिरात',
  'दुकान','व्यवसाय','कंपनी','नाव','रंग','किंमत','कधी','पाहिजे','आहेत','असेल',
];

// Hindi-specific common words (not shared with Marathi)
const HINDI_WORDS = [
  'है','नहीं','मुझे','आपका','करना','बनाना','बताओ','कृपया','हाँ','नहीं',
  'हम','आप','उनका','करें','दें','लें','मुझे','तुम्हें','उसे','हमारा',
  'और','या','लेकिन','तो','अगर','क्यों','कैसे','क्या','कब','कहाँ','कौन','कितना',
  'बनाओ','डिजाइन','लोगो','विजिटिंग','बैनर','ब्रोशर','मेनू','फ्लेक्स','विज्ञापन',
  'दुकान','व्यापार','कंपनी','नाम','रंग','कीमत','चाहिए','हैं','होगा','मेरा','मेरी',
];

// Devanagari script check
const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

// Common Hinglish / transliterated patterns
const HINGLISH_PATTERNS = [
  /\bmujhe\b/i, /\bapka\b/i, /\bbhai\b/i, /\byaar\b/i, /\bkarna\b/i,
  /\bbatao\b/i, /\bchahiye\b/i, /\bkya\b/i, /\bkaise\b/i, /\bkab\b/i,
  /\bmala\b/i,  /\bpahije\b/i, /\bsang\b/i, /\baahe\b/i, /\bnahi\b/i,
];

/**
 * Detect language from a text string.
 * Returns: 'en' | 'hi' | 'mr' | 'mixed'
 */
function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';

  const hasDevanagari = DEVANAGARI_REGEX.test(text);
  const lower = text.toLowerCase();

  if (hasDevanagari) {
    // Count Marathi vs Hindi indicator words
    const marathiScore = MARATHI_WORDS.filter(w => text.includes(w)).length;
    const hindiScore   = HINDI_WORDS.filter(w => text.includes(w)).length;

    if (marathiScore > hindiScore) return 'mr';
    if (hindiScore > marathiScore) return 'hi';

    // If both equally, use Marathi as default (Pune-based business)
    if (marathiScore > 0 || hindiScore > 0) return 'mr';

    // Has Devanagari but no clear indicator — could be either
    return 'hi';
  }

  // No Devanagari — check for Hinglish/transliterated patterns
  const hinglishMatches = HINGLISH_PATTERNS.filter(p => p.test(lower)).length;
  if (hinglishMatches >= 2) return 'mixed';

  // Pure English
  return 'en';
}

/**
 * Update language based on conversation history.
 * Returns the most frequent detected language.
 */
function resolveConversationLanguage(messages) {
  if (!messages || !messages.length) return 'en';
  const counts = { en: 0, hi: 0, mr: 0, mixed: 0 };
  for (const msg of messages) {
    if (msg.sender === 'customer' && msg.content) {
      const lang = detectLanguage(msg.content);
      counts[lang] = (counts[lang] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

module.exports = { detectLanguage, resolveConversationLanguage };
