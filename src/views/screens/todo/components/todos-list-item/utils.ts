export const getPriorityColor = (
  priority: number,
  isOverdue: boolean | undefined,
  theme: any,
): string => {
  if (isOverdue) {
    return theme.colors.red;
  }

  if (priority >= 8) {
    return theme.colors.brand.DEFAULT;
  }

  if (priority >= 5) {
    return '#F4D35E'; // Yellow
  }

  return '#7DDB9B'; // Green
};
