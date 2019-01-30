import { ICrmData } from '../types';

const SESSION_STORAGE_KEY = 'crmDataForUnregisteredUser';

export const isCrmDataInSessionStorage = (): boolean =>
  !!sessionStorage.getItem(SESSION_STORAGE_KEY);

export const clearCrmDataInSessionStorage = (): void => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

export const getCrmDataFromSessionStorage = (): ICrmData | null => {
  const crmDataStringFromSessionStorage = sessionStorage.getItem(
    SESSION_STORAGE_KEY
  );
  const crmDataFromSessionStorage = crmDataStringFromSessionStorage
    ? JSON.parse(crmDataStringFromSessionStorage)
    : null;
  return crmDataFromSessionStorage;
};
