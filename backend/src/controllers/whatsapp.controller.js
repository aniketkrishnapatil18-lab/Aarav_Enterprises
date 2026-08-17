// ============================================================
// Controller: WhatsApp Webhook
// ============================================================

const waService      = require('../integrations/whatsapp/whatsapp.service');
const webhookService = require('../services/webhook.service');

// GET — webhook verification challenge
async function verify(req, res) {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const result = waService.verifyWebhook(mode, token, challenge);
  if (result) {
    console.log('[WhatsApp] Webhook verified successfully');
    return res.status(200).send(result);
  }
  return res.status(403).json({ success: false, message: 'Verification failed' });
}

// POST — receive incoming messages
async function receive(req, res) {
  // Always respond 200 immediately to WhatsApp
  res.status(200).json({ success: true });

  try {
    console.log('[WhatsApp Webhook Received]:', JSON.stringify(req.body, null, 2));
    const parsed = waService.parseWebhookPayload(req.body);
    if (!parsed) {
      console.log('[WhatsApp Webhook] No message payload (status update or non-message event)');
      return;
    }
    console.log(`[WhatsApp] Incoming message from ${parsed.phone}: ${parsed.content?.substring(0, 80)}`);
    await webhookService.processIncomingMessage(parsed);
  } catch (err) {
    console.error('[WhatsApp] Webhook processing error:', err.message);
  }
}

// POST — test webhook simulation (dev only)
async function testMessage(req, res, next) {
  try {
    const { phone, content, name } = req.body;
    if (!phone || !content) {
      return res.status(400).json({ success: false, message: 'phone and content are required.' });
    }
    const result = await webhookService.processIncomingMessage({
      waMessageId: `test_${Date.now()}`,
      phone,
      name:        name || 'Test User',
      content,
      mediaId:     null,
      msgType:     'text',
      timestamp:   new Date(),
    });
    return res.json({ success: true, message: result.aiMessage, data: result });
  } catch (err) {
    return next(err);
  }
}

module.exports = { verify, receive, testMessage };
