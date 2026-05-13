# Fitness Passport Health Onboarding

A production-quality React onboarding application for gym membership registration, featuring authentication, protected member routes, a privacy-conscious multi-step onboarding flow, dynamic membership selection, conditional health declaration logic, responsive and accessible UI patterns, session-based draft recovery for non-sensitive data, and comprehensive behavior-focused test coverage.

## Features

- Public auth landing page with Login and Create Account paths.
- Login flow powered by the provided mock `auth.ts` utilities.
- Protected `/dashboard` and `/success` routes.
- Authenticated users are redirected away from `/signup` to `/dashboard`.
- Multi-step signup onboarding:
  - Personal information
  - Address information
  - Emergency contact information
  - Membership selection
  - Health information
  - Account setup
  - Review and submit
- Dynamic membership plans from `membership-tiers.json`.
- Dynamic health conditions from `health-conditions.json`.
- Health condition categories are ordered for better UX, with musculoskeletal, other, and none shown last.
- "None of the above" is mutually exclusive with other health conditions.
- Conditional medical clearance warning and acknowledgement when required by selected conditions.
- Australian mobile number validation for member and emergency contact phone fields.
- Strong password validation with confirm password matching.
- Accessible password visibility toggles.
- Review step with edit actions back to previous steps.
- Async submission simulation using `login(email, password)`.
- Auth token storage after login/submission.
- Success page after onboarding submission.
- Success-to-dashboard handoff of selected membership details.
- Dashboard showing current user details, selected membership summary, plan features, and logout.
- Session-based draft recovery for safe, non-sensitive onboarding fields.
- Refresh/navigation warning once onboarding has started.
- `react-error-boundary` app boundary with a friendly fallback for unexpected render failures.
- Mobile-friendly stepper that shows the current stage and reveals all stages with a menu button.
- Logo, favicon, and SEO meta description configured in the document shell.
- Route-level and step-level lazy loading for better initial load performance.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod
- React Router
- react-error-boundary
- Vitest
- React Testing Library
- clsx
- lucide-react

## Getting Started

```bash
npm install
npm run dev
```

Vite will print the local development URL, usually `http://localhost:5173`.

## Scripts

```bash
npm run dev        # Start the Vite dev server
npm run build      # Type-check and create a production build
npm run preview    # Preview the production build
npm test           # Run the Vitest test suite
npm run test:watch # Run tests in watch mode
npm run lint       # Run TypeScript checks with no emit
```

## Routes

- `/` - Public auth landing page.
- `/login` - Existing member login.
- `/signup` - Account creation onboarding flow. Authenticated users are redirected to `/dashboard`.
- `/success` - Protected onboarding submission success page.
- `/dashboard` - Protected member dashboard.

## Onboarding Flow

The signup flow uses one top-level React Hook Form instance and shares form state through `FormProvider`.

1. **Personal Information**
   - First name
   - Last name
   - Date of birth
   - Australian mobile number
   - Address fields
   - Emergency contact fields

2. **Membership Selection**
   - Plans are rendered dynamically from JSON.
   - Cards are keyboard accessible and selectable.
   - Popular plan is highlighted.

3. **Health Information**
   - Conditions are rendered dynamically and grouped by category.
   - Health condition selection is required.
   - Search helps narrow the list.
   - Medical clearance acknowledgement is required only when selected conditions require it.
   - Waiver acknowledgement is required.

4. **Account Setup**
   - Email
   - Password
   - Confirm password
   - Password visibility toggles

5. **Review & Submit**
   - Displays personal, address, emergency contact, membership, health, and account email details.
   - Password is never displayed.
   - Edit actions preserve form state and return users to the relevant step.

## Authentication

The app integrates the provided mock auth utilities through `src/lib/auth.ts`:

- `login(email, password)`
- `logout()`
- `isAuthenticated()`
- `getCurrentUser()`

Login and onboarding submission both call `login`. If the password is `"error"`, the mock utility throws and the UI shows a friendly error state.

