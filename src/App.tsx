import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Products from './components/Products';
import Orders from './components/Orders';
import Login from './components/Login';
import Navbar from './components/Navbar'; // Import Navbar
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

const ProtectedRoute = ({ element, allowedRoles }: { element: JSX.Element, allowedRoles: string[] }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('ProtectedRoute token:', token);
  console.log('ProtectedRoute role:', role);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/products"
            element={<ProtectedRoute element={<Products />} allowedRoles={['ADMIN', 'USER']} />}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute element={<Orders />} allowedRoles={['ADMIN', 'USER']} />}
          />
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;