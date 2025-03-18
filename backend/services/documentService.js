// backend/services/documentService.js

/**
 * Document service to handle document management operations
 */

// In-memory document storage 
let documents = [
    {
      id: '1',
      title: 'Getting Started Guide',
      description: 'A comprehensive guide to get started with our system.',
      fileType: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'admin',
      uploadDate: '2025-03-01T14:30:00.000Z',
      tags: ['documentation', 'tutorial'],
      status: 'published',
      access: 'public'
    },
    {
      id: '2',
      title: 'Annual Report 2024',
      description: 'Financial and operational report for the fiscal year 2024.',
      fileType: 'pdf',
      size: '5.8 MB',
      uploadedBy: 'admin',
      uploadDate: '2025-02-15T10:15:00.000Z',
      tags: ['financial', 'annual'],
      status: 'published',
      access: 'restricted'
    },
    {
      id: '3',
      title: 'Employee Handbook',
      description: 'Official employee handbook containing company policies and procedures.',
      fileType: 'docx',
      size: '3.2 MB',
      uploadedBy: 'admin',
      uploadDate: '2025-01-20T09:45:00.000Z',
      tags: ['policies', 'employees'],
      status: 'published',
      access: 'internal'
    },
    {
      id: '4',
      title: 'Project Proposal Template',
      description: 'Template for submitting new project proposals.',
      fileType: 'docx',
      size: '1.5 MB',
      uploadedBy: 'john.doe',
      uploadDate: '2025-02-28T16:20:00.000Z',
      tags: ['template', 'projects'],
      status: 'published',
      access: 'public'
    },
    {
      id: '5',
      title: 'Marketing Strategy',
      description: 'Strategic marketing plan for upcoming product launch.',
      fileType: 'pptx',
      size: '4.1 MB',
      uploadedBy: 'jane.smith',
      uploadDate: '2025-03-05T11:10:00.000Z',
      tags: ['marketing', 'strategy', 'confidential'],
      status: 'draft',
      access: 'private'
    },
    {
      id: '6',
      title: 'Technical Specifications',
      description: 'Technical specifications for the new product line.',
      fileType: 'xlsx',
      size: '2.8 MB',
      uploadedBy: 'john.doe',
      uploadDate: '2025-02-10T13:25:00.000Z',
      tags: ['technical', 'specifications'],
      status: 'published',
      access: 'restricted'
    },
    {
      id: '7',
      title: 'Customer Feedback Analysis',
      description: 'Analysis of customer feedback collected in Q1 2025.',
      fileType: 'xlsx',
      size: '3.7 MB',
      uploadedBy: 'admin',
      uploadDate: '2025-03-12T15:40:00.000Z',
      tags: ['analysis', 'customers', 'feedback'],
      status: 'published',
      access: 'internal'
    },
    {
      id: '8',
      title: 'Security Protocols',
      description: 'Updated security protocols and procedures.',
      fileType: 'pdf',
      size: '1.9 MB',
      uploadedBy: 'jane.smith',
      uploadDate: '2025-01-30T09:00:00.000Z',
      tags: ['security', 'protocols', 'confidential'],
      status: 'published',
      access: 'restricted'
    }
  ];
  
  // Generate a new document ID
  function generateId() {
    return Date.now().toString();
  }
  
  // Get all documents (filtered by user if not admin)
  function getAllDocuments(username, isAdmin) {
    // Admin can see all documents
    if (isAdmin) {
      return documents;
    }
    
    // Regular users can only see their documents or public documents
    return documents.filter(doc => 
      doc.uploadedBy === username || 
      doc.access === 'public' ||
      (doc.access === 'internal' && doc.status === 'published')
    );
  }
  
  // Get document by ID
  function getDocumentById(id, username, isAdmin) {
    const doc = documents.find(doc => doc.id === id);
    
    if (!doc) {
      return null;
    }
    
    // Check if user has access to this document
    if (isAdmin || doc.uploadedBy === username || doc.access === 'public' || 
       (doc.access === 'internal' && doc.status === 'published')) {
      return doc;
    }
    
    return null; // User doesn't have access
  }
  
  // Create a new document
  function createDocument(documentData, username) {
    const newDocument = {
      id: generateId(),
      uploadedBy: username,
      uploadDate: new Date().toISOString(),
      status: 'draft',
      ...documentData
    };
    
    documents.push(newDocument);
    return newDocument;
  }
  
  // Update document
  function updateDocument(id, documentData, username, isAdmin) {
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Only allow update if user is admin or document owner
    if (!isAdmin && documents[index].uploadedBy !== username) {
      return null;
    }
    
    // Preserve uploadedBy and uploadDate
    const updatedDocument = {
      ...documents[index],
      ...documentData,
      uploadedBy: documents[index].uploadedBy,
      uploadDate: documents[index].uploadDate
    };
    
    documents[index] = updatedDocument;
    return updatedDocument;
  }
  
  // Delete document
  function deleteDocument(id, username, isAdmin) {
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) {
      return false;
    }
    
    // Only allow delete if user is admin or document owner
    if (!isAdmin && documents[index].uploadedBy !== username) {
      return false;
    }
    
    documents.splice(index, 1);
    return true;
  }
  
  // Search documents
  function searchDocuments(query, username, isAdmin) {
    let filteredDocs = isAdmin ? documents : getAllDocuments(username, isAdmin);
    
    if (!query) {
      return filteredDocs;
    }
    
    const lowerQuery = query.toLowerCase();
    
    return filteredDocs.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Get document statistics (admin only)
  function getDocumentStats() {
    const stats = {
      totalDocuments: documents.length,
      byStatus: {
        published: documents.filter(doc => doc.status === 'published').length,
        draft: documents.filter(doc => doc.status === 'draft').length
      },
      byType: {},
      byAccess: {
        public: documents.filter(doc => doc.access === 'public').length,
        restricted: documents.filter(doc => doc.access === 'restricted').length,
        internal: documents.filter(doc => doc.access === 'internal').length,
        private: documents.filter(doc => doc.access === 'private').length
      }
    };
    
    // Count documents by file type
    documents.forEach(doc => {
      if (!stats.byType[doc.fileType]) {
        stats.byType[doc.fileType] = 0;
      }
      stats.byType[doc.fileType]++;
    });
    
    return stats;
  }
  
  module.exports = {
    getAllDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    getDocumentStats
  };