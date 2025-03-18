// backend/routes/documents.js

const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');
const jwtVerifier = require('../middlewares/jwt-verifier');

/**
 * Get all documents (filtered by user permissions)
 */
router.get('/', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    const username = req.user.preferred_username;
    const isAdmin = req.user.realm_access && 
                    req.user.realm_access.roles && 
                    req.user.realm_access.roles.includes('admin');
    
    const documents = documentService.getAllDocuments(username, isAdmin);
    res.json({ documents });
});

/**
 * Search documents
 */
router.get('/search', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    const { query } = req.query;
    const username = req.user.preferred_username;
    const isAdmin = req.user.realm_access && 
                    req.user.realm_access.roles && 
                    req.user.realm_access.roles.includes('admin');
    
    const documents = documentService.searchDocuments(query, username, isAdmin);
    res.json({ documents });
});

/**
 * Get document stats (admin only)
 */
router.get('/stats', 
  jwtVerifier.verifyToken(), 
  jwtVerifier.requireRoles('admin'), 
  (req, res) => {
    const stats = documentService.getDocumentStats();
    res.json({ stats });
});

/**
 * Get document by ID
 */
router.get('/:id', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    const { id } = req.params;
    const username = req.user.preferred_username;
    const isAdmin = req.user.realm_access && 
                    req.user.realm_access.roles && 
                    req.user.realm_access.roles.includes('admin');
    
    const document = documentService.getDocumentById(id, username, isAdmin);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }
    
    res.json({ document });
});

/**
 * Create a new document
 */
router.post('/', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    const documentData = req.body;
    const username = req.user.preferred_username;
    
    const newDocument = documentService.createDocument(documentData, username);
    res.status(201).json({ document: newDocument });
});

/**
 * Update a document
 */
router.put('/:id', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    const { id } = req.params;
    const documentData = req.body;
    const username = req.user.preferred_username;
    const isAdmin = req.user.realm_access && 
                    req.user.realm_access.roles && 
                    req.user.realm_access.roles.includes('admin');
    
    const updatedDocument = documentService.updateDocument(id, documentData, username, isAdmin);
    
    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }
    
    res.json({ document: updatedDocument });
});

/**
 * Delete a document
 */
router.delete('/:id', 
  jwtVerifier.verifyToken(), 
  (req, res) => {
    const { id } = req.params;
    const username = req.user.preferred_username;
    const isAdmin = req.user.realm_access && 
                    req.user.realm_access.roles && 
                    req.user.realm_access.roles.includes('admin');
    
    const success = documentService.deleteDocument(id, username, isAdmin);
    
    if (!success) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }
    
    res.json({ success: true });
});

module.exports = router;