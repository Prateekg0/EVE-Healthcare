import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { apiRequest } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem('eve-token')
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eve-user'));
    } catch {
      return null;
    }
  });

  // Sign In
  const signIn = useCallback(
    ({ token: nextToken, user: nextUser }) => {
      localStorage.setItem('eve-token', nextToken);
      localStorage.setItem('eve-user', JSON.stringify(nextUser));

      setToken(nextToken);
      setUser(nextUser);
    },
    []
  );

  // Sign Out
  const signOut = useCallback(() => {
    localStorage.removeItem('eve-token');
    localStorage.removeItem('eve-user');

    setToken(null);
    setUser(null);
  }, []);

  // API Request
  const request = useCallback(
    (path, options) => apiRequest(path, token, options),
    [token]
  );

  // Context Value
  const value = useMemo(
    () => ({
      token,
      user,
      signIn,
      signOut,
      request,
    }),
    [token, user, signIn, signOut, request]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Auth Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}