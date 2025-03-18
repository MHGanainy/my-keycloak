import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import { fetchItems } from '../services/api';
import useKeycloak from '../hooks/useKeycloak';
import AuthenticationMessage from '../components/AuthenticationMessage';

const SimpleItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { keycloak, authenticated } = useKeycloak();

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        if (authenticated && keycloak?.token) {
          // Optional token refresh
          await keycloak.updateToken(30);
          const response = await fetchItems(keycloak.token);
          setItems(response.items || []);
          setMessage(response.message || '');
          setError(null);
        } else {
          setError('Not authenticated, please login.');
          setItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError('Failed to load items. Please try again later.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [authenticated, keycloak]);

  if (!authenticated) {
    return <AuthenticationMessage />;
  }

  // Enhance items with color and icon information
  const enhancedItems = items.map(item => ({
    ...item,
    color: getRandomColor(),
    icon: getRandomIcon()
  }));

  // Helper function to get a random color
  function getRandomColor() {
    const colors = ['primary', 'success', 'info', 'warning'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Helper function to get a random icon
  function getRandomIcon() {
    const icons = [
      'bi-box-seam', 'bi-collection', 'bi-gem', 
      'bi-grid-1x2', 'bi-hexagon', 'bi-layers'
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  return (
    <Container className="py-4 fade-in">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">My Items Collection</h1>
        <Badge bg="primary" className="px-3 py-2">
          <i className="bi bi-list-check me-1"></i> 
          {items.length} Items
        </Badge>
      </div>
      
      {message && (
        <Alert variant="info" className="mb-4 d-flex align-items-center">
          <i className="bi bi-info-circle-fill me-2 fs-5"></i>
          <div>{message}</div>
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4 d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" role="status" variant="primary" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">Loading your items...</p>
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center border-0 shadow">
          <Card.Body className="py-5">
            <div className="empty-state mb-3">
              <i className="bi bi-inbox text-secondary" style={{ fontSize: '4rem' }}></i>
            </div>
            <Card.Title className="mb-3">No Items Found</Card.Title>
            <Card.Text className="text-muted">
              There are no items available in your collection at this time.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {enhancedItems.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm border-0 item-card">
                <div className={`card-icon-container bg-${item.color} bg-opacity-10 text-${item.color}`}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {item.name}
                    <Badge bg={item.color} className="badge-sm">
                      #{item.id}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    {item.description || 'No description available for this item.'}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <div className="d-flex justify-content-between text-muted small">
                    <span>
                      <i className="bi bi-clock me-1"></i> Added recently
                    </span>
                    <span>
                      <i className="bi bi-eye me-1"></i> View details
                    </span>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <style jsx>{`
        .card-icon-container {
          padding: 2rem 0;
          text-align: center;
          font-size: 3rem;
          border-top-left-radius: var(--border-radius);
          border-top-right-radius: var(--border-radius);
        }
        
        .item-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
        
        .badge-sm {
          font-size: 0.7rem;
          font-weight: 500;
        }
        
        .empty-state {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
      `}</style>
    </Container>
  );
};

export default SimpleItems;