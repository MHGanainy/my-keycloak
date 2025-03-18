const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Hardcoded public key
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxwsQ1xGzgUwqId4It6vb
jnXG3jaJRXEpu5Cf5GNiqM/2ZoBGTe2kgmK9VpsWtYjLQyL/dJEwgEG5FXzuABqh
OkMeFXrZSsywZ3REwQGoLVLXo/f3yGuUU8hsN962ccMPG1/ZVHoCp932KyA7Uqop
526ti1VLI6/tAl4SFDWYmH5UF6CLlS8Z1QCJX8/uQbj9QtGRZxFESEXhDwdN4PzQ
Cmr7BLFdKDcrhx180O4dZkjZGZFF285sl40bBip9KU9OWjtSAGYUgYz9wOdUQXQ/
2Y9P9knttkmzBxjnjDV6JV2bVDaARLaSp2ISID9sjzgOQcm1pR6OyIrIHsE0H9B/
nQIDAQAB
-----END PUBLIC KEY-----`;

/**
 * Express middleware to verify JWT tokens
 * @param {Object} options - Verification options
 * @returns {Function} Express middleware
 */
function verifyToken(options = {}) {
  return async (req, res, next) => {
    try {
      // Extract the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify the token with the hardcoded public key
      const verifyOptions = {
        algorithms: ['RS256'], // Keycloak uses RS256 by default
        ...options
      };
      
      // This will throw an error if validation fails
      const decoded = jwt.verify(token, PUBLIC_KEY, verifyOptions);
      
      // Store the decoded token in the request object for later use
      req.user = decoded;
      
      // Log successful verification
      console.log(`Token verified for user: ${decoded.preferred_username || decoded.sub}`);
      
      // Optional: Verify additional claims like issuer, audience, etc.
      const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
      const realm = process.env.KEYCLOAK_REALM || 'myrealm';
      const expectedIssuer = `${keycloakUrl}/realms/${realm}`;
      
      if (decoded.iss !== expectedIssuer) {
        console.warn(`Token issuer mismatch: expected ${expectedIssuer}, got ${decoded.iss}`);
        // Uncomment to enforce issuer matching
        // return res.status(401).json({ error: 'Token issuer mismatch' });
      }
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      // Return appropriate error based on what went wrong
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.status(500).json({ error: 'Failed to authenticate token' });
      }
    }
  };
}

/**
 * Express middleware to check for specific roles
 * @param {String|Array} requiredRoles - Required role(s)
 * @returns {Function} Express middleware
 */
function requireRoles(requiredRoles) {
  // Convert single role to array for consistent handling
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return (req, res, next) => {
    // Token should already be verified by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Extract roles from the token
    const userRoles = (req.user.realm_access && req.user.realm_access.roles) || [];
    
    // Check if the user has any of the required roles
    const hasRequiredRole = roles.length === 0 || roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

module.exports = {
  verifyToken,
  requireRoles
};