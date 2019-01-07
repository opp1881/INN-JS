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
  setTokenInLocalStorage
} from './utils/local-storage';
import { fetchCrmData, exchangeForToken } from './services/request';
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

/* tslint:disable */
function noop(data?) {}
/* tslint:enable */

export const getCrmData = async (): Promise<ICrmDataResponse> => {
  const token = getTokenFromLocalStorage();
  if (token) {
    const decodedJwt = parseJWT(token);
    if (decodedJwt) {
      return fetchCrmData(decodedJwt.jti);
    }
    throw new Error('Could not fetch crm data due to invalid token');
  } else {
    throw new Error('Could not fetch crm data because of missing token');
  }
};

export const authenticate = async (): Promise<string> => {
  if (isTokenInLocalStorage()) {
    return getTokenFromLocalStorage() as string;
  }

  try {
    const { appSecret, ssoLoginUUID } = await login();
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
  isTokenInLocalStorage()
    ? getContactInfoFromCrmData(await getCrmData())
    : null;

export const getDeliveryInfo = async (): Promise<ICrmData | null> =>
  isTokenInLocalStorage()
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
  onError: (err: string) => void
): void => {
  const button = addButtonTo(id, options);
  button.addEventListener('click', async () => {
    try {
      const token = await authenticate();
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

  initButton(id, options, onSuccess, onError);
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

  initButton(id, options, onSuccess, onError);
};
