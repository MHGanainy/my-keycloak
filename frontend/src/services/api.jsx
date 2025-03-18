/**
 * API service for making requests to the backend with authentication
 */

/**
 * Makes a request to the backend API with a bearer token
 * @param {string} endpoint - The API endpoint to call
 * @param {string} token - The Keycloak token for authentication
 * @returns {Promise} - The API response
 */
export const fetchFromApi = async (endpoint, token) => {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
  
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
   * Fetch list of items from the API.
   * @param {string} token - The Keycloak token
   * @returns {Promise} - The items data
   */
  export const fetchItems = async (token) => {
    return fetchFromApi('/items', token);
  };
  