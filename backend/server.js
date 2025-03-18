require('dotenv').config();
const cors = require('cors');
const express = require('express');
const port = process.env.PORT || 3000;

// Import JWT verification middleware
const jwtVerifier = require('#middlewares/jwt-verifier');

// Routes
const errorHandler = (error, req, res, next) => {
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

app.get('/api/items', 
  jwtVerifier.verifyToken(), 
  jwtVerifier.requireRoles('admin'), 
  (req, res) => {
    // Example secured data
    res.json({
      items: [
        { id: 1, name: 'Item One' },
        { id: 2, name: 'Item Two' }
      ]
    });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});