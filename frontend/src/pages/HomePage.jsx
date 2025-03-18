// frontend/src/pages/HomePage.jsx
import React from 'react';
import useKeycloak from '../hooks/useKeycloak';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { keycloak, authenticated, hasRole } = useKeycloak();
  const isAdmin = hasRole('admin');

  const handleLogin = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  // Feature sections to display
  const features = [
    {
      title: "Document Management",
      description: "Upload, organize, and access your documents from anywhere. Support for multiple file formats including PDF, Word, Excel, and more.",
      icon: "bi-file-earmark-text",
      color: "primary"
    },
    {
      title: "Role-Based Access",
      description: "Secure access control with different permission levels. Admins can manage all documents while users can only access their own.",
      icon: "bi-shield-lock",
      color: "success"
    },
    {
      title: "Document Tagging",
      description: "Categorize your documents with tags for easy organization and searching. Filter documents by type, access level, and more.",
      icon: "bi-tags",
      color: "info"
    }
  ];

  return (
    <>
      <div className="hero-section text-center rounded mb-5">
        <Container className="py-5">
          <h1 className="display-4 fw-bold mb-3">Document Management System</h1>
          <p className="lead mb-4">A secure platform to store, share, and manage your documents</p>
          {!authenticated ? (
            <Button 
              variant="light" 
              size="lg" 
              onClick={handleLogin}
              className="px-4 py-2"
            >
              Get Started
            </Button>
          ) : (
            <Link to="/documents" className="btn btn-light btn-lg px-4 py-2">
              Browse Documents
            </Link>
          )}
        </Container>
      </div>

      <Container>
        {authenticated ? (
          <Row className="justify-content-center mb-5">
            <Col md={10} lg={8}>
              <Card className="shadow border-0">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div className="avatar-circle mx-auto mb-3">
                      <span className="avatar-text">
                        {keycloak?.idTokenParsed.preferred_username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="card-title mb-2">Welcome back, {keycloak?.idTokenParsed.preferred_username}!</h2>
                    <p className="text-muted mb-0">What would you like to do today?</p>
                  </div>
                  
                  <Row className="mt-4 text-center">
                    <Col md={6} className="mb-3">
                      <Link to="/documents" className="action-card d-block p-4 rounded">
                        <div className="action-icon bg-primary-light text-primary mx-auto mb-3">
                          <i className="bi bi-file-earmark-text"></i>
                        </div>
                        <h4>Browse Documents</h4>
                        <p className="text-muted mb-0">View and manage your document library</p>
                      </Link>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Link to="/documents?upload=true" className="action-card d-block p-4 rounded">
                        <div className="action-icon bg-success-light text-success mx-auto mb-3">
                          <i className="bi bi-upload"></i>
                        </div>
                        <h4>Upload Document</h4>
                        <p className="text-muted mb-0">Add a new document to your collection</p>
                      </Link>
                    </Col>
                  </Row>
                  
                  {isAdmin && (
                    <div className="text-center mt-4 pt-4 border-top">
                      <Badge bg="warning" text="dark" className="mb-3 px-3 py-2">
                        <i className="bi bi-shield-lock me-1"></i> Admin Access
                      </Badge>
                      <div>
                        <Link to="/admin" className="btn btn-primary">
                          <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                        </Link>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center mb-5">
            <Col md={10} lg={8}>
              <Card className="shadow border-0">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="card-title mb-3">Secure Document Management</h2>
                    <p className="lead">Sign in to access and manage your documents</p>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleLogin}
                      className="py-3"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        
        {/* Features Section */}
        <Row className="mb-5">
          <Col xs={12} className="text-center mb-4">
            <h2 className="section-title">Features</h2>
            <p className="section-subtitle">Powerful tools to manage your documents</p>
          </Col>
          
          {features.map((feature, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="h-100 shadow-sm border-0 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className={`feature-icon mx-auto mb-3 bg-${feature.color}-light text-${feature.color}`}>
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h4>{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Document Types Section */}
        <Row className="mb-5">
          <Col xs={12} className="text-center mb-4">
            <h2 className="section-title">Supported Document Types</h2>
            <p className="section-subtitle">Manage a wide variety of document formats</p>
          </Col>
          
          <Col xs={12}>
            <div className="document-types-container d-flex flex-wrap justify-content-center">
              <div className="doc-type-item">
                <div className="doc-type-icon bg-danger-light text-danger">
                  <i className="bi bi-file-earmark-pdf"></i>
                </div>
                <span className="doc-type-label">PDF</span>
              </div>
              
              <div className="doc-type-item">
                <div className="doc-type-icon bg-primary-light text-primary">
                  <i className="bi bi-file-earmark-word"></i>
                </div>
                <span className="doc-type-label">Word</span>
              </div>
              
              <div className="doc-type-item">
                <div className="doc-type-icon bg-success-light text-success">
                  <i className="bi bi-file-earmark-excel"></i>
                </div>
                <span className="doc-type-label">Excel</span>
              </div>
              
              <div className="doc-type-item">
                <div className="doc-type-icon bg-warning-light text-warning">
                  <i className="bi bi-file-earmark-ppt"></i>
                </div>
                <span className="doc-type-label">PowerPoint</span>
              </div>
              
              <div className="doc-type-item">
                <div className="doc-type-icon bg-info-light text-info">
                  <i className="bi bi-file-earmark-image"></i>
                </div>
                <span className="doc-type-label">Images</span>
              </div>
              
              <div className="doc-type-item">
                <div className="doc-type-icon bg-secondary-light text-secondary">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
                <span className="doc-type-label">Text</span>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Benefits Section */}
        <Row className="mb-5 pt-2">
          <Col md={6} className="mb-4">
            <div className="benefits-image-container rounded shadow-sm">
              {/* Placeholder for image */}
              <div className="benefits-image-placeholder d-flex align-items-center justify-content-center">
                <i className="bi bi-cloud-arrow-up-fill display-1 text-muted"></i>
              </div>
            </div>
          </Col>
          
          <Col md={6} className="mb-4 d-flex flex-column justify-content-center">
            <h2 className="mb-4">Why Choose Our Document Management System?</h2>
            
            <div className="benefit-item d-flex mb-3">
              <div className="benefit-icon me-3">
                <i className="bi bi-cloud-check text-primary"></i>
              </div>
              <div>
                <h5>Secure Cloud Storage</h5>
                <p className="text-muted mb-0">Your documents are securely stored and accessible from anywhere with an internet connection.</p>
              </div>
            </div>
            
            <div className="benefit-item d-flex mb-3">
              <div className="benefit-icon me-3">
                <i className="bi bi-shield-lock text-primary"></i>
              </div>
              <div>
                <h5>Advanced Security</h5>
                <p className="text-muted mb-0">Role-based access control ensures your documents are only accessed by authorized users.</p>
              </div>
            </div>
            
            <div className="benefit-item d-flex">
              <div className="benefit-icon me-3">
                <i className="bi bi-search text-primary"></i>
              </div>
              <div>
                <h5>Powerful Search</h5>
                <p className="text-muted mb-0">Find documents quickly with advanced search and filtering capabilities.</p>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Call to Action */}
        {!authenticated && (
          <Row className="mb-5">
            <Col xs={12}>
              <Card className="border-0 shadow text-center bg-primary text-white cta-card">
                <Card.Body className="p-5">
                  <h2 className="mb-3">Ready to Get Started?</h2>
                  <p className="lead mb-4">Sign in now to start managing your documents securely and efficiently.</p>
                  <Button 
                    variant="light" 
                    size="lg" 
                    onClick={handleLogin}
                    className="px-5"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      
      <style jsx>{`
        .avatar-circle {
          width: 80px;
          height: 80px;
          background-color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .avatar-text {
          color: white;
          font-size: 36px;
          font-weight: bold;
        }
        
        .action-card {
          border: 1px solid #eee;
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }
        
        .action-icon, .feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        
        .section-title {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: var(--secondary-color);
          margin-bottom: 2rem;
        }
        
        .feature-card {
          transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
        }
        
        .document-types-container {
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
        }
        
        .doc-type-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 15px 15px;
          width: 100px;
        }
        
        .doc-type-icon {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin-bottom: 10px;
        }
        
        .doc-type-label {
          font-weight: 500;
        }
        
        .bg-primary-light {
          background-color: rgba(74, 109, 167, 0.1);
        }
        
        .bg-success-light {
          background-color: rgba(40, 167, 69, 0.1);
        }
        
        .bg-danger-light {
          background-color: rgba(220, 53, 69, 0.1);
        }
        
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1);
        }
        
        .bg-info-light {
          background-color: rgba(23, 162, 184, 0.1);
        }
        
        .bg-secondary-light {
          background-color: rgba(108, 117, 125, 0.1);
        }
        
        .benefits-image-container {
          height: 100%;
          min-height: 300px;
          overflow: hidden;
        }
        
        .benefits-image-placeholder {
          height: 100%;
          min-height: 300px;
          background-color: #f8f9fa;
        }
        
        .benefit-icon {
          font-size: 1.75rem;
          color: var(--primary-color);
        }
        
        .cta-card {
          border-radius: 15px;
        }
      `}</style>
    </>
  );
};

export default HomePage;