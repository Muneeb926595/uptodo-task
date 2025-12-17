export function isValidUrl(string: string) {
  try {
    if (string) {
      new URL(string);
      return true;
    }
  } catch (_) {
    return false;
  }
  return false;
}
