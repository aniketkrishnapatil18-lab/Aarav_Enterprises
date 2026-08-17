// ============================================================
// Controller: Notification
// ============================================================

const notificationModel = require('../models/notification.model');

async function list(req, res, next) {
  try {
    const { unread, page = 1, limit = 30 } = req.query;
    const notifications = await notificationModel.getAll({
      adminId:    req.admin.id,
      unreadOnly: unread === 'true',
      page:       parseInt(page),
      limit:      parseInt(limit),
    });
    const unreadCount = await notificationModel.countUnread();
    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) { next(err); }
}

async function markRead(req, res, next) {
  try {
    if (req.params.id === 'all') {
      await notificationModel.markAllRead(req.admin.id);
    } else {
      await notificationModel.markRead(req.params.id);
    }
    res.json({ success: true, message: 'Notification(s) marked as read.' });
  } catch (err) { next(err); }
}

module.exports = { list, markRead };
