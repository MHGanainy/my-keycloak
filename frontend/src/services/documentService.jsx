// frontend/src/services/documentService.js

/**
 * Service for handling document operations
 */

/**
 * Makes a request to the backend API with a bearer token
 * @param {string} endpoint - The API endpoint to call
 * @param {string} token - The Keycloak token for authentication
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body data (for POST/PUT)
 * @returns {Promise} - The API response
 */
const apiRequest = async (endpoint, token, method = 'GET', data = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      };
  
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }
  
      const response = await fetch(`/api${endpoint}`, options);
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };
  
  /**
   * Fetch all documents
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The documents data
   */
  export const getAllDocuments = async (token) => {
    return apiRequest('/documents', token);
  };
  
  /**
   * Fetch document by ID
   * @param {string} id - Document ID
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The document data
   */
  export const getDocumentById = async (id, token) => {
    return apiRequest(`/documents/${id}`, token);
  };
  
  /**
   * Create a new document
   * @param {Object} documentData - The document data to create
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The created document
   */
  export const createDocument = async (documentData, token) => {
    return apiRequest('/documents', token, 'POST', documentData);
  };
  
  /**
   * Update a document
   * @param {string} id - Document ID
   * @param {Object} documentData - The updated document data
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The updated document
   */
  export const updateDocument = async (id, documentData, token) => {
    return apiRequest(`/documents/${id}`, token, 'PUT', documentData);
  };
  
  /**
   * Delete a document
   * @param {string} id - Document ID
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The result of the delete operation
   */
  export const deleteDocument = async (id, token) => {
    return apiRequest(`/documents/${id}`, token, 'DELETE');
  };
  
  /**
   * Search documents
   * @param {string} query - Search query
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The search results
   */
  export const searchDocuments = async (query, token) => {
    return apiRequest(`/documents/search?query=${encodeURIComponent(query)}`, token);
  };
  
  /**
   * Get document statistics (admin only)
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The document statistics
   */
  export const getDocumentStats = async (token) => {
    return apiRequest('/documents/stats', token);
  };