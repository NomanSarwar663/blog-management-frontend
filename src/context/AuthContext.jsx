import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { authApi } from "../lib/api";
import {
  AUTH_LOGOUT_EVENT,
  AUTH_UPDATED_EVENT,
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "../lib/storage";

export const AuthContext = createContext(null);

const normalizeSession = (data) => ({
  user: data.user,
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredAuth());
  const [authReady, setAuthReady] = useState(false);

  const updateSession = useCallback((nextSession) => {
    setSession(nextSession);

    if (nextSession) {
      setStoredAuth(nextSession);
      return;
    }

    clearStoredAuth();
  }, []);

  useEffect(() => {
    const handleAuthUpdated = (event) => {
      setSession(event.detail);
    };

    const handleLogout = () => {
      setSession(null);
    };

    window.addEventListener(AUTH_UPDATED_EVENT, handleAuthUpdated);
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    setAuthReady(true);

    return () => {
      window.removeEventListener(AUTH_UPDATED_EVENT, handleAuthUpdated);
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    };
  }, []);

  const login = useCallback(
    async (payload) => {
      const { data } = await authApi.login(payload);
      const nextSession = normalizeSession(data);
      updateSession(nextSession);
      return data;
    },
    [updateSession]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await authApi.register(payload);
      const nextSession = normalizeSession(data);
      updateSession(nextSession);
      return data;
    },
    [updateSession]
  );

  const logout = useCallback(() => {
    updateSession(null);
  }, [updateSession]);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      accessToken: session?.accessToken || null,
      refreshToken: session?.refreshToken || null,
      isAuthenticated: Boolean(session?.accessToken),
      isAdmin: session?.user?.role === "admin",
      isAuthor: session?.user?.role === "author",
      authReady,
      login,
      register,
      logout,
      updateSession,
    }),
    [authReady, login, logout, register, session, updateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
