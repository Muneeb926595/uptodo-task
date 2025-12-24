export const generateId = () => {
  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
};
