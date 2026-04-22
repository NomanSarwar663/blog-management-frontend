import { describe, expect, it } from "vitest";

import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../lib/storage";

describe("storage helpers", () => {
  it("stores and retrieves the auth session", () => {
    const session = {
      user: {
        id: "1",
        name: "Jane",
        role: "author",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    setStoredAuth(session);

    expect(getStoredAuth()).toEqual(session);
  });

  it("clears persisted auth data", () => {
    setStoredAuth({
      user: {
        id: "1",
      },
      accessToken: "a",
      refreshToken: "b",
    });

    clearStoredAuth();

    expect(getStoredAuth()).toBeNull();
  });
});
