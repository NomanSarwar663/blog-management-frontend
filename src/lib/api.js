import axios from "axios";

import {
  AUTH_LOGOUT_EVENT,
  AUTH_UPDATED_EVENT,
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "./storage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const dispatchAuthUpdated = (session) => {
  window.dispatchEvent(new CustomEvent(AUTH_UPDATED_EVENT, { detail: session }));
};

const dispatchLogout = () => {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const session = getStoredAuth();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/register") ||
      originalRequest?.url?.includes("/api/auth/refresh");

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isAuthRoute
    ) {
      return Promise.reject(error);
    }

    const session = getStoredAuth();

    if (!session?.refreshToken) {
      clearStoredAuth();
      dispatchLogout();
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/api/auth/refresh`, {
            refreshToken: session.refreshToken,
          })
          .then(({ data }) => {
            const nextSession = {
              user: data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };

            setStoredAuth(nextSession);
            dispatchAuthUpdated(nextSession);

            return nextSession;
          })
          .catch((refreshError) => {
            clearStoredAuth();
            dispatchLogout();
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const nextSession = await refreshPromise;
      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${nextSession.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export const authApi = {
  login: (payload) => api.post("/api/auth/login", payload),
  register: (payload) => api.post("/api/auth/register", payload),
  refresh: (payload) => api.post("/api/auth/refresh", payload),
};

export const postApi = {
  getPublicPosts: (params) => api.get("/api/posts", { params }),
  getMyPosts: (params) => api.get("/api/posts/my", { params }),
  getPostById: (id) => api.get(`/api/posts/${id}`),
  createPost: (payload) => api.post("/api/posts", payload),
  updatePost: (id, payload) => api.put(`/api/posts/${id}`, payload),
  updateStatus: (id, payload) => api.patch(`/api/posts/${id}/status`, payload),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  getComments: (id) => api.get(`/api/posts/${id}/comments`),
  addComment: (id, payload) => api.post(`/api/posts/${id}/comments`, payload),
};

export const statsApi = {
  getPostsStats: () => api.get("/api/stats/posts"),
};
