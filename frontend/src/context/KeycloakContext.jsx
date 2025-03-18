import React, { createContext, useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext(undefined);

const KeycloakProvider = ({ children }) => {
  const isRun = useRef(false);
  const tokenRefreshInterval = useRef(null);
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);

  // Initialize Keycloak
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const initKeycloak = async () => {
      console.log('Initializing Keycloak...');
      const keycloakConfig = {
        url: "http://localhost:8080/",
        realm: "myrealm",
        clientId: "web-client",
        silentCheckSsoFallback: false
      };

      const keycloakInstance = new Keycloak(keycloakConfig);

      keycloakInstance
        .init({
          onLoad: 'check-sso',
          pkceMethod: "S256",
          enableLogging: true
        })
        .then((auth) => {
          console.log('Keycloak initialized, auth status:', auth);
          setAuthenticated(auth);
          setKeycloak(keycloakInstance);
          
          if (auth && keycloakInstance.token) {
            // Parse token to get expiry time
            try {
              const tokenParts = keycloakInstance.token.split('.');
              const tokenPayload = JSON.parse(atob(tokenParts[1]));
              const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds
              setTokenExpiryTime(expiryTime);
              console.log('Token expires at:', new Date(expiryTime).toISOString());
            } catch (e) {
              console.error('Failed to parse token:', e);
            }
          }
        })
        .catch((error) => {
          console.error('Keycloak initialization failed:', error);
          setAuthenticated(false);
          setKeycloak(keycloakInstance);
        });
    };

    initKeycloak();

    // Cleanup on unmount
    return () => {
      if (tokenRefreshInterval.current) {
        console.log('Cleaning up token refresh interval');
        clearInterval(tokenRefreshInterval.current);
      }
    };
  }, []);

  // Set up token refresh in a separate effect
  useEffect(() => {
    // Only set up refresh if keycloak is initialized and user is authenticated
    if (keycloak && authenticated) {
      console.log('Setting up token refresh interval');
      
      // Clear any existing interval
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
      
      // Force an immediate token refresh to ensure we start with a fresh token
      keycloak.updateToken(30)
        .then(refreshed => {
          console.log(refreshed ? 'Token refreshed immediately' : 'Token still valid');
        })
        .catch(error => {
          console.error('Initial token refresh failed:', error);
        });
      
      // Set up regular token refresh
      tokenRefreshInterval.current = setInterval(() => {
        console.log('Token refresh interval triggered at:', new Date().toISOString());
        console.log('Current token valid:', !!keycloak.token);
        
        // Get current time and log info about token expiry
        if (tokenExpiryTime) {
          const timeUntilExpiry = tokenExpiryTime - Date.now();
          console.log(`Time until token expiry: ${timeUntilExpiry / 1000} seconds`);
        }
        
        keycloak.updateToken(30)
          .then(refreshed => {
            if (refreshed) {
              console.log('Token refreshed successfully at:', new Date().toISOString());
              
              // Update token expiry time
              try {
                const tokenParts = keycloak.token.split('.');
                const tokenPayload = JSON.parse(atob(tokenParts[1]));
                const expiryTime = tokenPayload.exp * 1000;
                setTokenExpiryTime(expiryTime);
                console.log('New token expires at:', new Date(expiryTime).toISOString());
              } catch (e) {
                console.error('Failed to parse refreshed token:', e);
              }
            } else {
              console.log('Token is still valid, no refresh needed');
            }
          })
          .catch(error => {
            console.error('Failed to refresh token:', error);
            // Don't log out immediately, maybe retry or show a warning
            keycloak.logout();
          });
      }, 10000); // 10 seconds
      
      return () => {
        console.log('Cleaning up token refresh interval (authenticated state changed)');
        clearInterval(tokenRefreshInterval.current);
      };
    }
  }, [keycloak, authenticated, tokenExpiryTime]);

  // Provide a way to manually refresh the token if needed
  const refreshToken = async () => {
    if (keycloak && authenticated) {
      console.log('Manually refreshing token');
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          console.log('Token manually refreshed successfully');
          return true;
        } else {
          console.log('Manual refresh not needed, token still valid');
          return false;
        }
      } catch (error) {
        console.error('Manual token refresh failed:', error);
        return false;
      }
    }
    return false;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!keycloak || !authenticated) {
      return false;
    }
    
    // Check if user has the specified role (checking both realm and resource roles)
    return (
      keycloak.hasRealmRole(role) || 
      keycloak.hasResourceRole(role)
    );
  };

  // Get user roles
  const getUserRoles = () => {
    if (!keycloak || !authenticated) {
      return [];
    }
    
    try {
      // Get the token payload to extract roles
      const tokenParts = keycloak.token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      
      // Extract roles from token - this depends on your Keycloak token structure
      // Common structures include realm_access.roles and resource_access.<client-id>.roles
      const roles = [];
      
      // Add realm roles if they exist
      if (tokenPayload.realm_access && tokenPayload.realm_access.roles) {
        roles.push(...tokenPayload.realm_access.roles);
      }
      
      // Add resource roles if they exist - using client ID from config
      if (tokenPayload.resource_access && tokenPayload.resource_access['web-client']) {
        roles.push(...tokenPayload.resource_access['web-client'].roles);
      }
      
      return roles;
    } catch (e) {
      console.error('Failed to parse roles from token:', e);
      return [];
    }
  };

  const contextValue = {
    keycloak,
    authenticated,
    refreshToken, // Expose the manual refresh function
    tokenExpiryTime,
    hasRole,      // Add role checking function
    getUserRoles  // Add function to get all user roles
  };

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};

export { KeycloakProvider, KeycloakContext };