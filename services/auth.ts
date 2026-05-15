const TOKEN_KEY = 'surabank_token';
const NAME_KEY = 'surabank_name';

function storage(): Storage {
  if (typeof window === 'undefined')
    return { getItem: () => null } as unknown as Storage;
  return localStorage.getItem(TOKEN_KEY) !== null
    ? localStorage
    : sessionStorage;
}

export function saveSession(token: string, name: string, remember: boolean) {
  if (typeof window === 'undefined') return;
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(NAME_KEY, name);
}

export function getToken(): string | null {
  return storage().getItem(TOKEN_KEY);
}

export function getName(): string | null {
  return storage().getItem(NAME_KEY);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
  sessionStorage.removeItem(NAME_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
