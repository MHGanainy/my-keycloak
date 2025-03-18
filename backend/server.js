// backend/server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const port = process.env.PORT || 3001;

// Import JWT verification middleware
const jwtVerifier = require('./middlewares/jwt-verifier');

// Import routes
const documentRoutes = require('./routes/documents');

const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);
  const status = error.status || 422;
  res.status(status).send(error.message);
}

const app = express();

// JWT debugging middleware
app.use((req, res, next) => {
  if (req.headers.authorization) {
    console.log("Authorization header present");
   
    // Extract token without "Bearer " prefix
    const token = req.headers.authorization.split(' ')[1];
   
    // Log token parts (header, payload, signature)
    const parts = token.split('.');
    if (parts.length === 3) {
      console.log("Token structure looks valid (3 parts)");
    } else {
      console.log("WARNING: Token structure invalid:", parts.length, "parts");
    }
  } else {
    console.log("No Authorization header in request");
  }
  next();
});

app.use(express.json());
app.use(cors());

// Apply routes
app.use('/api/documents', documentRoutes);

// Legacy routes
app.get('/api/items', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    // Redirect to documents endpoint
    const username = req.user.preferred_username;
    const isAdmin = req.user.realm_access && 
                   req.user.realm_access.roles && 
                   req.user.realm_access.roles.includes('admin');
    
    // Return a message about the updated API
    res.json({
      message: "API updated! Please use /api/documents instead of /api/items",
      items: [
        { id: 1, name: 'Please use the documents API' },
        { id: 2, name: 'This endpoint is deprecated' }
      ]
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Document Management API Server Started at ${port}`);
});