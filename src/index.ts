import { setConfig, verifyRequiredConfig } from './services/config';
import {
  getContactInfo as getContactInfoFromCrmData,
  getDeliveryAddress as getDeliveryAddressFromCrmData,
  getDeliveryInfo as getDeliveryInfoFromCrmData
} from './services/crm-data';
import { isTicketInLocalStorage } from './services/local-storage';
import { fetchCrmData, fetchUserToken } from './services/request';
import getUserTicket from './services/popup';
import parseJWT from './utils/jwt';
import {
  COULD_NOT_AUTHENTICATE_MESSAGE,
  COULD_NOT_RETRIEVE_CRM_DATA_MESSAGE
} from './constants/error-messages';
import {
  ICrmDataResponse,
  IContactInfo,
  IDeliveryAddressPart,
  ICrmData,
  IDecodedJwt,
  IUserData
} from './types';

const userData: IUserData = {
  token: null
};

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

const isAuthenticated = (): boolean => userData.token !== null;

const isReady = (): boolean => isAuthenticated() && verifyRequiredConfig();

export const authenticate = async (): Promise<string | null> => {
  try {
    if (!isTicketInLocalStorage()) {
      await getUserTicket();
    }
    userData.token = await fetchUserToken();
    return userData.token;
  } catch (err) {
    throw new Error(COULD_NOT_AUTHENTICATE_MESSAGE);
  }
};

export const init = (options): void => {
  setConfig(options);
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
