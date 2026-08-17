// ============================================================
// Service: Webhook Pipeline
// Full flow: Receive → Identify → Language → AI → Respond → Store → Notify
// ============================================================

const customerModel      = require('../models/customer.model');
const conversationModel  = require('../models/conversation.model');
const inquiryModel       = require('../models/inquiry.model');
const knowledgeModel     = require('../models/knowledge.model');
const notificationModel  = require('../models/notification.model');
const productModel       = require('../models/product.model');
const attachmentModel    = require('../models/attachment.model');
const portfolioModel     = require('../models/portfolio.model');

const waService          = require('../integrations/whatsapp/whatsapp.service');
const aiService          = require('../integrations/ai/ai.service');
const { detectLanguage, resolveConversationLanguage } = require('../integrations/ai/language.detector');

// ── Sample Image Intent Detection ─────────────────────────────────────────────

const SAMPLE_IMAGE_PATTERNS = [
  // English
  /send.{0,10}sample/i, /show.{0,10}sample/i, /show.{0,10}design/i,
  /send.{0,10}design/i, /sample.{0,10}image/i, /send.{0,10}image/i,
  /show.{0,10}image/i,  /see.{0,10}sample/i,  /see.{0,10}design/i,
  /show.{0,10}portfolio/i, /send.{0,10}portfolio/i,
  /example.{0,15}design/i, /previous.{0,10}work/i, /your.{0,10}work/i,
  /some.{0,10}sample/i,  /some.{0,10}design/i,  /\bportfolio\b/i,
  // Hindi
  /sample.{0,10}भेज/i, /design.{0,10}दिखा/i, /sample.{0,10}दिखा/i,
  /कुछ.{0,10}sample/i, /कुछ.{0,10}design/i, /दिखाओ/i,
  /पुराने.{0,10}design/i, /भेज.{0,10}दो/i,
  // Marathi
  /sample.{0,10}पाठव/i, /design.{0,10}दाखव/i, /sample.{0,10}दाखव/i,
  /काही.{0,10}sample/i, /काही.{0,10}design/i, /दाखवा/i,
  /previous.{0,10}design/i,
];

function detectSampleImageIntent(message) {
  if (!message) return false;
  return SAMPLE_IMAGE_PATTERNS.some(p => p.test(message));
}

/**
 * Send portfolio sample images to a customer on WhatsApp
 * Returns the AI follow-up text message to send after images
 */
