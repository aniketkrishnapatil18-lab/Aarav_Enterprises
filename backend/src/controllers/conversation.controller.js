// ============================================================
// Controller: Conversation
// ============================================================

const conversationModel = require('../models/conversation.model');
const attachmentModel   = require('../models/attachment.model');

async function list(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const result = await conversationModel.getAllConversations({
      status: status || null,
      page:   parseInt(page),
      limit:  parseInt(limit),
    });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const conversation = await conversationModel.getConversationById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found.' });
    const messages     = await conversationModel.getMessages(req.params.id);
    const attachments  = await attachmentModel.getByConversation(req.params.id);
    res.json({ success: true, data: { ...conversation, messages, attachments } });
  } catch (err) { next(err); }
}

async function sendMessage(req, res, next) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Message content is required' });
    const conversation = await conversationModel.getConversationById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    // Send WhatsApp message to customer via Meta API
    const waService = require('../integrations/whatsapp/whatsapp.service');
    const sendRes   = await waService.sendTextMessage(conversation.phone, content);

    // Record message in DB
    await conversationModel.addMessage({
      conversation_id:  conversation.id,
      sender:           'admin',
      message_type:     'text',
      content,
      wa_message_id:    sendRes.messageId || null,
      is_ai_generated:  false,
      sent_at:          new Date(),
    });
    await conversationModel.incrementMessageCount(conversation.id);

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    await conversationModel.updateConversation(req.params.id, { status });
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (err) { next(err); }
}

async function closeConversation(req, res, next) {
  try {
    await conversationModel.closeConversation(req.params.id);
    res.json({ success: true, message: 'Conversation closed.' });
  } catch (err) { next(err); }
}

module.exports = { list, detail, sendMessage, updateStatus, closeConversation };
