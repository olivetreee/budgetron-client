import { useState, createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { decodeJwt } from "jose";

const AuthContext = createContext(null);

const expiresIn = 24 * 60 * 60;

export const AuthProvider = ({ children }) => {
  const [sub, setSub] = useState(localStorage.getItem('profile'));

  const handleLogin = async (data) => {
		const decodedToken = decodeJwt(data.credential);

		// Set profile sub in localStorage
		localStorage.setItem('profile', `google-oauth2|${decodedToken.sub}`);
		// Set isLoggedIn flag in localStorage
		localStorage.setItem('isLoggedIn', 'true');

		// Set the time that the access token will expire at
		const expiresAt = (expiresIn * 1000) + new Date().getTime();
		localStorage.setItem('expiresAt', expiresAt);

    setSub(decodedToken);
  };

  const handleLogout = () => {
    setSub(null);
  };

  const value = {
    sub,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProtectedRoute = ({ children }) => {
  const { sub } = useAuth();

  if (!sub) {
    return <Navigate to="/login" replace />;
  }

  return children;
};