async function sendSampleImages(phone, message, language) {
  const categorySlug = portfolioModel.mapCategorySlug(message);

  const followUpMessages = {
    en: {
      withCat:  (cat) => `Here are some of our *${cat}* samples from Aarav Enterprises! 😊\n\nLet me know which style you like and I can help you with the next steps.`,
      noCat:    () => `Here are some of our design samples from Aarav Enterprises! 😊\n\nLet me know which style you like and we can create something similar for you.`,
      noStock:  (cat) => `I don't currently have ${cat ? cat + ' ' : ''}samples available in our portfolio right now, but our team can create a custom design for you! Could you tell me more about what you're looking for?`,
    },
    hi: {
      withCat:  (cat) => `ये हमारे *${cat}* के कुछ samples हैं Aarav Enterprises से! 😊\n\nआपको कौन सा style पसंद आया, बताइए।`,
      noCat:    () => `ये हमारे कुछ design samples हैं Aarav Enterprises से! 😊\n\nआपको कौन सा style पसंद आया, बताइए।`,
      noStock:  (cat) => `अभी ${cat ? cat + ' के ' : ''}samples उपलब्ध नहीं हैं, लेकिन हम आपके लिए custom design बना सकते हैं! आपको क्या चाहिए?`,
    },
    mr: {
      withCat:  (cat) => `हे आमचे *${cat}* चे काही samples आहेत Aarav Enterprises कडून! 😊\n\nतुम्हाला यापैकी कोणता style आवडला ते सांगा.`,
      noCat:    () => `हे आमचे काही design samples आहेत Aarav Enterprises कडून! 😊\n\nतुम्हाला यापैकी कोणता style आवडला ते सांगा.`,
      noStock:  (cat) => `सध्या ${cat ? cat + ' चे ' : ''}samples उपलब्ध नाहीत, पण आम्ही तुमच्यासाठी नवीन design करू शकतो! तुम्हाला काय हवे आहे?`,
    },
    mixed: {
      withCat:  (cat) => `हे आमचे *${cat}* चे samples आहेत! 😊\n\nकोणता style आवडला? Let me know!`,
      noCat:    () => `हे आमचे design samples आहेत! 😊\n\nकोणता style आवडला? Let me know!`,
      noStock:  (cat) => `${cat ? cat + ' चे ' : ''}samples सध्या नाहीत, पण custom design करू! काय हवे आहे?`,
    },
  };

  const lang   = ['en','hi','mr','mixed'].includes(language) ? language : 'en';
  const msgs   = followUpMessages[lang];
  const catName = categorySlug ? categorySlug.replace(/-/g, ' ') : null;

  // Fetch samples from DB
  let samples = [];
  if (categorySlug) {
    samples = await portfolioModel.getForWhatsApp(categorySlug, 5);
  }

  // If no category match or no samples for that category, try fetching any active samples
  if (!samples.length) {
    const [rows] = await require('../config/database').getPool().execute(
      `SELECT p.*, c.name AS category_name FROM portfolio p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.is_active=1 AND p.whatsapp_sample=1
       ORDER BY p.is_featured DESC LIMIT 4`
    );
    samples = rows;
  }

  if (!samples.length) {
    return msgs.noStock(catName);
  }

  // Send each image
  let sentCount = 0;
  for (let i = 0; i < Math.min(samples.length, 5); i++) {
    const s = samples[i];
    const cap = s.caption || `${s.title} — Aarav Enterprises`;
    const result = await waService.sendImageMessage(phone, s.image_url, cap);
    if (result.success) sentCount++;
    // Small delay between images to avoid rate limiting
    if (i < samples.length - 1) await new Promise(r => setTimeout(r, 400));
  }

  if (sentCount === 0) {
    return msgs.noStock(catName);
  }

  return catName ? msgs.withCat(catName) : msgs.noCat();
}


