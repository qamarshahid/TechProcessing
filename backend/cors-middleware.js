// Custom CORS middleware for Google Cloud Run
module.exports = (req, res, next) => {
  const allowedOrigins = [
    'https://qamarshahid.github.io',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ];

  const origin = req.headers.origin;

  // Always set the Vary header
  res.setHeader('Vary', 'Origin');

  // Check if the origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    // Set CORS headers explicitly
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    console.log(`🔓 CORS allowed for origin: ${origin}`);
  } else if (!origin) {
    // Allow requests without origin (curl, postman, etc.)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
    console.log('🔓 Allowing request without origin');
  } else {
    console.log(`❌ CORS blocked for origin: ${origin}`);
    // Even for blocked origins, we need to handle preflight properly
    if (req.method === 'OPTIONS') {
      res.status(403);
      return res.end();
    }
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`🔄 Handling OPTIONS preflight request for origin: ${origin}`);
    res.status(204);
    return res.end();
  }

  next();
};
