// frontend/src/pages/DocumentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentList from '../components/DocumentList';
import DocumentDetail from '../components/DocumentDetail';
import DocumentForm from '../components/DocumentForm';
import useKeycloak from '../hooks/useKeycloak';
import { 
  getAllDocuments, 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument 
} from '../services/documentService';
import AuthenticationMessage from '../components/AuthenticationMessage';

const DocumentsPage = () => {
  const { keycloak, authenticated, hasRole } = useKeycloak();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const isAdmin = hasRole('admin');
  
  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      if (keycloak?.token) {
        const response = await getAllDocuments(keycloak.token);
        setDocuments(response.documents || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a single document
  const fetchDocument = async (documentId) => {
    try {
      setLoading(true);
      
      if (keycloak?.token) {
        const response = await getDocumentById(documentId, keycloak.token);
        setSelectedDocument(response.document);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document. It may not exist or you do not have permission to view it.');
      setSelectedDocument(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize data on component mount
  useEffect(() => {
    if (authenticated && keycloak) {
      fetchDocuments();
      
      // If there's an ID in the URL, fetch that specific document
      if (id) {
        fetchDocument(id);
      }
    }
  }, [authenticated, keycloak, id]);
  
  // Display a message when a document is successfully updated/created/deleted
  useEffect(() => {
    if (successMessage) {
      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Handle view document
  const handleViewDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };
  
  // Handle create document
  const handleCreateDocument = async (documentData) => {
    try {
      if (keycloak?.token) {
        const response = await createDocument(documentData, keycloak.token);
        
        // Add the new document to the list
        setDocuments(prevDocs => [...prevDocs, response.document]);
        
        // Close the form and show success message
        setShowUploadForm(false);
        setSuccessMessage('Document uploaded successfully!');
      }
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to upload document. Please try again.');
    }
  };
  
  // Handle update document
  const handleUpdateDocument = async (documentData) => {
    try {
      if (keycloak?.token && selectedDocument) {
        const response = await updateDocument(selectedDocument.id, documentData, keycloak.token);
        
        // Update the document in the list
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === response.document.id ? response.document : doc
          )
        );
        
        // Update the selected document
        setSelectedDocument(response.document);
        
        // Close the form and show success message
        setShowEditForm(false);
        setSuccessMessage('Document updated successfully!');
      }
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document. Please try again.');
    }
  };
  
  // Handle delete document
  const handleDeleteDocument = async () => {
    try {
      if (keycloak?.token && selectedDocument) {
        await deleteDocument(selectedDocument.id, keycloak.token);
        
        // Remove the document from the list
        setDocuments(prevDocs => 
          prevDocs.filter(doc => doc.id !== selectedDocument.id)
        );
        
        // Close the modal and navigate back to documents list
        setShowDeleteModal(false);
        setSelectedDocument(null);
        setSuccessMessage('Document deleted successfully!');
        navigate('/documents');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
      setShowDeleteModal(false);
    }
  };
  
  // Handle back to documents list
  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    navigate('/documents');
  };
  
  // Check if current user can edit the document
  const canEditDocument = () => {
    if (!selectedDocument) return false;
    
    // Admin can edit any document
    if (isAdmin) return true;
    
    // Regular users can only edit their own documents
    return selectedDocument.uploadedBy === keycloak?.idTokenParsed?.preferred_username;
  };
  
  // If not authenticated, show login message
  if (!authenticated) {
    return <AuthenticationMessage />;
  }
  
  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">
          {selectedDocument 
            ? 'Document Details' 
            : showUploadForm 
              ? 'Upload New Document' 
              : showEditForm 
                ? 'Edit Document' 
                : 'Document Management'}
        </h1>
        
        {!selectedDocument && !showUploadForm && !showEditForm && (
          <Button 
            variant="primary" 
            onClick={() => setShowUploadForm(true)}
          >
            <i className="bi bi-upload me-2"></i>Upload New Document
          </Button>
        )}
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" className="d-flex align-items-center mb-4">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMessage}</div>
        </Alert>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
        </Alert>
      )}
      
      {/* Main Content */}
      {showUploadForm ? (
        <DocumentForm 
          onSubmit={handleCreateDocument}
          onCancel={() => setShowUploadForm(false)}
          isAdmin={isAdmin}
        />
      ) : showEditForm && selectedDocument ? (
        <DocumentForm 
          document={selectedDocument}
          onSubmit={handleUpdateDocument}
          onCancel={() => setShowEditForm(false)}
          isAdmin={isAdmin}
        />
      ) : selectedDocument ? (
        <DocumentDetail 
          document={selectedDocument}
          onBack={handleBackToDocuments}
          onDelete={() => setShowDeleteModal(true)}
          onEdit={() => setShowEditForm(true)}
          canEdit={canEditDocument()}
        />
      ) : (
        <DocumentList 
          documents={documents}
          onDelete={(docId) => {
            // Find the document to be deleted
            const docToDelete = documents.find(doc => doc.id === docId);
            if (docToDelete) {
              setSelectedDocument(docToDelete);
              setShowDeleteModal(true);
            }
          }}
          onView={handleViewDocument}
          isAdmin={isAdmin}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the document <strong>{selectedDocument?.title}</strong>?</p>
          <p className="text-danger mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDocument}>
            Delete Document
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DocumentsPage;