async function processIncomingMessage(parsedMessage) {
  const { waMessageId, phone, name, content, mediaId, msgType, timestamp } = parsedMessage;

  try {
    // ── Step 1: Find or create customer ──────────────────────
    const { customer } = await customerModel.findOrCreate(phone, name);

    // ── Step 2: Find or create active conversation ────────────
    let conversation = await conversationModel.findActiveConversation(phone);
    const isNew      = !conversation;

    if (!conversation) {
      conversation = await conversationModel.createConversation({
        customer_id: customer.id,
        phone,
        language:    customer.preferred_language || 'en',
      });
    }

    // ── Step 3: Store incoming message ────────────────────────
    const msgId = await conversationModel.addMessage({
      conversation_id:  conversation.id,
      wa_message_id:    waMessageId,
      sender:           'customer',
      message_type:     msgType,
      content,
      media_id:         mediaId || null,
      sent_at:          timestamp,
      is_ai_generated:  false,
    });

    await conversationModel.incrementMessageCount(conversation.id);

    // Handle media attachments
    if (mediaId) {
      await handleMediaAttachment(mediaId, conversation, customer, msgId);
    }

    // ── Step 4: Detect language ───────────────────────────────
    const recentMessages = await conversationModel.getRecentMessages(conversation.id, 10);
    const detectedLang   = detectLanguage(content || '');
    const convLang       = resolveConversationLanguage(recentMessages);
    const language       = detectedLang !== 'en' ? detectedLang : convLang;

    // Update language if changed
    if (language !== conversation.language) {
      await conversationModel.updateConversation(conversation.id, { language });
      await customerModel.updateLanguage(phone, language);
    }

    // ── Step 5: Load AI context ───────────────────────────────
    const knowledge  = await knowledgeModel.getAsMap();
    const products   = await productModel.getAll({ activeOnly: true, limit: 20 });
    const aiContext  = typeof conversation.ai_context === 'string'
      ? JSON.parse(conversation.ai_context || '{}')
      : (conversation.ai_context || {});
    const serviceCtx = conversation.service_context;

    // Build conversation history for AI
    const history = recentMessages.slice(-15).map(m => ({
      sender:  m.sender,
      content: m.content,
    }));

    // ── Step 6: Process with AI (or send sample images) ───────
    let aiResult;
    if (!content || content.startsWith('[')) {
      // No text content (media only) — acknowledge
      aiResult = await getMediaAcknowledgement(language, msgType);
    } else if (detectSampleImageIntent(content)) {
      // ── Image sample request detected — bypass AI, send images directly ──
      console.log(`[Webhook] 📸 Sample image request from ${phone}: "${content.substring(0, 60)}"`);
      const followUpText = await sendSampleImages(phone, content, language);
      // Store the image follow-up as AI message
      await conversationModel.addMessage({
        conversation_id: conversation.id,
        sender:          'ai',
        message_type:    'text',
        content:         followUpText,
        language,
        is_ai_generated: true,
        sent_at:         new Date(),
      });
      await conversationModel.incrementMessageCount(conversation.id);
      // Send follow-up text via WhatsApp
      await waService.sendTextMessage(phone, followUpText);
      if (waMessageId) await waService.markAsRead(waMessageId).catch(() => {});
      return { success: true, imageSent: true, aiMessage: followUpText };
    } else {
      aiResult = await aiService.processMessage({
        userMessage:       content,
        language,
        conversationHistory: history,
        collectedData:     aiContext.collectedData || {},
        serviceContext:    serviceCtx,
        knowledge,
        products,
      });
    }


    // ── Step 7: Update AI context ─────────────────────────────
    const newAiContext = {
      ...aiContext,
      collectedData: aiResult.collectedData || aiContext.collectedData || {},
      language:      aiResult.language || language,
      inquiryReady:  aiResult.inquiryReady || false,
    };
    await conversationModel.updateConversation(conversation.id, {
      ai_context:      newAiContext,
      language,
    });

    // ── Step 8: Handle human handoff ─────────────────────────
    if (aiResult.humanHandoff) {
      await conversationModel.markHumanHandoff(conversation.id);
      await notificationModel.create({
        type:  'human_handoff',
        title: '🙋 Human Handoff Requested',
        body:  `Customer ${name || phone} has requested to speak with a human agent.`,
        data:  { conversationId: conversation.id, customerId: customer.id, phone },
      });
    }

    // ── Step 9: Create inquiry if ready ──────────────────────
    let inquiry = null;
    if (aiResult.inquiryReady && !aiContext.inquiryCreated) {
      const cd = aiResult.collectedData || {};
      // Find product if service name matches
      let productId = null;
      if (cd.service) {
        const allProducts = await productModel.getAll({ activeOnly: true });
        const matched = allProducts.find(p =>
          p.name.toLowerCase().includes(cd.service.toLowerCase()) ||
          cd.service.toLowerCase().includes(p.name.toLowerCase())
        );
        if (matched) productId = matched.id;
      }

      inquiry = await inquiryModel.create({
        customer_id:      customer.id,
        product_id:       productId,
        service_name:     cd.service || serviceCtx,
        language,
        business_name:    cd.businessName,
        requirements:     cd.requirements || JSON.stringify(cd),
        budget:           cd.budget,
        deadline:         cd.deadline,
        preferred_colors: cd.colors,
        quantity:         cd.quantity,
        ai_summary:       aiResult.aiSummary,
        collected_data:   cd,
      });

      await customerModel.incrementInquiries(customer.id);
      await conversationModel.updateConversation(conversation.id, { inquiry_id: inquiry.id });

      // Update AI context to mark inquiry created
      await conversationModel.updateConversation(conversation.id, {
        ai_context: { ...newAiContext, inquiryCreated: true, inquiryId: inquiry.id },
      });

      // Notify admin
      await notificationModel.create({
        type:  'new_inquiry',
        title: `🔔 New Inquiry: ${cd.service || 'Design Service'}`,
        body:  `Customer: ${name || phone}\nService: ${cd.service || 'Unknown'}\nLanguage: ${language.toUpperCase()}\nBudget: ${cd.budget || 'Not specified'}`,
        data:  {
          inquiryId:    inquiry.id,
          customerId:   customer.id,
          service:      cd.service,
          phone,
          language,
        },
      });

      // Update inquiry status
      await inquiryModel.updateStatus(inquiry.id, 'REQUIREMENT_COLLECTED');
    }

    // ── Step 10: Send AI response via WhatsApp ─────────────────
    let replyText = aiResult.message;
    if (typeof replyText === 'object' && replyText !== null) {
      replyText = replyText.message || replyText.text || '';
    }
    if (typeof replyText === 'string' && replyText.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(replyText);
        if (parsed.message) replyText = parsed.message;
      } catch {}
    }

    if (replyText) {
      await waService.sendTextMessage(phone, replyText);

      // Store AI response
      await conversationModel.addMessage({
        conversation_id: conversation.id,
        sender:          'ai',
        message_type:    'text',
        content:         replyText,
        language,
        is_ai_generated: true,
        sent_at:         new Date(),
      });
      await conversationModel.incrementMessageCount(conversation.id);
    }

    // Mark original message as read
    if (waMessageId) {
      await waService.markAsRead(waMessageId).catch(() => {});
    }

    return { success: true, inquiry, aiMessage: replyText };
  } catch (err) {
    console.error('[Webhook] Processing error:', err.message, err.stack);
    return { success: false, error: err.message };
  }
}

