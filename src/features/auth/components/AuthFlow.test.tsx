import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../../../pages/DashboardPage";
import { LoginPage } from "../../../pages/LoginPage";
import { OnboardingPage } from "../../../pages/OnboardingPage";
import { RedirectAuthenticatedRoute } from "./RedirectAuthenticatedRoute";

const loginMock = vi.fn();
const getCurrentUserMock = vi.fn();

vi.mock("../../../lib/auth", () => ({
  login: (...args: unknown[]) => loginMock(...args),
  isAuthenticated: () => Boolean(window.localStorage.getItem("auth_token")),
  getCurrentUser: () => getCurrentUserMock(),
  logout: vi.fn(),
}));

function renderAuthRoute(initialPath = "/login") {
  const router = createMemoryRouter(
    [
      { path: "/login", element: <LoginPage /> },
      {
        element: <RedirectAuthenticatedRoute />,
        children: [{ path: "/signup", element: <OnboardingPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(<RouterProvider router={router} />);
}

describe("auth flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    loginMock.mockReset();
    getCurrentUserMock.mockReset();
  });

  it("logs in successfully and stores the auth token", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({
      token: "mock-token",
      user: {
        id: "user-123",
        email: "sam@example.com",
        name: "Sam Rivera",
        membershipType: "premium",
        memberSince: "2026-05-11",
      },
    });
    getCurrentUserMock.mockReturnValue({
      id: "user-123",
      email: "sam@example.com",
      name: "Sam Rivera",
      membershipType: "premium",
      memberSince: "2026-05-11",
    });

    renderAuthRoute();

    await user.type(screen.getByLabelText(/^email$/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Strong123");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledWith("sam@example.com", "Strong123");
    expect(window.localStorage.getItem("auth_token")).toBe("mock-token");
  });

  it("shows a friendly error when login fails", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new Error("Invalid credentials"));

    renderAuthRoute();

    await user.type(screen.getByLabelText(/^email$/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "error");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^login$/i })).toBeInTheDocument();
  });

  it("protects the dashboard route", async () => {
    renderAuthRoute("/dashboard");

    expect(await screen.findByRole("heading", { name: /^login$/i })).toBeInTheDocument();
  });

  it("lets unauthenticated signup users navigate to login", async () => {
    const user = userEvent.setup();
    renderAuthRoute("/signup");

    expect(
      await screen.findByRole("heading", {
        name: /join the fitness revolution/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /^login$/i }));

    expect(
      await screen.findByRole("heading", { name: /^login$/i }),
    ).toBeInTheDocument();
  });

  it("redirects authenticated users away from signup", async () => {
    window.localStorage.setItem("auth_token", "mock-token");
    getCurrentUserMock.mockReturnValue({
      id: "user-123",
      email: "sam@example.com",
      name: "Sam Rivera",
      membershipType: "premium",
      memberSince: "2026-05-11",
    });

    renderAuthRoute("/signup");

    expect(
      await screen.findByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /join the fitness revolution/i }),
    ).not.toBeInTheDocument();
  });
});
