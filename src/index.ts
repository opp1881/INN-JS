import 'whatwg-fetch';

import { initConfig, getProfileLink } from './services/config';
import {
  getContactInfo as getContactInfoFromCrmData,
  getDeliveryInfo as getDeliveryInfoFromCrmData
} from './services/crm-data';
import {
  isTokenInLocalStorage,
  getTokenFromLocalStorage,
  setSecretInLocalStorage,
  setTokenInLocalStorage,
  clearTokenFromLocalStorage
} from './utils/local-storage';
import { fetchCrmData, exchangeForToken } from './services/request';
import {
  clearCrmDataInSessionStorage,
  isCrmDataInSessionStorage,
  getCrmDataFromSessionStorage
} from './utils/session-storage';
import login from './services/popup';
import { addButtonTo } from './components/Button';
import parseJWT from './utils/jwt';
import {
  ICrmDataResponse,
  IContactInfo,
  ICrmData,
  IDecodedJwt,
  IButtonConfiguration
} from './types';
import { ILoginOptions } from './types/login-options';

/* tslint:disable */
function noop(data?) {}
/* tslint:enable */

export const getCrmData = async (): Promise<ICrmDataResponse> => {
  const token = getTokenFromLocalStorage();
  const crmDataFromSessionStorage = getCrmDataFromSessionStorage();
  if (token && token !== 'undefined') {
    const decodedJwt = parseJWT(token);
    if (decodedJwt) {
      return fetchCrmData(decodedJwt.jti);
    }
    throw new Error('Could not fetch crm data due to invalid token');
  } else if (crmDataFromSessionStorage !== null) {
    return crmDataFromSessionStorage;
  } else {
    throw new Error('Could not fetch crm data because of missing token');
  }
};

/**
 * authenticate
 * Authenticates the user and returns the token as a string
 * If the user is not authenticated, an empty string is returned.
 * In the case that the user does not wnat to register, this allows the app to then fetch CRM Data from session storage.
 */
export const authenticate = async (loginOptions: ILoginOptions): Promise<string> => {
  if (isTokenInLocalStorage()) {
    return getTokenFromLocalStorage() as string;
  }
  if (isCrmDataInSessionStorage()) {
    clearCrmDataInSessionStorage(); // In case the same window has been used before
  }

  try {
    const { appSecret, ssoLoginUUID } = await login(
      loginOptions.withUserCheckout
    );
    const token = await exchangeForToken(appSecret, ssoLoginUUID);

    setTokenInLocalStorage(token);
    setSecretInLocalStorage(appSecret);
    return token;
  } catch (err) {
    throw new Error(`Could not authenticate: ${err}`);
  }
};

export const init = (options): void => {
  initConfig(options);
};

export const getContactInfo = async (): Promise<IContactInfo | null> =>
  isTokenInLocalStorage() || isCrmDataInSessionStorage()
    ? getContactInfoFromCrmData(await getCrmData())
    : null;

export const getDeliveryInfo = async (): Promise<ICrmData | null> =>
  isTokenInLocalStorage() || isCrmDataInSessionStorage()
    ? getDeliveryInfoFromCrmData(await getCrmData())
    : null;

export const getToken = (): string | null => getTokenFromLocalStorage();

export const getUser = (): IDecodedJwt | null =>
  isTokenInLocalStorage()
    ? parseJWT(getTokenFromLocalStorage() as string)
    : null;

const initButton = (
  id: string,
  options: IButtonConfiguration,
  onSuccess: (token: string) => void,
  onError: (err: string) => void,
  loginOptions: ILoginOptions
): void => {
  const button = addButtonTo(id, options);
  button.addEventListener('click', async () => {
    try {
      if (loginOptions.withUserCheckout) {
        // Clearing token from local storage to force popup. This allows a user to select a different address
        // by forcing the consent dialogue
        clearTokenFromLocalStorage();
      }
      const token = await authenticate(loginOptions);
      onSuccess(token);
    } catch (err) {
      onError(err);
    }
  });
};

export const addLoginButtonTo = (
  id: string,
  onSuccess = noop,
  onError = noop
): void => {
  const options = {
    buttonText: 'Logg inn',
    helpText: 'Bruk innlogging fra INN'
  };

  initButton(id, options, onSuccess, onError, { withUserCheckout: false });
};

export const addCheckoutButtonTo = (
  id: string,
  onSuccess = noop,
  onError = noop
): void => {
  const options = {
    buttonText: 'Hent adresse',
    helpText: 'Henter adresseinformasjon fra INN',
    profileLink: getProfileLink(),
    profileLinkText: 'Rediger profilen din på INN'
  };

  initButton(id, options, onSuccess, onError, { withUserCheckout: true });
};
