# Auth module 🔐

**Purpose**
Authentication and session management: user login, token storage, refresh, and basic account/profile flows.

**Responsibilities**

- Provide sign-in / sign-up flows and validation
- Securely persist tokens (use secure storage / Keychain / Encrypted MMKV)
- Expose auth state (current user, isAuthenticated) via a store or hook
- Handle token refresh and sign-out

**Key files**

- `api/` — auth API calls
- `store/` — auth slice / hooks (e.g., `useAuth`) and selectors
- `view/screens/` — login / welcome screens

**Tests**

- Unit tests for reducers/hooks and API error handling

**Notes**

- Keep auth logic isolated so other modules can subscribe to auth state without importing platform details.
