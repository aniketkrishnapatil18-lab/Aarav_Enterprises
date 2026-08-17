// ============================================================
// Controller: Inquiry
// ============================================================

const inquiryModel      = require('../models/inquiry.model');
const notificationModel = require('../models/notification.model');
const attachmentModel   = require('../models/attachment.model');
const { INQUIRY_STATUS } = require('../config/constants');

async function list(req, res, next) {
  try {
    const { status, search = '', page = 1, limit = 20, language, product } = req.query;
    const result = await inquiryModel.getAll({
      status:    status || null,
      search,
      page:      parseInt(page),
      limit:     parseInt(limit),
      language:  language || null,
      productId: product || null,
    });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const inquiry = await inquiryModel.getById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    const attachments = await attachmentModel.getByInquiry(req.params.id);
    res.json({ success: true, data: { ...inquiry, attachments } });
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    if (!Object.values(INQUIRY_STATUS).includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const inquiry = await inquiryModel.updateStatus(req.params.id, status, req.admin.id, note);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

    // Notify on key transitions
    if (['COMPLETED', 'CANCELLED'].includes(status)) {
      await notificationModel.create({
        type:  'status_change',
        title: `Inquiry ${inquiry.inquiry_number} — ${status}`,
        body:  `Inquiry for ${inquiry.service_name || 'Design Service'} (Customer: ${inquiry.customer_name || inquiry.whatsapp_number}) has been marked as ${status}.`,
        data:  { inquiryId: inquiry.id },
      });
    }

    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

async function addNote(req, res, next) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });
    await inquiryModel.addMessage(req.params.id, { sender: 'admin', message, admin_id: req.admin.id });
    const inquiry = await inquiryModel.getById(req.params.id);
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const inquiry = await inquiryModel.update(req.params.id, req.body);
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

module.exports = { list, detail, updateStatus, addNote, update };
