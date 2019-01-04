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
import { ICrmDataResponse, IContactInfo, ICrmData, IDecodedJwt } from './types';

/* tslint:disable */
function noop() {}
/* tslint:enable */

const getCrmData = async (): Promise<ICrmDataResponse> => {
  const token = getTokenFromLocalStorage();
  if (token) {
    try {
      const decodedJwt = parseJWT(token);
      if (decodedJwt) {
        return fetchCrmData(decodedJwt.jti);
      } else {
        throw new Error('Could not fetch crm data due to invalid token');
      }
    } catch (err) {
      throw new Error('Error decoding jwt');
    }
  } else {
    throw new Error('Could not fetch crm data because of missing token');
  }
};

const isReady = (): boolean => getTokenFromLocalStorage() !== null;

const authenticate = async (): Promise<string | null> => {
  if (isTokenInLocalStorage()) {
    return getTokenFromLocalStorage();
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
  isReady() ? getContactInfoFromCrmData(await getCrmData()) : null;

export const getDeliveryInfo = async (): Promise<ICrmData | null> =>
  isReady() ? getDeliveryInfoFromCrmData(await getCrmData()) : null;

export const getToken = (): string | null =>
  isReady() ? getTokenFromLocalStorage() : null;

export const getUser = (): IDecodedJwt | null =>
  isReady() ? parseJWT(getTokenFromLocalStorage()!) : null;

const getParent = (id: string): HTMLElement => {
  const parent = document.getElementById(id);
  if (!parent) {
    throw new Error(
      `Could not find container with id=${id} to append button to`
    );
  }
  return parent;
};

export const addLoginButtonTo = (id: string, callback = noop): void => {
  const button = addButtonTo(getParent(id), {
    buttonText: 'Logg inn',
    helpText: 'Bruk innlogging fra INN'
  });

  button.addEventListener('click', async () => {
    await authenticate();
    callback();
  });
};

export const addCheckoutButtonTo = (id: string, callback = noop): void => {
  const button = addButtonTo(getParent(id), {
    buttonText: 'Hent adresse',
    helpText: 'Henter adresseinformasjon fra INN',
    profileLink: getProfileLink(),
    profileLinkText: 'Rediger profilen din på INN'
  });

  button.addEventListener('click', async () => {
    await authenticate();
    callback();
  });
};
