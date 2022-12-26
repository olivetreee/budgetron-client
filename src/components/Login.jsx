import React, { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from './AuthProvider';

export const Login = () => {
  const { token, onLogin } = useAuth();

	const initGoogleAuth = () => {
		setTimeout(() => {
			if (window.google && window.google.accounts) {
				window.google.accounts.id.initialize({
					client_id: "936627018741-6r1qaqq4309ojfnkf98glp4g6t98u44d.apps.googleusercontent.com",
					callback: (data) => onLogin(data)
				});
				window.google.accounts.id.prompt();
				return;
			}
			console.log("Google auth script not ready yet. Trying again in a bit...");
			this.initGoogleAuth();
		}, 250)
	}

  useEffect(() => {
    if (!token) {
      initGoogleAuth();
    }
  })

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login">
      Welcome! Please log in first...
    </div>
  )
}
