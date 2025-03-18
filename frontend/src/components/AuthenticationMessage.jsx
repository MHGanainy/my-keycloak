import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useKeycloak from '../hooks/useKeycloak';

const AuthenticationMessage = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  return (
    <Container className="py-5 fade-in">
      <Card className="text-center shadow border-0">
        <Card.Body className="p-5">
          <div className="auth-icon mb-4">
            <div className="icon-circle">
              <i className="bi bi-shield-lock"></i>
            </div>
          </div>
          
          <Card.Title>
            <h2 className="mb-3">Authentication Required</h2>
          </Card.Title>
          
          <Card.Text className="text-muted mb-4">
            You need to be logged in to access this page. Please login to continue.
          </Card.Text>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleLogin}
              className="px-4"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </Button>
            
            <Link to="/" className="btn btn-outline-secondary btn-lg px-4">
              <i className="bi bi-house-door me-2"></i>
              Back to Home
            </Link>
          </div>
        </Card.Body>
      </Card>
      
      <style jsx>{`
        .auth-icon {
          margin-bottom: 1.5rem;
        }
        
        .icon-circle {
          width: 80px;
          height: 80px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 2.5rem;
        }
      `}</style>
    </Container>
  );
};

export default AuthenticationMessage;