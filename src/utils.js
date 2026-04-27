/**
 * Utility to generate unique IDs compatible with all contexts
 * (Including insecure HTTP contexts on mobile where crypto.randomUUID is not available)
 */
export function generateId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (e) {
    // Fallback if crypto exists but randomUUID doesn't or throws
  }
  
  // Fallback: RFC4122 v4 compliant UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