async function handleMediaAttachment(mediaId, conversation, customer, msgId) {
  try {
    const mediaInfo = await waService.downloadMedia(mediaId);
    if (!mediaInfo) return;
    // In a real implementation, download and save the file
    // For now, store the reference
    const { getPool } = require('../config/database');
    await getPool().execute(
      `INSERT INTO attachments (inquiry_id, conversation_id, message_id, original_name, file_name, file_path, mime_type, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'whatsapp')`,
      [null, conversation.id, msgId, `media_${mediaId}`, `media_${mediaId}`, mediaInfo.url || mediaId, mediaInfo.mimeType || 'image/jpeg']
    );
    console.log(`[Webhook] Media attachment stored: ${mediaId}`);
  } catch (err) {
    console.error('[Webhook] handleMediaAttachment error:', err.message);
  }
}

async function getMediaAcknowledgement(language, msgType) {
  const messages = {
    en: `Thank you for sending the ${msgType}! 📎 We've received your reference. Could you also describe what you need in text?`,
    hi: `${msgType} भेजने के लिए धन्यवाद! 📎 हमें आपका reference मिल गया है। क्या आप text में भी बता सकते हैं कि आपको क्या चाहिए?`,
    mr: `${msgType} पाठवल्याबद्दल धन्यवाद! 📎 आमचे reference मिळाले. तुम्हाला काय हवे आहे ते text मध्ये सांगता का?`,
    mixed: `Reference मिळाले! 📎 Text मध्ये सांगा तुम्हाला काय design करायचे आहे.`,
  };
  return {
    message:       messages[language] || messages.en,
    collectedData: { referenceProvided: true },
    inquiryReady:  false,
    humanHandoff:  false,
    language,
    aiSummary:     null,
  };
}

module.exports = { processIncomingMessage };
