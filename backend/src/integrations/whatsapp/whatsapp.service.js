// ============================================================
// WhatsApp Integration: Main Service
// Supports: mock (default), real WhatsApp Cloud API
// Configure via WA_MODE env variable
// ============================================================

require('dotenv').config();
const axios = require('axios');

/**
 * Send a text message to a WhatsApp number
 */
async function sendTextMessage(to, message) {
  const mode        = (process.env.WA_MODE || 'mock').toLowerCase();
  const phoneNumId  = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN    || '';
  const waApiUrl    = `https://graph.facebook.com/v20.0/${phoneNumId}/messages`;

  if (mode === 'mock') {
    console.log(`[WhatsApp MOCK] → ${to}: ${message.substring(0, 100)}...`);
    return { success: true, messageId: `mock_${Date.now()}`, mock: true };
  }

  try {
    const response = await axios.post(
      waApiUrl,
      {
        messaging_product: 'whatsapp',
        recipient_type:    'individual',
        to,
        type:    'text',
        text: {
          preview_url: false,
          body:        message,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json',
        },
        timeout: 15000,
      }
    );
    return {
      success:   true,
      messageId: response.data.messages?.[0]?.id,
      raw:       response.data,
    };
  } catch (err) {
    console.error('[WhatsApp] Send error:', err.response?.data || err.message);
    return { success: false, error: err.response?.data?.error?.message || err.message };
  }
}

/**
 * Send an image message to a WhatsApp number via public HTTPS URL
 * @param {string} to - recipient phone number (e.g. 919763530208)
 * @param {string} imageUrl - publicly accessible HTTPS image URL
 * @param {string} caption - image caption text
 */
async function sendImageMessage(to, imageUrl, caption = '') {
  const mode        = (process.env.WA_MODE || 'mock').toLowerCase();
  const phoneNumId  = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN    || '';
  const waApiUrl    = `https://graph.facebook.com/v20.0/${phoneNumId}/messages`;

  // Normalize image URL
  let cleanLink = imageUrl || '';
  if (cleanLink.startsWith('/')) {
    const publicHost = process.env.PUBLIC_URL || 'https://chylophyllously-semiphilosophical-ludie.ngrok-free.dev';
    cleanLink = `${publicHost.replace(/\/$/, '')}${cleanLink}`;
  }
  if (cleanLink.includes('unsplash.com')) {
    cleanLink = cleanLink.split('?')[0];
    if (!cleanLink.endsWith('.jpg') && !cleanLink.endsWith('.png')) {
      cleanLink += '.jpg';
    }
  }

  if (mode === 'mock') {
    console.log(`[WhatsApp MOCK] → IMAGE → ${to}`);
    console.log(`  URL: ${cleanLink.substring(0, 80)}`);
    console.log(`  Caption: ${caption}`);
    return { success: true, messageId: `mock_img_${Date.now()}`, mock: true };
  }

  try {
    const response = await axios.post(
      waApiUrl,
      {
        messaging_product: 'whatsapp',
        recipient_type:    'individual',
        to,
        type:  'image',
        image: {
          link:    cleanLink,
          caption: caption || '',
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json',
        },
        timeout: 15000,
      }
    );
    console.log(`[WhatsApp] Image sent to ${to}: ${caption}`);
    return {
      success:   true,
      messageId: response.data.messages?.[0]?.id,
      raw:       response.data,
    };
  } catch (err) {
    const errData = err.response?.data;
    console.error('[WhatsApp] sendImageMessage error:', errData || err.message);
    return { success: false, error: errData?.error?.message || err.message };
  }
}

/**
 * Mark a WhatsApp message as read
 */
async function markAsRead(messageId) {
  if (WA_MODE === 'mock') return;
  if (!PHONE_NUM_ID || !ACCESS_TOKEN) return;

  try {
    await axios.post(
      WA_API_URL,
      { messaging_product: 'whatsapp', status: 'read', message_id: messageId },
      { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[WhatsApp] markAsRead error:', err.message);
  }
}

/**
 * Download media from WhatsApp and save locally
 */
async function downloadMedia(mediaId) {
  if (WA_MODE === 'mock') {
    return { url: null, mimeType: 'image/jpeg', mock: true };
  }
  if (!ACCESS_TOKEN) return null;

  try {
    // Step 1: Get media URL
    const infoResp = await axios.get(
      `https://graph.facebook.com/v20.0/${mediaId}`,
      { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }
    );
    const mediaUrl = infoResp.data.url;
    return { url: mediaUrl, mimeType: infoResp.data.mime_type };
  } catch (err) {
    console.error('[WhatsApp] downloadMedia error:', err.message);
    return null;
  }
}

/**
 * Verify WhatsApp webhook challenge
 */
function verifyWebhook(mode, token, challenge) {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'aarav_verify_token_2025';
  if (mode === 'subscribe' && token === verifyToken) {
    return challenge;
  }
  return null;
}

/**
 * Parse incoming WhatsApp webhook payload
 * Returns normalized message object or null
 */
function parseWebhookPayload(body) {
  try {
    const entry   = body?.entry?.[0];
    const change  = entry?.changes?.[0];
    const value   = change?.value;

    if (!value?.messages?.length) return null;

    const msg     = value.messages[0];
    const contact = value.contacts?.[0];
    const phone   = msg.from;
    const name    = contact?.profile?.name || null;

    let content   = null;
    let mediaId   = null;
    let msgType   = 'text';

    if (msg.type === 'text') {
      content = msg.text?.body || '';
      msgType = 'text';
    } else if (['image', 'audio', 'video', 'document'].includes(msg.type)) {
      mediaId = msg[msg.type]?.id;
      content = msg[msg.type]?.caption || `[${msg.type} received]`;
      msgType = msg.type;
    } else if (msg.type === 'interactive') {
      content = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '';
      msgType = 'interactive';
    }

    return {
      waMessageId: msg.id,
      phone,
      name,
      content,
      mediaId,
      msgType,
      timestamp: new Date(parseInt(msg.timestamp, 10) * 1000),
    };
  } catch (err) {
    console.error('[WhatsApp] Parse error:', err.message);
    return null;
  }
}

module.exports = { sendTextMessage, sendImageMessage, markAsRead, downloadMedia, verifyWebhook, parseWebhookPayload };

