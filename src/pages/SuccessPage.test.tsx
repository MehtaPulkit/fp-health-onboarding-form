import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { AUTH_TOKEN_STORAGE_KEY } from "../features/onboarding/constants/storage";
import { DashboardPage } from "./DashboardPage";
import { SuccessPage } from "./SuccessPage";

const getCurrentUserMock = vi.fn();
const logoutMock = vi.fn();

vi.mock("../lib/auth", () => ({
  getCurrentUser: () => getCurrentUserMock(),
  isAuthenticated: () => Boolean(window.localStorage.getItem("auth_token")),
  logout: () => logoutMock(),
}));

function renderSuccessRoute() {
  const router = createMemoryRouter(
    [
      { path: "/login", element: <h1>Login</h1> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/success", element: <SuccessPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
        ],
      },
    ],
    {
      initialEntries: [
        {
          pathname: "/success",
          state: {
            email: "sam@example.com",
            membershipId: "elite",
            submittedAt: "2026-05-12T00:00:00.000Z",
          },
        },
      ],
    },
  );

  return render(<RouterProvider router={router} />);
}

describe("SuccessPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "mock-token");
    getCurrentUserMock.mockReturnValue({
      id: "user-123",
      email: "sam@example.com",
      name: "Sam Rivera",
      membershipType: "basic",
      memberSince: "2026-05-11",
    });
    logoutMock.mockReset();
  });

  it("passes selected membership details to the dashboard", async () => {
    const user = userEvent.setup();
    renderSuccessRoute();

    expect(screen.getByText("Elite Membership")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /go to dashboard/i }));

    expect(
      await screen.findByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Elite Membership")).toBeInTheDocument();
    expect(screen.getByText(/Unlimited group fitness classes/i)).toBeInTheDocument();
  });
});
