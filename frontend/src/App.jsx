// frontend/src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './custom.css';  // Import our custom CSS
import HomePage from './pages/HomePage';
import { KeycloakProvider } from './context/KeycloakContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './context/ErrorBoundary';
import MyAccount from './pages/MyAccount';
import DocumentsPage from './pages/DocumentsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <KeycloakProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            
            {/* Document Management Routes */}
            <Route
              path="/documents"
              element={
                <Layout>
                  <DocumentsPage />
                </Layout>
              }
            />
            
            <Route
              path="/documents/:id"
              element={
                <Layout>
                  <DocumentsPage />
                </Layout>
              }
            />
            
            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            
            {/* Account Page */}
            <Route 
              path="/my-account" 
              element={
                <Layout>
                  <MyAccount />
                </Layout>
              } 
            />
            
            {/* Legacy/Redirect Routes */}
            <Route
              path="/simple-items"
              element={<Navigate to="/documents" replace />}
            />
            
            {/* Catch-all for any other routes */}
            <Route
              path="*"
              element={
                <Layout>
                  <div className="container py-5 text-center">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                </Layout>
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </KeycloakProvider>
  );
}

export default App;