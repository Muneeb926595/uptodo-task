# Categories — TanStack Query patterns

Usage and patterns:

- Use the exported hooks from `./hooks` (e.g. `useCategories`, `useCreateCategory`).
- Centralized keys in `./keys` make invalidation easy when items change.
- For enterprise scale, move heavy filtering or cross-entity joins to a DB layer and keep hooks light.
