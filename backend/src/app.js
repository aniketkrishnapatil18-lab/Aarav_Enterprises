// Express Application Setup

// ============================================================
// Express Application Setup
// ============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const portfolioRoutes = require('./routes/portfolio.routes');
const customerRoutes = require('./routes/customer.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const conversationRoutes = require('./routes/conversation.routes');
const knowledgeRoutes = require('./routes/knowledge.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const settingsRoutes = require('./routes/settings.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const unsplashRoutes = require('./routes/unsplash.routes');
const clientRoutes = require('./routes/client.routes');
const adminAccessRoutes = require('./routes/adminAccess.routes');
const videoRoutes = require('./routes/video.routes');

const app = express();

// ── Security ──────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Body Parsers ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate Limiting ──────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Webhook gets its own looser limiter (WhatsApp sends many messages)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
});
app.use('/api/whatsapp/webhook', webhookLimiter);

// ── Static Files ───────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Aarav Enterprises API is running', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/ai/knowledge', knowledgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/unsplash', unsplashRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admins', adminAccessRoutes);
app.use('/api/videos', videoRoutes);

// ── 404 Handler ────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────
app.use(errorHandler);

module.exports = app;
