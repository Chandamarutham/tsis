// src/auth/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from 'react';
import { Hub } from 'aws-amplify/utils';
import { fetchAuthSession } from 'aws-amplify/auth';
import { type AuthContextType, AuthContext } from './useAuth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthContextType>({ 
    user: null, 
    isAuthenticated: false,
    loading: true 
});

  useEffect(() => {
    fetchAuthSession()
      .then(session => {
        const isAuth: boolean = !!session.tokens;
        setState({ user: session, isAuthenticated: isAuth, loading: false });
      })
      .catch(() => setState({ user: null, isAuthenticated: false, loading: false }));

    const removeListener = Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signedIn' || event === 'tokenRefresh') {
        fetchAuthSession().then(session => {
        const isAuth: boolean = !!session.tokens;
        setState({ user: session, isAuthenticated: isAuth, loading: false });
      });
      } else if (event === 'signedOut') {
        setState({ user: null, isAuthenticated: false, loading: false });
      }
    });
    return () => removeListener();
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};
