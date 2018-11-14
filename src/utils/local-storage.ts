const LOCAL_STORAGE_TICKET_KEY: string = 'INN_user_ticket';
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

const clearValue = (key: string): void => {
  if (isLocalStorageAvailable()) {
    window.localStorage.removeItem(key);
  }
};

export const getTicketFromLocalStorage = (): string | null =>
  getValue(LOCAL_STORAGE_TICKET_KEY);

export const setTicketInLocalStorage = (ticket: string): void => {
  updateValue(LOCAL_STORAGE_TICKET_KEY, ticket);
};

export const getSecretFromLocalStorage = (): string | null =>
  getValue(LOCAL_STORAGE_SECRET_KEY);

export const setSecretInLocalStorage = (secret: string): void => {
  updateValue(LOCAL_STORAGE_SECRET_KEY, secret);
};

export const isTicketInLocalStorage = (): boolean =>
  !!getValue(LOCAL_STORAGE_TICKET_KEY) || false;

export const clearTicketFromLocalStorage = (): void => {
  clearValue(LOCAL_STORAGE_TICKET_KEY);
};

export const setTokenInLocalStorage = (token: string): void => {
  updateValue(TOKEN_KEY, token);
};

export const getTokenFromLocalStorage = (): string | null =>
  getValue(TOKEN_KEY);
