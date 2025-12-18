# Todos — TanStack Query patterns

Usage and patterns:

- Use the exported hooks from `./hooks` (e.g. `useTodos`, `useCreateTodo`, `useUpdateTodo`).
- Use centralized keys from `./keys` for efficient invalidation and selective refetching.
- Keep repository logic inside `src/modules/todo/repository` — hooks orchestrate cache updates and side-effects.
- For large datasets, prefer pagination/infinite queries and move heavy queries to SQLite-backed repositories.

Scalability notes:

- Keys are designed to allow targeting lists and per-item caches. Add pagination keys if you implement server sync.
- Use `cacheHelpers.ts` utilities (`upsertQueryData`, `removeQueryData`) when you need to perform non-trivial optimistic updates.
