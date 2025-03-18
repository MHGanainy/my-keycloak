// frontend/src/components/DocumentForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { getDocumentTypeIcon } from '../utils/documentIcons';

const DocumentForm = ({ document, onSubmit, onCancel, isAdmin = false }) => {
  const isEditMode = !!document;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: 'pdf',
    size: '1.0 MB',
    tags: [],
    status: 'draft',
    access: 'public'
  });
  
  const [tagInput, setTagInput] = useState('');
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (document) {
      setFormData({
        ...document,
        tags: document.tags || []
      });
    }
  }, [document]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Get file extension
      const extension = file.name.split('.').pop().toLowerCase();
      
      // Determine file type based on extension
      let fileType = extension;
      
      // Get file size in MB
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      
      setFormData(prev => ({
        ...prev,
        fileType,
        size: `${fileSizeMB} MB`,
        fileName: file.name
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    onSubmit(formData);
  };
  
  // Get the document icon based on file type
  const { icon, color } = getDocumentTypeIcon(formData.fileType);
  
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{isEditMode ? 'Edit Document' : 'Upload New Document'}</h4>
          <Button variant="outline-secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Document Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter document title"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a document title.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Enter document description"
                />
              </Form.Group>
              
              {!isEditMode && (
                <Form.Group className="mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required={!isEditMode}
                  />
                  <Form.Text className="text-muted">
                    Maximum file size: 10MB
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    Please select a file to upload.
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    variant="outline-primary" 
                    className="ms-2" 
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      bg="light" 
                      text="dark" 
                      className="me-2 mb-2 py-2 px-3"
                    >
                      {tag}
                      <span 
                        className="ms-2 badge-remove" 
                        onClick={() => handleRemoveTag(tag)}
                      >
                        &times;
                      </span>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0">Document Preview</h5>
                </Card.Header>
                <Card.Body className="text-center py-4">
                  <div className={`doc-preview-icon mx-auto mb-3 bg-${color} bg-opacity-10 text-${color}`}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <h5 className="mb-1 text-truncate">
                    {formData.title || 'Document Title'}
                  </h5>
                  <p className="text-muted mb-0">
                    {formData.fileType?.toUpperCase() || 'PDF'} - {formData.size || '0.0 MB'}
                  </p>
                </Card.Body>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0">Document Settings</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Access Level</Form.Label>
                    <Form.Select 
                      name="access"
                      value={formData.access || 'public'}
                      onChange={handleChange}
                      required
                    >
                      <option value="public">Public (Everyone)</option>
                      <option value="internal">Internal (All Authenticated Users)</option>
                      <option value="restricted">Restricted (Specific Users)</option>
                      <option value="private">Private (Only Me)</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Who can access this document
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      name="status"
                      value={formData.status || 'draft'}
                      onChange={handleChange}
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      {isAdmin && <option value="archived">Archived</option>}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Current status of the document
                    </Form.Text>
                  </Form.Group>
                  
                  {isEditMode && (
                    <div className="mb-3">
                      <Form.Label>File Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.fileType?.toUpperCase() || ''}
                        readOnly
                        disabled
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onCancel} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditMode ? 'Save Changes' : 'Upload Document'}
            </Button>
          </div>
        </Form>
      </Card.Body>
      
      <style jsx>{`
        .doc-preview-icon {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }
        
        .badge-remove {
          cursor: pointer;
          font-weight: bold;
        }
        
        .badge-remove:hover {
          color: var(--bs-danger);
        }
      `}</style>
    </Card>
  );
};

export default DocumentForm;