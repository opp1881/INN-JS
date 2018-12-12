import 'whatwg-fetch';

import { initConfig, getFlow } from './services/config';
import {
  getContactInfo as getContactInfoFromCrmData,
  getDeliveryAddress as getDeliveryAddressFromCrmData,
  getDeliveryInfo as getDeliveryInfoFromCrmData
} from './services/crm-data';
import {
  isTokenInLocalStorage,
  getTokenFromLocalStorage
} from './utils/local-storage';
import {
  fetchCrmData,
  fetchUserToken,
  old_fetchUserToken
} from './services/request';
import getUserTicket from './services/popup';
import { addButtonTo } from './components/Button';
import parseJWT from './utils/jwt';
import { COULD_NOT_RETRIEVE_CRM_DATA_MESSAGE } from './constants/error-messages';
import {
  ICrmDataResponse,
  IContactInfo,
  IDeliveryAddressPart,
  ICrmData,
  IDecodedJwt,
  IUserData
} from './types';
import { Flow } from './enums';

const userData: IUserData = {
  token: null
};

/* tslint:disable */
function noop() {}
/* tslint:enable */

const getCrmData = async (): Promise<ICrmDataResponse> => {
  if (userData.token) {
    try {
      const decodedJwt = parseJWT(userData.token);
      if (decodedJwt) {
        return fetchCrmData(decodedJwt.jti);
      } else {
        throw new Error(COULD_NOT_RETRIEVE_CRM_DATA_MESSAGE);
      }
    } catch (err) {
      throw new Error('Error decoding jwt');
    }
  } else {
    throw new Error('Could not fetch crm data because of missing token');
  }
};

export const isAuthenticated = (): boolean => userData.token !== null;

const isReady = (): boolean => isAuthenticated();

/**
 * Secret unknown flow still uses an old deprecated flow.
 * TODO: This method along with authenticateOld() should be removed when ready and
 * authenticateNew() exported instead as authenticate()
 */
export const authenticate = async (): Promise<string | null> => {
  if (getFlow() === Flow.SECRET_UNKNOWN) {
    return authenticateOld();
  } else {
    return authenticateNew();
  }
};

// TODO: Deprecated. Connected to old flow, remove when ready
const authenticateOld = async (): Promise<string | null> => {
  if (isTokenInLocalStorage()) {
    userData.token = getTokenFromLocalStorage();
    return userData.token;
  }

  try {
    const { userticket } = await getUserTicket();
    userData.token = await old_fetchUserToken(userticket);
    return userData.token;
  } catch (err) {
    throw new Error(`Could not authenticate: ${err}`);
  }
};

const authenticateNew = async (): Promise<string | null> => {
  if (isTokenInLocalStorage()) {
    userData.token = getTokenFromLocalStorage();
    return userData.token;
  }

  try {
    const { userticket } = await getUserTicket();
    userData.token = await fetchUserToken(userticket);
    return userData.token;
  } catch (err) {
    throw new Error(`Could not authenticate: ${err}`);
  }
};

export const init = (options): void => {
  initConfig(options);

  // If the token exists in local storage, the user is authenticated and can get token and
  // perform authenticated actions right away
  userData.token = getTokenFromLocalStorage();
};

export const getContactInfo = async (): Promise<IContactInfo | null> =>
  isReady() ? getContactInfoFromCrmData(await getCrmData()) : null;

export const getDefaultDeliveryAddress = async (): Promise<IDeliveryAddressPart | null> =>
  isReady() ? getDeliveryAddressFromCrmData(await getCrmData()) : null;

export const getDeliveryInfo = async (): Promise<ICrmData | null> =>
  isReady() ? getDeliveryInfoFromCrmData(await getCrmData()) : null;

export const getToken = (): string | null =>
  isReady() ? userData.token : null;

export const getUser = (): IDecodedJwt | null =>
  isReady() ? parseJWT(userData.token!) : null;

export const addLoginButtonTo = (id: string, callback = noop): void => {
  const parent = document.getElementById(id);

  if (parent) {
    const button = addButtonTo(parent, {
      buttonText: 'Logg inn',
      helpText: 'Bruk innlogging fra INN'
    });

    button.addEventListener('click', async () => {
      await authenticate();
      callback();
    });
  }
};

export const addCheckoutButtonTo = (id: string, callback = noop): void => {
  const parent = document.getElementById(id);

  if (parent) {
    const button = addButtonTo(parent, {
      buttonText: 'Hent adresse',
      helpText: 'Henter adresseinformasjon fra INN',
      profileLink: 'https://inn-qa-oidsso.opplysningen.no/oidsso/welcome',
      profileLinkText: 'Rediger profilen din på INN'
    });

    button.addEventListener('click', async () => {
      await authenticate();
      callback();
    });
  }
};
