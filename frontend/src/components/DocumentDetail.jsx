// frontend/src/components/DocumentDetail.jsx
import React from 'react';
import { Card, Row, Col, Badge, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDocumentTypeIcon, getAccessBadgeClass, getStatusBadgeClass, formatDate } from '../utils/documentIcons';

const DocumentDetail = ({ document, onBack, onDelete, onEdit, canEdit = false }) => {
  if (!document) {
    return (
      <Card className="text-center p-4 border-0 shadow-sm">
        <Card.Body>
          <i className="bi bi-file-earmark-x display-4 text-muted mb-3"></i>
          <h4>Document Not Found</h4>
          <p className="text-muted">The requested document could not be found or you don't have permission to view it.</p>
          <Button variant="primary" onClick={onBack}>
            Back to Documents
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const { icon, color } = getDocumentTypeIcon(document.fileType);
  const accessClass = getAccessBadgeClass(document.access);
  const statusClass = getStatusBadgeClass(document.status);

  return (
    <Card className="border-0 shadow-sm document-detail-card">
      <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
        <div className="d-flex justify-content-between align-items-start">
          <Button variant="outline-secondary" size="sm" onClick={onBack}>
            <i className="bi bi-arrow-left me-2"></i>Back to Documents
          </Button>
          
          {canEdit && (
            <div className="d-flex">
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={onEdit}
              >
                <i className="bi bi-pencil me-2"></i>Edit
              </Button>
              <Button 
                variant="outline-danger"
                onClick={onDelete}
              >
                <i className="bi bi-trash me-2"></i>Delete
              </Button>
            </div>
          )}
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Row>
          <Col md={8}>
            <div className="d-flex align-items-center mb-4">
              <div className={`doc-icon-lg me-3 bg-${color} bg-opacity-10 text-${color}`}>
                <i className={`bi ${icon}`}></i>
              </div>
              <div>
                <h2 className="mb-1">{document.title}</h2>
                <div>
                  <Badge bg={accessClass} className="me-1">{document.access}</Badge>
                  <Badge bg={statusClass} className="me-1">{document.status}</Badge>
                  <Badge bg="secondary">{document.fileType.toUpperCase()}</Badge>
                </div>
              </div>
            </div>
            
            <h5 className="mb-3">Description</h5>
            <p className="text-muted">{document.description || 'No description provided.'}</p>
            
            {document.tags && document.tags.length > 0 && (
              <>
                <h5 className="mb-3 mt-4">Tags</h5>
                <div className="mb-4">
                  {document.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      bg="light" 
                      text="dark" 
                      className="me-2 mb-2 px-3 py-2"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
            
            <h5 className="mb-3 mt-4">Actions</h5>
            <div className="mb-4">
              <Button variant="primary" className="me-2">
                <i className="bi bi-download me-2"></i>Download
              </Button>
              <Button variant="outline-secondary" className="me-2">
                <i className="bi bi-share me-2"></i>Share
              </Button>
              <Button variant="outline-secondary">
                <i className="bi bi-printer me-2"></i>Print
              </Button>
            </div>
          </Col>
          
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0">Document Details</h5>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">File Type</span>
                  <span className="fw-medium">{document.fileType.toUpperCase()}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Size</span>
                  <span className="fw-medium">{document.size}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Uploaded By</span>
                  <span className="fw-medium">{document.uploadedBy}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Uploaded Date</span>
                  <span className="fw-medium">{formatDate(document.uploadDate)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Status</span>
                  <Badge bg={statusClass}>{document.status}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Access Level</span>
                  <Badge bg={accessClass}>{document.access}</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DocumentDetail;