After successful login, users are routed to `/dashboard`. After successful onboarding submission, users are routed to `/success`; from there, the dashboard button carries the selected membership details into `/dashboard`.

## Persistence and Privacy

Draft recovery intentionally uses `sessionStorage` rather than `localStorage` to keep persisted onboarding data scoped to the active browser session while avoiding long-lived client-side storage of personal information.

Persisted:

- Current safe step
- Personal name fields
- Phone
- Address fields
- Emergency contact fields
- Membership selection

Not persisted:

- Account setup data (like: password, confirm password)
- Any medical or health-related data

Sensitive fields remain in memory only until submission. If the user refreshes after entering sensitive details, they may need to re-enter them. This is an intentional privacy trade-off.

Malformed or incompatible session drafts are ignored safely rather than crashing the app.

## Architecture

```text
src/
  assets/
    images/
  components/
    layout/
    ui/
  features/
    auth/
      components/
      schemas/
    onboarding/
      components/
      constants/
      data/
      hooks/
      schemas/
      services/
      types/
      utils/
  lib/
  pages/
  routes/
  test/
```

The codebase follows a feature-based structure. Onboarding-specific validation, data access, hooks, submission, persistence, and components live together under `features/onboarding`. Auth-specific route guards and schemas live under `features/auth`. Shared UI primitives stay under `components/ui`.

## Key Engineering Decisions

**React Hook Form**

React Hook Form keeps form state predictable and performant across multiple steps. A single top-level form avoids prop drilling and avoids introducing global state for data that belongs to the form.

**Zod**

Zod centralizes validation with strong TypeScript inference. It handles required fields, age rules, Australian mobile formats, password strength, membership IDs, health condition IDs, and conditional medical acknowledgement logic.

**Feature-based architecture**

Feature ownership keeps related domain logic close together. This makes the app easier to extend with additional onboarding steps, richer membership rules, real APIs, or analytics.

**No global state library**

Zustand was not introduced because React Hook Form plus focused hooks are sufficient. The app avoids global state until there is a real cross-feature state need.

**Privacy-first draft recovery**

The app favors privacy over convenience for account and health fields. Session drafts are useful for safe fields, while sensitive data is never persisted.

**Performance**

Routes are lazy loaded with `React.lazy` and `Suspense`. Heavier onboarding steps are also split so later step code is loaded only when needed. Vite is configured to avoid inlining larger assets into the initial JavaScript bundle.

**Error boundaries**

The router outlet is wrapped with `react-error-boundary`, so unexpected route render failures show a controlled functional fallback with retry and home actions instead of leaving users on a blank screen.

## Accessibility

- Semantic HTML structure with headings, forms, labels, fieldsets, and buttons.
- Inputs use labels and `aria-invalid`.
- Error messages are rendered inline and prioritized over helper text.
- Screen-reader feedback is provided for step progress and submission state.
- Step headings receive focus after step changes.
- Membership cards support keyboard selection.
- Password visibility toggles have accessible labels.
- Mobile stepper uses an accessible disclosure button.
- Focus styles are visible and error states use error-colored focus outlines.

## Responsive Design

The UI is mobile-first and scales through Tailwind responsive utilities. The form uses single-column layouts on mobile and denser grids on larger screens. The stepper collapses on mobile to reduce vertical space, showing the current stage with a menu option to reveal all stages.

## Security & Privacy Considerations

- Passwords, health conditions, waiver state, and medical-clearance acknowledgements are never persisted in browser storage.
- Draft recovery uses `sessionStorage` only for non-sensitive onboarding fields and is cleared after successful submission.
- Stored draft data is versioned and parsed defensively to avoid crashes from malformed storage.
- Passwords are never shown on the review screen.
- Protected routes prevent unauthenticated access to member-only pages.
- Auth errors are presented generically to avoid exposing unnecessary account details.
- Unexpected route render errors are caught by `react-error-boundary` with a recovery fallback.
- In production, authentication tokens would be handled using secure, HTTP-only cookies or a backend-managed session rather than client-accessible storage.
- In production, health information would be submitted over HTTPS, validated server-side, encrypted at rest, access-controlled, and audited.

