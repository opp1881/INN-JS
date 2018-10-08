import { fetchCrmData, fetchUserToken } from './services/request';
import { isTicketInLocalStorage } from './services/local-storage';
import { setConfig, verifyRequiredConfig } from './services/config';
import {
  getContactInfo as getContactInfoFromCrmData,
  getDeliveryAddress as getDeliveryAddressFromCrmData,
  getDeliveryInfo as getDeliveryInfoFromCrmData
} from './services/crm-data';
import getUserTicket from './services/popup';
import parseJWT from './utils/jwt';

const userData = {
  token: null
};

const getCrmData = async () => {
  const { jti } = parseJWT(userData.token);
  return fetchCrmData(jti);
};

const isAuthenticated = () => userData.token !== null;

const isReady = () => isAuthenticated() && verifyRequiredConfig();

export const authenticate = async () => {
  try {
    if (!isTicketInLocalStorage()) {
      await getUserTicket();
    }
    userData.token = await fetchUserToken();
    return userData.token;
  } catch (err) {
    throw new Error('Received error', err);
  }
};

export const init = options => {
  setConfig(options);
};

export const getContactInfo = async () =>
  isReady() ? getContactInfoFromCrmData(await getCrmData()) : null;

export const getDefaultDeliveryAddress = async () =>
  isReady() ? getDeliveryAddressFromCrmData(await getCrmData()) : null;

export const getDeliveryInfo = async () =>
  isReady() ? getDeliveryInfoFromCrmData(await getCrmData()) : null;

export const getToken = () => (isReady() ? userData.token : null);

export const getUser = () => (isReady() ? parseJWT(userData.token) : null);
