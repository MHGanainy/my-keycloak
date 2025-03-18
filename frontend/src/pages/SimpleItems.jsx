import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { fetchItems } from '../services/api';
import { KeycloakContext } from '../context/KeycloakContext';

const SimpleItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { keycloak, authenticated } = useContext(KeycloakContext);

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        if (authenticated && keycloak?.token) {
          // Optionally, refresh the token here using keycloak.updateToken(minValidity)
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

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Items List</h1>
      
      {message && (
        <Alert variant="info" className="mb-4">
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center">
          <Card.Body>
            <Card.Title>No Items Found</Card.Title>
            <Card.Text>No items available.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {items.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SimpleItems;