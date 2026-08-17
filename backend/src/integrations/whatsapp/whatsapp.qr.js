// ============================================================
// WhatsApp Integration: QR Code Client (whatsapp-web.js)
// Allows scanning QR code with ANY alternate WhatsApp phone
// ============================================================

require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode               = require('qrcode-terminal');
const webhookService       = require('../../services/webhook.service');

let clientInstance = null;
let isReady        = false;

function initQrClient() {
  if (clientInstance) return clientInstance;

  console.log('------------------------------------------------------------');
  console.log('[WhatsApp QR] Initializing QR Code Client...');
  console.log('[WhatsApp QR] Scan the QR Code below using WhatsApp on your alternate phone');
  console.log('------------------------------------------------------------');

  clientInstance = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    },
  });

  // QR Code generator
  clientInstance.on('qr', (qr) => {
    console.log('\n[WhatsApp QR] SCAN THIS QR CODE WITH YOUR ALTERNATE WHATSAPP PHONE:');
    qrcode.generate(qr, { small: true });
    console.log('[WhatsApp QR] Open WhatsApp ➔ Linked Devices ➔ Scan QR Code\n');
  });

  // Authenticated
  clientInstance.on('authenticated', () => {
    console.log('[WhatsApp QR] Session authenticated successfully!');
  });

  // Ready
  clientInstance.on('ready', () => {
    isReady = true;
    console.log('============================================================');
    console.log('🎉 [WhatsApp QR] AI AGENT IS NOW LIVE & CONNECTED!');
    console.log('[WhatsApp QR] Any WhatsApp message sent to this alternate phone');
    console.log('[WhatsApp QR] will get instant 2-second AI replies from Gemini 3.6!');
    console.log('============================================================');
  });

  // Incoming Messages Listener
  clientInstance.on('message', async (msg) => {
    try {
      // Ignore broadcast or group chats if needed
      if (msg.from.endsWith('@g.us') || msg.isStatus) return;

      const rawPhone = msg.from.replace(/[^0-9]/g, '');
      const content  = msg.body;
      const contact  = await msg.getContact().catch(() => ({}));
      const name     = contact.pushname || contact.name || 'WhatsApp Customer';

      console.log(`[WhatsApp QR Inbound] From ${rawPhone} (${name}): "${content}"`);

      // Process message through Webhook & Gemini 3.6 AI Engine
      const result = await webhookService.processIncomingMessage({
        waMessageId: msg.id.id,
        phone:       rawPhone,
        name,
        content,
        mediaId:     null,
        msgType:     'text',
        timestamp:   new Date(msg.timestamp * 1000),
      });

      // Reply back via WhatsApp Web client
      if (result && result.aiMessage) {
        await msg.reply(result.aiMessage);
        console.log(`[WhatsApp QR Outbound] AI Replied to ${rawPhone}: "${result.aiMessage.substring(0, 60)}..."`);
      }
    } catch (err) {
      console.error('[WhatsApp QR] Error processing message:', err.message);
    }
  });

  clientInstance.initialize().catch(err => {
    console.error('[WhatsApp QR] Initialization error:', err.message);
  });

  return clientInstance;
}

function getQrStatus() {
  return { isReady, active: !!clientInstance };
}

module.exports = { initQrClient, getQrStatus };
