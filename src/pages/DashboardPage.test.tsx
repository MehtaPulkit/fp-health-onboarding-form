import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_TOKEN_STORAGE_KEY } from "../features/onboarding/constants/storage";
import { AuthLandingPage } from "./AuthLandingPage";
import { DashboardPage } from "./DashboardPage";

const getCurrentUserMock = vi.fn();
const logoutMock = vi.fn();

vi.mock("../lib/auth", () => ({
  getCurrentUser: () => getCurrentUserMock(),
  isAuthenticated: () => Boolean(window.localStorage.getItem("auth_token")),
  logout: () => logoutMock(),
}));

function renderDashboardRoute() {
  const router = createMemoryRouter(
    [
      { path: "/", element: <AuthLandingPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
    ],
    { initialEntries: ["/dashboard"] },
  );

  return render(<RouterProvider router={router} />);
}

describe("DashboardPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "mock-token");
    getCurrentUserMock.mockReturnValue({
      id: "user-123",
      email: "sam@example.com",
      name: "Sam Rivera",
      membershipType: "premium",
      memberSince: "2026-05-11",
    });
    logoutMock.mockReset();
  });

  it("shows membership details from the authenticated user fallback", () => {
    renderDashboardRoute();

    expect(screen.getByText("Premium Membership")).toBeInTheDocument();
    expect(screen.getByText("Access: 24/7")).toBeInTheDocument();
    expect(screen.getByText("Group fitness classes")).toBeInTheDocument();
  });

  it("logs out and returns to the public landing page", async () => {
    const user = userEvent.setup();
    renderDashboardRoute();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalled();
    expect(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(
      await screen.findByRole("heading", {
        name: /get started with your membership/i,
      }),
    ).toBeInTheDocument();
  });
});
