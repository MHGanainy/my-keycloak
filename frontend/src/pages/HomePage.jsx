import React from 'react';
import useKeycloak from '../hooks/useKeycloak';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { keycloak, authenticated } = useKeycloak();

  const handleLogin = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  return (
    <>
      <div className="hero-section text-center rounded mb-5">
        <Container className="py-5">
          <h1 className="display-4 fw-bold mb-3">Welcome to My Secure App</h1>
          <p className="lead mb-4">A modern, secure application with Keycloak authentication</p>
          {!authenticated && (
            <Button 
              variant="light" 
              size="lg" 
              onClick={handleLogin}
              className="px-4 py-2"
            >
              Get Started
            </Button>
          )}
        </Container>
      </div>

      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6}>
            <Card className="shadow text-center">
              <Card.Body className="p-5">
                {authenticated ? (
                  <div>
                    <div className="mb-4">
                      <div className="avatar-circle mx-auto mb-3">
                        <span className="avatar-text">
                          {keycloak?.idTokenParsed.preferred_username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h2 className="card-title mb-3">Hello, {keycloak?.idTokenParsed.preferred_username}!</h2>
                      <p className="text-muted">You are now logged in and can access all features of the application.</p>
                    </div>
                    <div className="d-grid gap-3">
                      <Link to="/my-account" className="btn btn-primary btn-lg">
                        <i className="bi bi-person me-2"></i>My Account
                      </Link>
                      <Link to="/simple-items" className="btn btn-outline-primary">
                        <i className="bi bi-collection me-2"></i>View My Items
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="card-title mb-3">Secure Authentication</h2>
                    <p className="text-muted mb-4">
                      Please log in to access your personalized content and explore all the features.
                    </p>
                    <div className="d-grid">
                      <Button variant="primary" size="lg" onClick={handleLogin}>
                        <i className="bi bi-box-arrow-in-right me-2"></i>Login
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
        .feature-icon {
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default HomePage;