## Performance and SEO

- Route-level lazy loading for login, signup, dashboard, and success.
- Step-level lazy loading for heavier onboarding steps.
- Specific lucide icon imports only.
- Tailwind content config is scoped to app files for production CSS pruning.
- Logo includes width and height to reduce layout shift.
- Larger image assets are not inlined into the initial JS bundle.
- Favicon is configured through `public/favicon.ico`.
- Meta description is included in `index.html`.

## Testing

The test suite focuses on behavior rather than implementation details.

Covered areas:

- Login success and failure.
- Protected dashboard routing.
- Authenticated signup redirect.
- Onboarding step validation and navigation.
- Dynamic membership selection.
- Health condition requirement.
- Medical clearance acknowledgement logic.
- Password validation.
- Address and emergency contact validation.
- Australian mobile validation.
- Privacy-safe session persistence.
- Unload warning behavior.
- Successful onboarding submission.
- Success page routing and dashboard membership handoff.
- Dashboard membership fallback and logout behavior.
- Error boundary fallback behavior.

Run tests with:

```bash
npm test
```

Current suite: `33` tests across `10` test files.

## Trade-offs

- React Hook Form was used as the primary form state solution instead of introducing additional global state management libraries such as Redux or Zustand. The onboarding flow is form-centric, and RHF already provides performant, centralized state orchestration with minimal re-renders and strong integration with multi-step workflows.

- `sessionStorage` was intentionally chosen over `localStorage` for onboarding draft recovery so persisted data remains scoped to the active browser session rather than surviving indefinitely across sessions. This provides a better balance between usability and privacy for partially completed onboarding flows.

- Zod was chosen for validation to keep business rules, conditional logic, and TypeScript inference centralized in a single schema layer. This adds some upfront schema verbosity, but improves maintainability, type safety, and consistency across the onboarding flow.

- The mock auth utility is used directly for the challenge. In a production application, this would be abstracted behind an API client with server-side validation, refresh token handling, telemetry, retry behavior, and secure session management.

- Session-based draft recovery intentionally excludes health and account setup data. This can require users to re-enter sensitive information after refresh, but avoids persisting medical or credential data in browser storage.

- The dashboard is intentionally lightweight. It demonstrates protected routing, authenticated user flows, and membership handoff behavior without expanding into a broader member-management product surface.

- UI components are implemented as lightweight reusable primitives rather than introducing a large external design system library. This keeps the bundle smaller, maintains styling consistency, and demonstrates composable component architecture without unnecessary abstraction overhead.

## What I Would Improve With More Time

- Add Playwright end-to-end coverage for critical user journeys such as protected route access, onboarding recovery flows, keyboard navigation, accessibility assertions, and authenticated dashboard behavior.

- Introduce backend-backed draft persistence with explicit user consent, encrypted transport/storage, and server-side ownership validation so onboarding progress can safely continue across devices and sessions without exposing sensitive information in browser storage.

- Expand observability and operational monitoring with analytics and telemetry for validation friction, abandoned onboarding steps, submission failures, and runtime errors to better understand user behavior and improve conversion rates.

- Replace the mock authentication flow with real account creation and session management APIs, including secure HTTP-only cookie handling, refresh token rotation, CSRF protection, and centralized API error handling.

- Add more production-oriented dashboard states such as membership activation progress, onboarding review/pending verification states, facility recommendations, and actionable next steps after registration.

- Introduce API contract testing and MSW-backed integration tests to validate frontend behavior against realistic backend responses without relying solely on mocked utility functions.

- Add stronger resilience patterns such as retry handling, request cancellation, offline-aware form recovery, and centralized error reporting integrations (e.g. Datadog).

- Further evolve the reusable UI primitives into a more complete internal design system with documented component contracts, visual regression testing, and accessibility auditing.

- Add internationalization support and configurable validation/content rules to support expansion into multiple regions and membership programs.

- If the onboarding flow became a public acquisition surface, introduce server-rendered metadata, structured SEO content, and performance-focused optimizations such as route prefetching and image optimization.
