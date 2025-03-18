import React from 'react';
import { Container, Alert, Card, ListGroup, Row, Col, Badge, Table } from 'react-bootstrap';
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

  // Mock data for admin dashboard
  const mockStats = [
    { title: 'Total Users', value: '1,245', icon: 'bi-people-fill', color: 'primary' },
    { title: 'Active Sessions', value: '37', icon: 'bi-lightning-charge-fill', color: 'success' },
    { title: 'Failed Logins', value: '12', icon: 'bi-exclamation-triangle-fill', color: 'danger' },
    { title: 'New Users Today', value: '5', icon: 'bi-person-plus-fill', color: 'info' }
  ];

  // Mock recent activity
  const recentActivity = [
    { user: 'john.doe', action: 'Logged in', time: '10 minutes ago' },
    { user: 'alice.smith', action: 'Password changed', time: '45 minutes ago' },
    { user: 'bob.johnson', action: 'Account locked', time: '2 hours ago' },
    { user: 'emily.wilson', action: 'Role updated', time: '3 hours ago' },
    { user: 'david.brown', action: 'Registered', time: '5 hours ago' }
  ];

  return (
    <Container className="py-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Admin Dashboard</h1>
        <Alert variant="warning" className="d-inline-flex align-items-center mb-0 py-2 px-3">
          <i className="bi bi-shield-lock-fill me-2"></i> Privileged Access Area
        </Alert>
      </div>

      {/* Dashboard Stats */}
      <Row className="mb-4">
        {mockStats.map((stat, index) => (
          <Col md={3} sm={6} className="mb-4 mb-md-0" key={index}>
            <Card className="border-0 shadow h-100">
              <Card.Body className="py-3">
                <Row className="no-gutters align-items-center">
                  <Col className="mr-2">
                    <div className={`text-xs font-weight-bold text-${stat.color} text-uppercase mb-1`}>
                      {stat.title}
                    </div>
                    <div className="h3 mb-0 font-weight-bold">{stat.value}</div>
                  </Col>
                  <Col xs="auto">
                    <i className={`bi ${stat.icon} text-${stat.color} fs-1 opacity-25`}></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Your Roles */}
        <Col lg={4} className="mb-4">
          <Card className="shadow border-0 admin-card h-100">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="m-0 font-weight-bold">
                <i className="bi bi-person-badge me-2"></i>Your Admin Roles
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-3">
                Welcome, Admin <strong>{keycloak?.idTokenParsed?.preferred_username || 'User'}</strong>!
              </p>
              <ListGroup variant="flush">
                {userRoles.map((role, index) => (
                  <ListGroup.Item 
                    key={index} 
                    className={`role-item d-flex justify-content-between align-items-center ${role === 'admin' ? 'admin-role' : ''}`}
                  >
                    <div>
                      <i className={`bi ${role === 'admin' ? 'bi-shield-lock' : 'bi-person'} me-2`}></i>
                      {role}
                    </div>
                    {role === 'admin' && (
                      <Badge bg="warning" text="dark">Privileged</Badge>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={8} className="mb-4">
          <Card className="shadow border-0 h-100">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="m-0 font-weight-bold">
                <i className="bi bi-activity me-2"></i>Recent User Activity
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          {activity.user}
                        </div>
                      </td>
                      <td>{activity.action}</td>
                      <td><small className="text-muted">{activity.time}</small></td>
                      <td>
                        <button className="btn btn-sm btn-light">
                          <i className="bi bi-info-circle"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Row>
        <Col>
          <Card className="shadow border-0 mb-4">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="m-0 font-weight-bold">
                <i className="bi bi-gear me-2"></i>System Health
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h6>Server Status: <Badge bg="success">Online</Badge></h6>
                    <div className="progress">
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: '93%' }} aria-valuenow="93" aria-valuemin="0" aria-valuemax="100">93%</div>
                    </div>
                    <small className="text-muted">Server uptime: 15 days, 7 hours</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <h6>Database: <Badge bg="success">Healthy</Badge></h6>
                    <div className="progress">
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: '45%' }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">45%</div>
                    </div>
                    <small className="text-muted">Storage usage: 45% of 10GB used</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .avatar-sm {
          width: 32px;
          height: 32px;
        }
        .admin-card {
          border-left: 5px solid var(--primary-color);
        }
        .progress {
          height: 8px;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </Container>
  );
};

export default AdminPage;