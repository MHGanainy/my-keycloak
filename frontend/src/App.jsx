import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './custom.css';  // Import our custom CSS
import HomePage from './pages/HomePage';
import { KeycloakProvider } from './context/KeycloakContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './context/ErrorBoundary';
import MyAccount from './pages/MyAccount';
import SimpleItems from './pages/SimpleItems';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <KeycloakProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route 
              path="/my-account" 
              element={
                <Layout>
                  <MyAccount />
                </Layout>
              } 
            />
            <Route
              path="/simple-items"
              element={
                <Layout>
                  <SimpleItems />
                </Layout>
              }
            />
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminPage />
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