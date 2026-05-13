import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SuccessPage } from "../../../pages/SuccessPage";
import { OnboardingFlow } from "./OnboardingFlow";

const loginMock = vi.fn();
const getCurrentUserMock = vi.fn();

vi.mock("../../../lib/auth", () => ({
  login: (...args: unknown[]) => loginMock(...args),
  getCurrentUser: () => getCurrentUserMock(),
  isAuthenticated: () => Boolean(window.localStorage.getItem("auth_token")),
  logout: vi.fn(),
}));

function renderOnboarding() {
  const router = createMemoryRouter(
    [
      { path: "/", element: <OnboardingFlow /> },
      { path: "/success", element: <SuccessPage /> },
    ],
    { initialEntries: ["/"] },
  );

  return render(<RouterProvider router={router} />);
}

async function completePersonalStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/first name/i), "Sam");
  await user.type(screen.getByLabelText(/last name/i), "Rivera");
  await user.type(screen.getByLabelText(/date of birth/i), "1994-02-10");
  await user.type(screen.getByLabelText("Mobile number"), "0412345678");
  await user.type(screen.getByLabelText(/address line 1/i), "10 Market Street");
  await user.type(screen.getByLabelText(/suburb or city/i), "Sydney");
  await user.type(screen.getByLabelText(/^state$/i), "NSW");
  await user.type(screen.getByLabelText(/postcode/i), "2000");
  await user.type(
    screen.getByLabelText(/emergency contact name/i),
    "Jordan Rivera",
  );
  await user.type(screen.getByLabelText(/relationship/i), "Partner");
  await user.type(
    screen.getByLabelText(/emergency mobile number/i),
    "0412111222",
  );
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await screen.findByLabelText(/select premium membership/i);
}

async function choosePremiumMembership(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.click(await screen.findByLabelText(/select premium membership/i));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await screen.findByLabelText(/fitness goals/i);
}

async function completeHealthStepWithoutMedicalClearance(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.click(await screen.findByLabelText(/none of the above/i));
  await user.type(
    screen.getByLabelText(/fitness goals/i),
    "Improve energy and build a consistent training routine.",
  );
  await user.click(screen.getByLabelText(/gym participation waiver/i));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await screen.findByLabelText(/^email$/i);
}

describe("OnboardingFlow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
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
  });

  it("blocks navigation from personal information until required fields are valid", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    expect(
      screen.getByRole("heading", { name: /personal information/i }),
    ).toBeInTheDocument();

    await completePersonalStep(user);

    expect(
      screen.getByRole("heading", { name: "Membership", level: 1 }),
    ).toBeInTheDocument();
  });

  it("selects a membership plan from the dynamic card list", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await completePersonalStep(user);

    const premiumCard = (
      await screen.findByText("Premium Membership")
    ).closest("label");
    expect(premiumCard).not.toBeNull();

    await user.click(screen.getByLabelText(/select premium membership/i));

    expect(
      within(premiumCard as HTMLElement).getByText("Selected"),
    ).toBeInTheDocument();
  });

  it("requires a health condition option before account setup", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await completePersonalStep(user);
    await choosePremiumMembership(user);
    await user.type(
      screen.getByLabelText(/fitness goals/i),
      "Build strength safely.",
    );
    await user.click(screen.getByLabelText(/gym participation waiver/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(/choose at least one health condition option/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /health information/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /account setup/i }),
    ).not.toBeInTheDocument();

    await user.click(await screen.findByLabelText(/none of the above/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByRole("heading", { name: /account setup/i }),
    ).toBeInTheDocument();
  });

  it("shows and validates medical clearance acknowledgement for flagged conditions", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await completePersonalStep(user);
    await choosePremiumMembership(user);

    await user.click(await screen.findByLabelText(/heart disease/i));

    expect(
      screen.getByText("Medical clearance may be required"),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/fitness goals/i),
      "Build strength safely.",
    );
    await user.click(screen.getByLabelText(/gym participation waiver/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(
        /acknowledge that medical clearance may be required/i,
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByLabelText(
        /medical clearance may be required before training/i,
      ),
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByRole("heading", { name: /account setup/i }),
    ).toBeInTheDocument();

    await user.type(await screen.findByLabelText(/^email$/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Strong123");
    await user.type(screen.getByLabelText(/confirm password/i), "Strong123");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByRole("heading", { name: /review/i }),
    ).toBeInTheDocument();
  });

  it("blocks review until account setup is valid", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await completePersonalStep(user);
    await choosePremiumMembership(user);
    await completeHealthStepWithoutMedicalClearance(user);

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm your password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /account setup/i }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^email$/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "weak");
    await user.type(screen.getByLabelText(/confirm password/i), "different");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /review/i }),
    ).not.toBeInTheDocument();
  });

  it("allows review edit actions to return to completed steps with state preserved", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await completePersonalStep(user);
    await choosePremiumMembership(user);
    await completeHealthStepWithoutMedicalClearance(user);
    await user.type(screen.getByLabelText(/^email$/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Strong123");
    await user.type(screen.getByLabelText(/confirm password/i), "Strong123");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByRole("heading", { name: /review/i }),
    ).toBeInTheDocument();

    const membershipSection = screen
      .getByRole("heading", { name: /^membership$/i })
      .closest("section");
    expect(membershipSection).not.toBeNull();

    await user.click(
      within(membershipSection as HTMLElement).getByRole("button", {
        name: /edit/i,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: /^membership$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("submits successfully, stores the auth token, and shows the success screen", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await completePersonalStep(user);
    await choosePremiumMembership(user);
    await user.click(await screen.findByLabelText(/none of the above/i));
    await user.type(
      screen.getByLabelText(/fitness goals/i),
      "Improve energy and build a consistent training routine.",
    );
    await user.click(screen.getByLabelText(/gym participation waiver/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.type(await screen.findByLabelText(/^email$/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Strong123");
    await user.type(screen.getByLabelText(/confirm password/i), "Strong123");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByRole("heading", { name: /review/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/start over/i)).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /submit registration/i }),
    );

    expect(
      await screen.findByRole("heading", { name: /registration submitted/i }),
    ).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledWith("sam@example.com", "Strong123");
    expect(window.localStorage.getItem("auth_token")).toBe("mock-token");
    expect(
      window.sessionStorage.getItem("fp_onboarding_progress_v1"),
    ).toBeNull();
  });
});
