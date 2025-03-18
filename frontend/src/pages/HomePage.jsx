import React from 'react'
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

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">
                <h1>Welcome to the Application</h1>
              </Card.Title>
              {authenticated ? (
                <div className="text-center">
                  <p className="lead mb-4">Hello, {keycloak?.idTokenParsed.preferred_username}!</p>
                  <div className="d-grid gap-3">
                    <Link to="/my-account" className="btn btn-primary btn-lg">
                      Go to My Account
                    </Link>
                    <Button variant="outline-secondary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="lead mb-4">Please log in to access your personalized content.</p>
                  <div className="d-grid">
                    <Button variant="primary" size="lg" onClick={handleLogin}>
                      Login
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default HomePage