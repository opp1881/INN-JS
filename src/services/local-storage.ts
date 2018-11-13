const LOCAL_STORAGE_TICKET_KEY: string = 'INN_user_ticket';
const LOCAL_STORAGE_SECRET_KEY: string = 'INN_user_secret';

const isLocalStorageAvailable = (): boolean =>
  typeof window.localStorage !== 'undefined';

export const getTicketFromLocalStorage = (): string | null =>
  isLocalStorageAvailable()
    ? window.localStorage.getItem(LOCAL_STORAGE_TICKET_KEY)
    : null;

export const setTicketInLocalStorage = (ticket: string): void => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(LOCAL_STORAGE_TICKET_KEY, ticket);
  }
};

export const getSecretFromLocalStorage = (): string | null =>
  isLocalStorageAvailable()
    ? window.localStorage.getItem(LOCAL_STORAGE_SECRET_KEY)
    : null;

export const setSecretInLocalStorage = (secret: string): void => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(LOCAL_STORAGE_SECRET_KEY, secret);
  }
};

export const isTicketInLocalStorage = (): boolean =>
  isLocalStorageAvailable()
    ? !!window.localStorage.getItem(LOCAL_STORAGE_TICKET_KEY) || false
    : false;

export const clearTicketFromLocalStorage = (): void => {
  if (isLocalStorageAvailable()) {
    window.localStorage.removeItem(LOCAL_STORAGE_TICKET_KEY);
  }
};
