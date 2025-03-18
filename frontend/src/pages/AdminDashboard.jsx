// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import useKeycloak from '../hooks/useKeycloak';
import { getAllDocuments, getDocumentStats } from '../services/documentService';
import { getDocumentTypeIcon, getAccessBadgeClass, getStatusBadgeClass, formatDate } from '../utils/documentIcons';

const AdminDashboard = () => {
  const { keycloak, authenticated, hasRole } = useKeycloak();
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is admin
  const isAdmin = hasRole('admin');
  
  // Redirect if not admin
  if (!authenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  // Fetch documents and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (keycloak?.token) {
          // Fetch all documents
          const docsResponse = await getAllDocuments(keycloak.token);
          setDocuments(docsResponse.documents || []);
          
          // Fetch stats
          const statsResponse = await getDocumentStats(keycloak.token);
          setStats(statsResponse.stats);
          
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [keycloak]);
  
  // Get recent documents (last 5)
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    .slice(0, 5);
  
  // Calculate user stats
  const calculateUserStats = () => {
    if (!documents || documents.length === 0) return {};
    
    const users = {};
    
    documents.forEach(doc => {
      const user = doc.uploadedBy;
      
      if (!users[user]) {
        users[user] = { count: 0, byType: {} };
      }
      
      users[user].count++;
      
      if (!users[user].byType[doc.fileType]) {
        users[user].byType[doc.fileType] = 0;
      }
      
      users[user].byType[doc.fileType]++;
    });
    
    return users;
  };
  
  const userStats = calculateUserStats();
  
  return (
    <Container className="py-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">Admin Dashboard</h1>
        <Alert variant="warning" className="d-inline-flex align-items-center mb-0 py-2 px-3">
          <i className="bi bi-shield-lock-fill me-2"></i> Document Management Admin Area
        </Alert>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="stat-icon bg-primary-light text-primary me-3">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Documents</h6>
                    <h3 className="mb-0">{stats?.totalDocuments || 0}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="stat-icon bg-success-light text-success me-3">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Published</h6>
                    <h3 className="mb-0">{stats?.byStatus?.published || 0}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="stat-icon bg-warning-light text-warning me-3">
                    <i className="bi bi-pencil-square"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Drafts</h6>
                    <h3 className="mb-0">{stats?.byStatus?.draft || 0}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="stat-icon bg-info-light text-info me-3">
                    <i className="bi bi-people"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Users</h6>
                    <h3 className="mb-0">{Object.keys(userStats).length}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            {/* Document Types Chart */}
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Document Types Distribution</h5>
                </Card.Header>
                <Card.Body>
                  {stats && stats.byType && Object.keys(stats.byType).length > 0 ? (
                    <div className="chart-container">
                      <Table>
                        <thead>
                          <tr>
                            <th>File Type</th>
                            <th>Count</th>
                            <th>Percentage</th>
                            <th>Distribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(stats.byType).map(([type, count]) => {
                            const { icon, color } = getDocumentTypeIcon(type);
                            const percentage = ((count / stats.totalDocuments) * 100).toFixed(1);
                            
                            return (
                              <tr key={type}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <i className={`bi ${icon} text-${color} me-2`}></i>
                                    <span className="text-uppercase">{type}</span>
                                  </div>
                                </td>
                                <td>{count}</td>
                                <td>{percentage}%</td>
                                <td width="40%">
                                  <div className="progress">
                                    <div 
                                      className={`progress-bar bg-${color}`} 
                                      role="progressbar" 
                                      style={{ width: `${percentage}%` }}
                                      aria-valuenow={percentage} 
                                      aria-valuemin="0" 
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-bar-chart text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="text-muted mt-2">No document type data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            {/* Document Access Distribution */}
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Document Access Levels</h5>
                </Card.Header>
                <Card.Body>
                  {stats && stats.byAccess && Object.keys(stats.byAccess).length > 0 ? (
                    <div className="chart-container">
                      <Table>
                        <thead>
                          <tr>
                            <th>Access Level</th>
                            <th>Count</th>
                            <th>Percentage</th>
                            <th>Distribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(stats.byAccess).map(([access, count]) => {
                            const badgeClass = getAccessBadgeClass(access);
                            const percentage = ((count / stats.totalDocuments) * 100).toFixed(1);
                            
                            return (
                              <tr key={access}>
                                <td>
                                  <Badge bg={badgeClass} className="text-capitalize">{access}</Badge>
                                </td>
                                <td>{count}</td>
                                <td>{percentage}%</td>
                                <td width="40%">
                                  <div className="progress">
                                    <div 
                                      className={`progress-bar bg-${badgeClass}`} 
                                      role="progressbar" 
                                      style={{ width: `${percentage}%` }}
                                      aria-valuenow={percentage} 
                                      aria-valuemin="0" 
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-pie-chart text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="text-muted mt-2">No access level data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            {/* Recent Documents */}
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Documents</h5>
                  <Link to="/documents" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </Card.Header>
                <Card.Body className="p-0">
                  {recentDocuments.length > 0 ? (
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Document</th>
                          <th>User</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Access</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDocuments.map(doc => {
                          const { icon, color } = getDocumentTypeIcon(doc.fileType);
                          const statusClass = getStatusBadgeClass(doc.status);
                          const accessClass = getAccessBadgeClass(doc.access);
                          
                          return (
                            <tr key={doc.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className={`icon-sm bg-${color} bg-opacity-10 text-${color} me-2`}>
                                    <i className={`bi ${icon}`}></i>
                                  </div>
                                  <div>
                                    <div className="text-truncate" style={{ maxWidth: '200px' }}>{doc.title}</div>
                                    <small className="text-muted">{doc.fileType.toUpperCase()} • {doc.size}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{doc.uploadedBy}</td>
                              <td>{formatDate(doc.uploadDate)}</td>
                              <td>
                                <Badge bg={statusClass}>{doc.status}</Badge>
                              </td>
                              <td>
                                <Badge bg={accessClass}>{doc.access}</Badge>
                              </td>
                              <td>
                                <Link 
                                  to={`/documents/${doc.id}`} 
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-files text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="text-muted mt-2">No documents available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            {/* User Document Stats */}
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">User Activity</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {Object.keys(userStats).length > 0 ? (
                    <Table responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>User</th>
                          <th>Documents</th>
                          <th>Most Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(userStats)
                          .sort((a, b) => b[1].count - a[1].count)
                          .map(([user, data]) => {
                            // Get the most used file type
                            const mostUsedType = Object.entries(data.byType)
                              .sort((a, b) => b[1] - a[1])[0];
                              
                            const { icon, color } = getDocumentTypeIcon(mostUsedType ? mostUsedType[0] : 'unknown');
                            
                            return (
                              <tr key={user}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="avatar-circle me-2">
                                      {user.charAt(0).toUpperCase()}
                                    </div>
                                    {user}
                                  </div>
                                </td>
                                <td>{data.count}</td>
                                <td>
                                  {mostUsedType ? (
                                    <div className="d-flex align-items-center">
                                      <i className={`bi ${icon} text-${color} me-1`}></i>
                                      <span className="text-uppercase small">{mostUsedType[0]}</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-people text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="text-muted mt-2">No user data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      
      <style jsx>{`
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }
        
        .bg-primary-light {
          background-color: rgba(74, 109, 167, 0.1);
        }
        
        .bg-success-light {
          background-color: rgba(40, 167, 69, 0.1);
        }
        
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1);
        }
        
        .bg-info-light {
          background-color: rgba(23, 162, 184, 0.1);
        }
        
        .icon-sm {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        
        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }
        
        .progress {
          height: 8px;
        }
        
        .chart-container {
          height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;