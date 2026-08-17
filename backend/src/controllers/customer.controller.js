// ============================================================
// Controller: Customer
// ============================================================

const customerModel     = require('../models/customer.model');
const inquiryModel      = require('../models/inquiry.model');
const conversationModel = require('../models/conversation.model');

async function list(req, res, next) {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const result = await customerModel.getAll({ search, page: parseInt(page), limit: parseInt(limit) });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const customer = await customerModel.getById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const inquiries     = await inquiryModel.getByCustomer(req.params.id);
    const { conversations } = await conversationModel.getAllConversations({ customerId: req.params.id });

    res.json({ success: true, data: { ...customer, inquiries, conversations } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const customer = await customerModel.update(req.params.id, req.body);
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
}

module.exports = { list, detail, update };
