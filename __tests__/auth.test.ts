import {
  saveSession,
  getToken,
  getName,
  clearSession,
  isAuthenticated,
} from '@/lib/auth';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => {
      store[key] = val;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => localStorageMock.clear());

describe('auth utilities', () => {
  it('saves and retrieves session', () => {
    saveSession('tok123', 'Carlos Sura');
    expect(getToken()).toBe('tok123');
    expect(getName()).toBe('Carlos Sura');
  });

  it('isAuthenticated returns true when token exists', () => {
    saveSession('tok', 'User');
    expect(isAuthenticated()).toBe(true);
  });

  it('isAuthenticated returns false when no token', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('clearSession removes token and name', () => {
    saveSession('tok', 'User');
    clearSession();
    expect(getToken()).toBeNull();
    expect(getName()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
