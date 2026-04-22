import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import useAuth from "../hooks/useAuth";
import { AuthProvider } from "../context/AuthContext";
import { authApi } from "../lib/api";
import { getStoredAuth } from "../lib/storage";

const AuthHarness = () => {
  const { authReady, isAuthenticated, login, logout, user } = useAuth();

  return (
    <div>
      <p>{authReady ? "ready" : "loading"}</p>
      <p>{isAuthenticated ? `logged-in:${user?.role}` : "logged-out"}</p>
      <button
        type="button"
        onClick={() =>
          login({
            email: "admin@example.com",
            password: "password123",
          })
        }
      >
        Login
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  it("logs in and persists the session to localStorage", async () => {
    vi.spyOn(authApi, "login").mockResolvedValue({
      data: {
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
    });

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("ready")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(screen.getByText("logged-in:admin")).toBeInTheDocument());
    expect(getStoredAuth()).toEqual({
      user: {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("clears the session on logout", async () => {
    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("ready")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(screen.getByText("logged-out")).toBeInTheDocument();
    expect(getStoredAuth()).toBeNull();
  });
});
