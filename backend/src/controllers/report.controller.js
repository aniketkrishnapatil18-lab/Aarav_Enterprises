// ============================================================
// Controller: Reports
// ============================================================

const { getPool }       = require('../config/database');
const inquiryModel      = require('../models/inquiry.model');
const customerModel     = require('../models/customer.model');
const conversationModel = require('../models/conversation.model');
const productModel      = require('../models/product.model');
const notificationModel = require('../models/notification.model');

async function summary(req, res, next) {
  try {
    const pool = getPool();

    const [[{ totalCustomers }]]     = await pool.execute('SELECT COUNT(*) AS totalCustomers FROM customers');
    const [[{ totalConversations }]] = await pool.execute('SELECT COUNT(*) AS totalConversations FROM whatsapp_conversations');
    const [[{ totalInquiries }]]     = await pool.execute('SELECT COUNT(*) AS totalInquiries FROM inquiries');
    const statusCounts               = await inquiryModel.countByStatus();
    const unreadNotifications        = await notificationModel.countUnread();

    const [[{ newInquiries }]] = await pool.execute(
      "SELECT COUNT(*) AS newInquiries FROM inquiries WHERE status = 'NEW'"
    );
    const [[{ inProgress }]] = await pool.execute(
      "SELECT COUNT(*) AS inProgress FROM inquiries WHERE status = 'IN_PROGRESS'"
    );
    const [[{ completed }]] = await pool.execute(
      "SELECT COUNT(*) AS completed FROM inquiries WHERE status = 'COMPLETED'"
    );

    // Recent inquiries
    const [recentInquiries] = await pool.execute(
      `SELECT i.id, i.inquiry_number, i.status, i.service_name, i.created_at,
              c.name AS customer_name, c.whatsapp_number
       FROM inquiries i LEFT JOIN customers c ON c.id = i.customer_id
       ORDER BY i.created_at DESC LIMIT 5`
    );

    // Recent conversations
    const [recentConversations] = await pool.execute(
      `SELECT cv.id, cv.status, cv.language, cv.last_message_at, cv.message_count,
              c.name AS customer_name, c.whatsapp_number
       FROM whatsapp_conversations cv LEFT JOIN customers c ON c.id = cv.customer_id
       ORDER BY cv.last_message_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalConversations,
        totalInquiries,
        newInquiries,
        inProgress,
        completed,
        unreadNotifications,
        statusCounts,
        recentInquiries,
        recentConversations,
      },
    });
  } catch (err) { next(err); }
}

async function byService(req, res, next) {
  try {
    const [rows] = await getPool().execute(
      `SELECT COALESCE(p.name, i.service_name, 'Unknown') AS service, COUNT(*) AS count
       FROM inquiries i LEFT JOIN products p ON p.id = i.product_id
       GROUP BY service ORDER BY count DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function byLanguage(req, res, next) {
  try {
    const [rows] = await getPool().execute(
      'SELECT language, COUNT(*) AS count FROM inquiries GROUP BY language ORDER BY count DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function byStatus(req, res, next) {
  try {
    const rows = await inquiryModel.countByStatus();
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

module.exports = { summary, byService, byLanguage, byStatus };
