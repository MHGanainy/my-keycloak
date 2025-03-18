import React from 'react';
import { Container, Alert, Card, ListGroup } from 'react-bootstrap';
import useKeycloak from '../hooks/useKeycloak';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
  const { keycloak, authenticated, hasRole, getUserRoles } = useKeycloak();
  
  // Redirect if not authenticated or not admin
  if (!authenticated || !hasRole('admin')) {
    return <Navigate to="/" />;
  }

  // Get all of the user's roles for display
  const userRoles = getUserRoles();

  return (
    <Container className="py-5">
      <Card className="shadow">
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4">
            <h1>Super privileged Admin Page</h1>
          </Card.Title>
          <Alert variant="danger">
            <p className="lead">This is a restricted area only accessible to administrators.</p>
          </Alert>
          
          <p>Welcome, Admin <strong>{keycloak?.idTokenParsed?.preferred_username || 'User'}</strong>!</p>
          
          <h4 className="mt-4">Your Roles</h4>
          <ListGroup className="mb-4">
            {userRoles.map((role, index) => (
              <ListGroup.Item key={index} className={role === 'admin' ? 'bg-warning' : ''}>
                {role}
              </ListGroup.Item>
            ))}
          </ListGroup>
          
          <h4>Administrative Tools</h4>
          <p>This area would contain administrative tools and privileged information that only administrators should access.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPage;