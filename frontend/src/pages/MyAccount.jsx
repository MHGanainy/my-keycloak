import React, { useState } from 'react';
import AuthenticationMessage from '../components/AuthenticationMessage';
import useKeycloak from '../hooks/useKeycloak';
import { Container, Card, Button, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyAccount = () => {
  const { keycloak, authenticated } = useKeycloak();
  const [showTokenCopied, setShowTokenCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  const copyToClipboard = () => {
    if (keycloak?.idToken) {
      navigator.clipboard.writeText(keycloak.idToken);
      setShowTokenCopied(true);
      setTimeout(() => setShowTokenCopied(false), 3000);
    }
  };

  if (!authenticated || !keycloak) {
    return <AuthenticationMessage />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow border-0">
            <Card.Body className="p-0">
              <div className="account-header bg-primary text-white p-4 rounded-top">
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-3">
                        {keycloak.idTokenParsed.preferred_username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h1 className="fs-3 mb-1">{keycloak.idTokenParsed.name || keycloak.idTokenParsed.preferred_username}</h1>
                        <p className="mb-0 opacity-75">
                          <i className="bi bi-envelope me-1"></i> {keycloak.idTokenParsed.email || 'No email available'}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="mt-3 mt-md-0 text-md-end">
                    <Button variant="light" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </Button>
                  </Col>
                </Row>
              </div>
              
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 px-4 pt-4"
              >
                <Tab eventKey="profile" title={<><i className="bi bi-person me-2"></i>Profile</>}>
                  <div className="p-4 pt-2">
                    <h4 className="border-bottom pb-2 mb-3">Profile Information</h4>
                    
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Username</Col>
                      <Col sm={8} className="fw-medium">{keycloak?.idTokenParsed.preferred_username}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Email</Col>
                      <Col sm={8} className="fw-medium">{keycloak?.idTokenParsed.email || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Full Name</Col>
                      <Col sm={8} className="fw-medium">{keycloak?.idTokenParsed.name || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Given Name</Col>
                      <Col sm={8} className="fw-medium">{keycloak?.idTokenParsed.given_name || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Family Name</Col>
                      <Col sm={8} className="fw-medium">{keycloak?.idTokenParsed.family_name || 'Not provided'}</Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="token" title={<><i className="bi bi-key me-2"></i>Token Information</>}>
                  <div className="p-4 pt-2">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">ID Token</h4>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="px-3"
                      >
                        <i className="bi bi-clipboard me-1"></i> Copy
                      </Button>
                    </div>
                    
                    {showTokenCopied && (
                      <Alert variant="success" className="py-2">
                        <i className="bi bi-check-circle me-2"></i>
                        Token copied to clipboard!
                      </Alert>
                    )}
                    
                    <div className="form-group">
                      <textarea
                        id="token"
                        className="form-control token-area"
                        rows={10}
                        readOnly
                        defaultValue={keycloak?.idToken}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h5>Token Details</h5>
                      <div className="token-details bg-light p-3 rounded">
                        <Row className="mb-2">
                          <Col sm={4} className="text-muted">Issued At</Col>
                          <Col sm={8}>{new Date(keycloak?.idTokenParsed.iat * 1000).toLocaleString()}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col sm={4} className="text-muted">Expires At</Col>
                          <Col sm={8}>{new Date(keycloak?.idTokenParsed.exp * 1000).toLocaleString()}</Col>
                        </Row>
                        <Row>
                          <Col sm={4} className="text-muted">Issuer</Col>
                          <Col sm={8} className="text-break">{keycloak?.idTokenParsed.iss}</Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
              
              <div className="d-flex justify-content-center p-4 border-top">
                <Link to="/" className="btn btn-outline-secondary me-2">
                  <i className="bi bi-house-door me-1"></i> Back to Home
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        .avatar-circle {
          width: 50px;
          height: 50px;
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
        }
        
        .token-area {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          background-color: #f8f9fa;
          color: #495057;
        }
        
        .token-details {
          font-size: 0.9rem;
          border-left: 3px solid var(--primary-color);
        }
      `}</style>
    </Container>
  );
};

export default MyAccount;