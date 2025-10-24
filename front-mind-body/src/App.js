import { useContext } from "react";
import Register from "../src/Register/Register.tsx";
import Login from "./Login/Login.tsx";
import Dashboard from "./Dashboard/Dashboard.tsx";
import Header from "./Header/Header.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.tsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  const authContext = useContext(AuthContext);

  if (authContext?.isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#18191C',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;