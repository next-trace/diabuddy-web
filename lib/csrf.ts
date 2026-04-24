export function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|; )db_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function csrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { 'x-csrf-token': token } : {};
}
