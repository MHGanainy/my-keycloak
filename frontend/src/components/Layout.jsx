import React from 'react';
import { Container, Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useKeycloak from '../hooks/useKeycloak';

const Layout = ({ children }) => {
  const { keycloak, authenticated, hasRole } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Function to check if a nav link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="white" expand="lg" className="mb-4 navbar-light">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img 
              src="/vite.svg" 
              width="30" 
              height="30" 
              className="d-inline-block align-top me-2" 
              alt="Logo" 
            />
            My Secure App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className={isActive('/')}>
                Home
              </Nav.Link>
              {authenticated && (
                <>
                  <Nav.Link as={Link} to="/simple-items" className={isActive('/simple-items')}>
                    My Items
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-account" className={isActive('/my-account')}>
                    My Account
                  </Nav.Link>
                  
                  {/* Show Admin tab only for users with admin role */}
                  {hasRole('admin') && (
                    <Nav.Link as={Link} to="/admin" className={isActive('/admin')}>
                      Admin <Badge bg="warning" text="dark" className="ms-1">Privileged</Badge>
                    </Nav.Link>
                  )}
                </>
              )}
            </Nav>
            <Nav>
              {authenticated && keycloak?.idTokenParsed?.preferred_username && (
                <Navbar.Text className="me-3">
                  <i className="bi bi-person-circle me-1"></i>
                  <strong>{keycloak.idTokenParsed.preferred_username}</strong>
                </Navbar.Text>
              )}
              {authenticated ? (
                <Button variant="outline-primary" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </Button>
              ) : (
                <Button variant="primary" onClick={handleLogin}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1 py-3">
        <Container>
          <div className="fade-in">
            {children}
          </div>
        </Container>
      </main>

      <footer className="bg-light text-center text-muted py-4 mt-5">
        <Container>
          <div className="row">
            <div className="col-md-4">
              <h5 className="text-dark">My Secure App</h5>
              <p className="small">A secure application powered by Keycloak, React, and Bootstrap</p>
            </div>
            <div className="col-md-4">
              <h5 className="text-dark">Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-decoration-none">Home</Link></li>
                {authenticated && <li><Link to="/my-account" className="text-decoration-none">My Account</Link></li>}
                {authenticated && <li><Link to="/simple-items" className="text-decoration-none">My Items</Link></li>}
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="text-dark">Contact</h5>
              <p className="small">
                <i className="bi bi-envelope me-2"></i> contact@mysecureapp.com
              </p>
            </div>
          </div>
          <hr />
          <p className="mb-0">&copy; {new Date().getFullYear()} My Secure Application. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;