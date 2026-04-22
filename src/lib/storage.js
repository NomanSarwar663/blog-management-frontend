const AUTH_STORAGE_KEY = "blog-management-auth";

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const setStoredAuth = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const AUTH_UPDATED_EVENT = "auth:updated";
export const AUTH_LOGOUT_EVENT = "auth:logout";
