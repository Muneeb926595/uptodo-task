# Auth — React Query patterns

This folder contains TanStack Query hooks for the auth module.

Guidelines:

- Use `useLogin()`, `useRefreshToken()` and `useLogout()` hooks exported from `hooks.ts`.
- Hooks persist tokens via the repository (`authRepository`) and update both React Query cache and the Redux `auth` slice on success.
- Keep server-side logic inside the repository layer. Hooks should orchestrate side-effects (cache updates, dispatch actions, navigation).
- Error handling should be centralized (toast / error boundary) — hooks may surface errors through the mutation status (`isError`, `error`).

Migration notes:

- `src/modules/auth/store/authApi.tsx` (RTK Query) is kept for backwards compatibility; prefer the new hooks going forward.
