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
    <Container className="py-5">
      <Card className="text-center shadow">
        <Card.Body className="p-5">
          <Card.Title>
            <h2>Authentication Required</h2>
          </Card.Title>
          <Card.Text className="my-4">
            You need to be logged in to access this page.
          </Card.Text>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
            <Link to="/" className="btn btn-outline-secondary">
              Back to Home
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthenticationMessage;