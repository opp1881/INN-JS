const LOCAL_STORAGE_TICKET_KEY = 'INN_user_ticket';
const LOCAL_STORAGE_SECRET_KEY = 'INN_user_secret';

const isLocalStorageAvailable = () =>
  typeof window.localStorage !== 'undefined';

export const getTicketFromLocalStorage = () =>
  isLocalStorageAvailable()
    ? window.localStorage.getItem(LOCAL_STORAGE_TICKET_KEY)
    : null;

export const setTicketInLocalStorage = ticket => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(LOCAL_STORAGE_TICKET_KEY, ticket);
  }
};

export const getSecretFromLocalStorage = () =>
  isLocalStorageAvailable()
    ? window.localStorage.getItem(LOCAL_STORAGE_SECRET_KEY)
    : null;

export const setSecretInLocalStorage = secret => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(LOCAL_STORAGE_SECRET_KEY, secret);
  }
};

export const isTicketInLocalStorage = () =>
  isLocalStorageAvailable()
    ? window.localStorage.getItem(LOCAL_STORAGE_TICKET_KEY) || false
    : false;

export const clearTicketFromLocalStorage = () => {
  if (isLocalStorageAvailable()) {
    window.localStorage.removeItem(LOCAL_STORAGE_TICKET_KEY);
  }
};
