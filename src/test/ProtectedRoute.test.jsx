import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import { AuthContext } from "../context/AuthContext";

const renderRoute = (authValue) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin", "author"]}>
                <div>Secret dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<div>Auth page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe("ProtectedRoute", () => {
  it("shows a loading state while auth is being resolved", () => {
    renderRoute({
      authReady: false,
      isAuthenticated: false,
      user: null,
    });

    expect(screen.getByText("Checking your session...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to the auth page", () => {
    renderRoute({
      authReady: true,
      isAuthenticated: false,
      user: null,
    });

    expect(screen.getByText("Auth page")).toBeInTheDocument();
  });

  it("renders children for authenticated users with an allowed role", () => {
    renderRoute({
      authReady: true,
      isAuthenticated: true,
      user: {
        role: "author",
      },
    });

    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });
});
