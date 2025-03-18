// frontend/src/components/DocumentList.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDocumentTypeIcon, getAccessBadgeClass, getStatusBadgeClass, formatDate } from '../utils/documentIcons';

const DocumentList = ({ documents, onDelete, onView, isAdmin = false }) => {
  const [filteredDocs, setFilteredDocs] = useState(documents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAccess, setFilterAccess] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (!documents) return;
    
    // Apply filters and search
    let result = [...documents];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.description.toLowerCase().includes(term) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Type filter
    if (filterType !== 'all') {
      result = result.filter(doc => doc.fileType === filterType);
    }
    
    // Access filter
    if (filterAccess !== 'all') {
      result = result.filter(doc => doc.access === filterAccess);
    }
    
    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.fileType.localeCompare(b.fileType);
          break;
        case 'date':
          comparison = new Date(b.uploadDate) - new Date(a.uploadDate);
          break;
        case 'size':
          const getSize = (sizeStr) => {
            if (!sizeStr) return 0;
            const [size, unit] = sizeStr.split(' ');
            const multiplier = {
              'KB': 1,
              'MB': 1024,
              'GB': 1048576
            };
            return parseFloat(size) * (multiplier[unit] || 1);
          };
          comparison = getSize(a.size) - getSize(b.size);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredDocs(result);
  }, [documents, searchTerm, filterType, filterAccess, sortBy, sortOrder]);

  const uniqueFileTypes = Array.from(new Set(documents?.map(doc => doc.fileType) || []));
  
  // Get document file types for filter
  const fileTypes = uniqueFileTypes.map(type => ({
    value: type,
    label: type.toUpperCase()
  }));

  const renderDocumentCard = (document) => {
    const { icon, color } = getDocumentTypeIcon(document.fileType);
    const accessClass = getAccessBadgeClass(document.access);
    const statusClass = getStatusBadgeClass(document.status);
    
    return (
      <Col md={6} lg={4} className="mb-4" key={document.id}>
        <Card className="h-100 document-card shadow-sm border-0">
          <Card.Body>
            <div className="d-flex mb-3 align-items-center">
              <div className={`doc-icon-wrapper me-3 bg-${color} bg-opacity-10 text-${color}`}>
                <i className={`bi ${icon}`}></i>
              </div>
              <div>
                <h5 className="mb-1 text-truncate" style={{ maxWidth: '230px' }} title={document.title}>
                  {document.title}
                </h5>
                <div>
                  <Badge bg={accessClass} className="me-1">{document.access}</Badge>
                  <Badge bg={statusClass}>{document.status}</Badge>
                  <Badge bg="secondary" className="ms-1">{document.fileType.toUpperCase()}</Badge>
                </div>
              </div>
            </div>
            
            <p className="text-muted mb-3 description-truncate">
              {document.description || 'No description provided'}
            </p>
            
            {document.tags && document.tags.length > 0 && (
              <div className="mb-3 document-tags">
                {document.tags.map((tag, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center mt-auto">
              <small className="text-muted">
                <i className="bi bi-clock me-1"></i>
                {formatDate(document.uploadDate)}
              </small>
              <span className="text-muted">{document.size}</span>
            </div>
          </Card.Body>
          
          <Card.Footer className="bg-light border-0 pt-0">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                By: {document.uploadedBy}
              </small>
              
              <div className="btn-group">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => onView && onView(document.id)}
                >
                  <i className="bi bi-eye me-1"></i>View
                </Button>
                
                {(isAdmin || document.uploadedBy === 'john.doe') && (
                  <Dropdown as={Button.Group}>
                    <Dropdown.Toggle split variant="outline-primary" size="sm" id={`dropdown-${document.id}`} />
                    <Dropdown.Menu align="end">
                      <Dropdown.Item as={Link} to={`/documents/edit/${document.id}`}>
                        <i className="bi bi-pencil me-2"></i>Edit
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => onDelete && onDelete(document.id)}
                        className="text-danger"
                      >
                        <i className="bi bi-trash me-2"></i>Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    );
  };

  return (
    <div className="document-list">
      {/* Filter and Search Controls */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6} lg={8}>
              <InputGroup className="mb-3 mb-md-0">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} lg={4} className="d-flex justify-content-end">
              <Dropdown className="me-2">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-type">
                  <i className="bi bi-file-earmark me-1"></i> Type: {filterType === 'all' ? 'All' : filterType.toUpperCase()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterType('all')}>All Types</Dropdown.Item>
                  <Dropdown.Divider />
                  {fileTypes.map((type) => (
                    <Dropdown.Item 
                      key={type.value} 
                      onClick={() => setFilterType(type.value)}
                    >
                      {type.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                  <i className="bi bi-sort-down me-1"></i> Sort
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Sort By</Dropdown.Header>
                  <Dropdown.Item 
                    active={sortBy === 'date'} 
                    onClick={() => setSortBy('date')}
                  >
                    Upload Date
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={sortBy === 'title'} 
                    onClick={() => setSortBy('title')}
                  >
                    Title
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={sortBy === 'type'} 
                    onClick={() => setSortBy('type')}
                  >
                    File Type
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={sortBy === 'size'} 
                    onClick={() => setSortBy('size')}
                  >
                    Size
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Order</Dropdown.Header>
                  <Dropdown.Item 
                    active={sortOrder === 'desc'} 
                    onClick={() => setSortOrder('desc')}
                  >
                    <i className="bi bi-sort-down me-2"></i>Descending
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={sortOrder === 'asc'} 
                    onClick={() => setSortOrder('asc')}
                  >
                    <i className="bi bi-sort-up me-2"></i>Ascending
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Document Cards */}
      {filteredDocs && filteredDocs.length > 0 ? (
        <Row>
          {filteredDocs.map(doc => renderDocumentCard(doc))}
        </Row>
      ) : (
        <Card className="text-center p-5 border-0 shadow-sm">
          <Card.Body>
            <i className="bi bi-folder2-open display-4 text-muted mb-3"></i>
            <h4>No Documents Found</h4>
            <p className="text-muted">
              {searchTerm || filterType !== 'all' || filterAccess !== 'all' 
                ? 'No documents match your current filters. Try adjusting your search criteria.'
                : 'There are no documents available. Start by uploading a new document.'
              }
            </p>
          </Card.Body>
        </Card>
      )}
      
      <style jsx>{`
        .doc-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .description-truncate {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 3em;
        }
        
        .document-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        
        .document-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        .document-tags {
          min-height: 30px;
        }
      `}</style>
    </div>
  );
};

export default DocumentList;