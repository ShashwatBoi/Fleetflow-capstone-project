export function extractError(err: any, fallback = 'Something went wrong'): string {
  const e = err?.error;
  if (!e) return err?.message || fallback;
  if (typeof e === 'string') return e;
  if (typeof e === 'object') {
    if (e.message) return e.message;
    if (e.error) return e.error;
    const firstVal = Object.values(e)[0];
    if (typeof firstVal === 'string') return firstVal;
  }
  return fallback;
}
