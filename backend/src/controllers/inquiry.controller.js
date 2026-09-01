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

async function createPublic(req, res, next) {
  try {
    const { name, whatsapp_number, email, requirements, product_id, service_name, business_name, salutation } = req.body;
    if (!name || !whatsapp_number || !email || !requirements) {
      return res.status(400).json({ success: false, message: 'Name, WhatsApp number, email, and requirements are required.' });
    }

    const customerModel = require('../models/customer.model');
    const productModel = require('../models/product.model');

    // Find or create customer
    const { customer } = await customerModel.findOrCreate(whatsapp_number, name);

    // Update customer name & email if they weren't set yet
    const updateFields = {};
    if (!customer.name && name) updateFields.name = name;
    if (!customer.email && email) updateFields.email = email;
    if (!customer.phone && whatsapp_number) updateFields.phone = whatsapp_number;
    if (Object.keys(updateFields).length > 0) {
      await customerModel.update(customer.id, updateFields);
    }

    let resolvedProductId = product_id ? parseInt(product_id) : null;
    let resolvedServiceName = service_name || null;

    if (resolvedProductId) {
      const product = await productModel.getById(resolvedProductId);
      if (product) {
        resolvedServiceName = product.name;
      }
    }

    // Format the requirements to include contact/salutation details
    const fullRequirements = `Name: ${salutation ? salutation + ' ' : ''}${name}\nEmail: ${email}\nMobile: ${whatsapp_number}\n\nRequirements:\n${requirements}`;

    // Create the inquiry
    const inquiry = await inquiryModel.create({
      customer_id: customer.id,
      product_id: resolvedProductId,
      service_name: resolvedServiceName,
      requirements: fullRequirements,
      business_name: business_name || null,
      language: 'en',
      collected_data: {
        salutation,
        name,
        email,
        whatsapp_number,
        requirements
      }
    });

    // Increment customer inquiries count
    await customerModel.incrementInquiries(customer.id);

    // Create a notification for admins
    await notificationModel.create({
      type: 'new_inquiry',
      title: `New Inquiry ${inquiry.inquiry_number}`,
      body: `New inquiry for ${inquiry.service_name || 'Design Service'} by ${name} (${whatsapp_number}).`,
      data: { inquiryId: inquiry.id }
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

async function uploadDesign(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
    const final_design_url = `/uploads/portfolio/${req.file.filename}`;
    const inquiry = await inquiryModel.update(req.params.id, { final_design_url });
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

async function publishToPortfolio(req, res, next) {
  try {
    const inquiry = await inquiryModel.getById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    if (!inquiry.final_design_url) return res.status(400).json({ success: false, message: 'No final design uploaded' });
    if (inquiry.is_published) return res.status(400).json({ success: false, message: 'Already published' });

    const portfolioModel = require('../models/portfolio.model');
    const portfolioItem = await portfolioModel.create({
      category_id: 1, // Fallback to first category, admin can edit later
      title: inquiry.service_name || 'Design Service',
      description: `Completed project for ${inquiry.business_name || inquiry.customer_name}`,
      image_url: inquiry.final_design_url,
      client_name: inquiry.business_name || inquiry.customer_name || 'Client',
      is_featured: 1
    });

    const updatedInquiry = await inquiryModel.update(req.params.id, { is_published: 1 });
    res.json({ success: true, data: updatedInquiry, portfolioItem });
  } catch (err) { next(err); }
}

module.exports = { list, detail, updateStatus, addNote, update, createPublic, uploadDesign, publishToPortfolio };
