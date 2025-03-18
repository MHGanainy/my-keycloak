import React from 'react';
import AuthenticationMessage from '../components/AuthenticationMessage';
import useKeycloak from '../hooks/useKeycloak';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyAccount = () => {
  const { keycloak, authenticated } = useKeycloak();
  
  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  if (!authenticated || !keycloak) {
    return <AuthenticationMessage />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">
                <h1>My Account</h1>
              </Card.Title>
              
              <div className="mb-4">
                <h4>Profile Information</h4>
                <hr />
                <p><strong>Username:</strong> {keycloak?.idTokenParsed.preferred_username}</p>
                <p><strong>Email:</strong> {keycloak?.idTokenParsed.email}</p>
                <p><strong>Full Name:</strong> {keycloak?.idTokenParsed.name}</p>
              </div>
              
              <div className="mb-4">
                <h4>Token Information</h4>
                <hr />
                <div className="form-group">
                  <textarea
                    id="token"
                    className="form-control"
                    rows={10}
                    readOnly
                    defaultValue={keycloak?.idToken}
                  />
                </div>
              </div>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Link to="/" className="btn btn-primary me-md-2">
                  Back to Home
                </Link>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyAccount;