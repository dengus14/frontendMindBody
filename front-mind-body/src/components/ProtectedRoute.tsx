import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" replace />;
  }

  const { user, loading } = authContext;

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#fff',
        backgroundColor: '#18191C'
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
