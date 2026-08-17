// ============================================================
// Middleware: Global Error Handler
// ============================================================

function errorHandler(err, req, res, _next) {
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('[ERROR]', err.message, isDev ? err.stack : '');

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message, errors: err.errors });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'A record with this value already exists.' });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ success: false, message: 'Referenced record does not exist.' });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS not allowed from this origin.' });
  }

  const status  = err.statusCode || err.status || 500;
  const message = (status < 500 && err.message) ? err.message : 'Something went wrong. Please try again.';

  return res.status(status).json({
    success: false,
    message,
    ...(isDev && status >= 500 ? { debug: err.stack } : {}),
  });
}

module.exports = errorHandler;
