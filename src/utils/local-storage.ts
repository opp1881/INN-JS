const LOCAL_STORAGE_SECRET_KEY: string = 'INN_user_secret';
const TOKEN_KEY: string = 'token';

const isLocalStorageAvailable = (): boolean =>
  typeof window.localStorage !== 'undefined';

const updateValue = (key: string, value: string): void => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(key, value);
  }
};

const getValue = (key: string): string | null =>
  isLocalStorageAvailable() ? window.localStorage.getItem(key) : null;

export const getSecretFromLocalStorage = (): string | null =>
  getValue(LOCAL_STORAGE_SECRET_KEY);

export const setSecretInLocalStorage = (secret: string): void => {
  updateValue(LOCAL_STORAGE_SECRET_KEY, secret);
};

export const setTokenInLocalStorage = (token: string): void => {
  updateValue(TOKEN_KEY, token);
};

export const getTokenFromLocalStorage = (): string | null =>
  getValue(TOKEN_KEY);

export const isTokenInLocalStorage = (): boolean =>
  !!getValue(TOKEN_KEY) || false;

export const clearTokenFromLocalStorage = (): void => {
  if (isLocalStorageAvailable()) {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};
