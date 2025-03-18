import React from 'react';
import { Container, Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import useKeycloak from '../hooks/useKeycloak';

const Layout = ({ children }) => {
  const { keycloak, authenticated, hasRole } = useKeycloak();
  const navigate = useNavigate();

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
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">My App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {authenticated && (
                <>
                  <Nav.Link as={Link} to="/simple-items">My Items</Nav.Link>
                  <Nav.Link as={Link} to="/my-account">My Account</Nav.Link>
                  
                  {/* Show Admin tab only for users with admin role */}
                  {hasRole('admin') && (
                    <Nav.Link as={Link} to="/admin">
                      Admin <Badge bg="warning" text="dark">Privileged</Badge>
                    </Nav.Link>
                  )}
                </>
              )}
            </Nav>
            <Nav>
              {authenticated && keycloak?.idTokenParsed?.preferred_username && (
                <Navbar.Text className="me-3">
                  Signed in as: <strong>{keycloak.idTokenParsed.preferred_username}</strong>
                </Navbar.Text>
              )}
              {authenticated ? (
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              ) : (
                <Button variant="outline-light" onClick={handleLogin}>Login</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        {children}
      </main>

      <footer className="bg-light text-center text-muted py-4 mt-5">
        <Container>
          <p>&copy; {new Date().getFullYear()} My Application. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;