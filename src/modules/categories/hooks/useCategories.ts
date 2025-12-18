// Deprecated: use RTK Query hooks from `categoriesApi` instead (e.g. useGetCategoriesQuery, useCreateCategoryMutation)
// Keeping this file to avoid accidental imports; it will throw at runtime to signal replacement.
const throwDeprecated = () => {
  throw new Error(
    'useCategories (react-query) is deprecated. Use RTK Query hooks exported from src/modules/categories/store/categoriesApi.tsx',
  );
};

export const useCategories = throwDeprecated as any;
export const useCreateCategory = throwDeprecated as any;

export default useCategories;
