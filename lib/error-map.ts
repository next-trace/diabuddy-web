/**
 * Maps a thrown error or BE response string to a friendly UI message.
 * Raw backend strings ("Authorization header is required", JWT internals, SQL
 * errors, etc.) MUST NOT leak into the UI verbatim — keep them in the console.
 */
export function mapErrorToFriendly(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? '');
  if (typeof console !== 'undefined') {
    // Preserve detail for engineers; never render raw to users.
    console.warn('[nexdoz] backend error:', raw);
  }
  if (!raw) return 'Something went wrong. Please try again.';
  const low = raw.toLowerCase();

  if (low.includes('authorization') || low.includes('unauthorized') || low.includes('401')) {
    return 'Your session has ended. Please sign in again.';
  }
  if (low.includes('forbidden') || low.includes('403')) {
    return 'You do not have access to this resource.';
  }
  if (low.includes('not found') || low.includes('404')) {
    return 'We couldn’t find that information.';
  }
  if (low.includes('timeout') || low.includes('network') || low.includes('failed to fetch')) {
    return 'Network problem. Check your connection and try again.';
  }
  if (low.includes('500') || low.includes('internal server')) {
    return 'The service had a hiccup. Please try again in a moment.';
  }
  return 'Something went wrong. Please try again.';
}
