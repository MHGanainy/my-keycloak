// frontend/src/components/Layout.jsx
import React from 'react';
import { Container, Navbar, Nav, Button, Badge, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useKeycloak from '../hooks/useKeycloak';

const Layout = ({ children }) => {
  const { keycloak, authenticated, hasRole } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = hasRole('admin');

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
            Document Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className={isActive('/')}>
                Home
              </Nav.Link>
              {authenticated && (
                <>
                  <Nav.Link as={Link} to="/documents" className={isActive('/documents') || location.pathname.startsWith('/documents/')}>
                    Documents
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-account" className={isActive('/my-account')}>
                    My Account
                  </Nav.Link>
                  
                  {/* Show Admin tab only for users with admin role */}
                  {isAdmin && (
                    <Nav.Link as={Link} to="/admin" className={isActive('/admin')}>
                      Admin <Badge bg="warning" text="dark" className="ms-1">Admin</Badge>
                    </Nav.Link>
                  )}
                </>
              )}
            </Nav>
            <Nav>
              {authenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="d-inline-block user-dropdown">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2">
                        {keycloak?.idTokenParsed?.preferred_username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="me-2 d-none d-sm-inline">
                        {keycloak?.idTokenParsed?.preferred_username}
                      </span>
                      <i className="bi bi-chevron-down small"></i>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/my-account">
                      <i className="bi bi-person me-2"></i> My Account
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/documents">
                      <i className="bi bi-file-earmark-text me-2"></i> My Documents
                    </Dropdown.Item>
                    {isAdmin && (
                      <Dropdown.Item as={Link} to="/admin">
                        <i className="bi bi-shield-lock me-2"></i> Admin Dashboard
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
              <h5 className="text-dark">Document Management</h5>
              <p className="small">A secure document management system powered by Keycloak, React, and Bootstrap</p>
            </div>
            <div className="col-md-4">
              <h5 className="text-dark">Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-decoration-none">Home</Link></li>
                {authenticated && <li><Link to="/documents" className="text-decoration-none">Documents</Link></li>}
                {authenticated && <li><Link to="/my-account" className="text-decoration-none">My Account</Link></li>}
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="text-dark">Information</h5>
              <p className="small">
                <i className="bi bi-envelope me-2"></i> support@docmanagement.com
              </p>
              <p className="small">
                <i className="bi bi-shield-lock me-2"></i> Secured with Keycloak Authentication
              </p>
            </div>
          </div>
          <hr />
          <p className="mb-0">&copy; {new Date().getFullYear()} Document Management System. All rights reserved.</p>
        </Container>
      </footer>
      
      <style jsx>{`
        .avatar-circle {
          width: 32px;
          height: 32px;
          background-color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .user-dropdown {
          cursor: pointer;
          padding: 0.5rem 0;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--primary-color);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default Layout;