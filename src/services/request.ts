import axios from 'axios';

import { getConfig } from './config';
import {
  clearTicketFromLocalStorage,
  getSecretFromLocalStorage,
  getTicketFromLocalStorage,
  setSecretInLocalStorage
} from './local-storage';
import { ISecretResponse, ICrmDataResponse, IUserData } from '../types';
import {
  COULD_NOT_RETRIEVE_SECRET_FOR_APP_MESSAGE,
  COULD_NOT_GET_USER_TOKEN_MESSAGE,
  COULD_NOT_RETRIEVE_CRM_DATA_MESSAGE
} from '../constants/error-messages';
import logService from './log-service';

export const fetchSecretFromAppName = async (): Promise<ISecretResponse> => {
  const { appName, spaProxyUrl } = getConfig();
  const response = await axios.get(
    `${spaProxyUrl}/load/api/${appName}?ticket=${getTicketFromLocalStorage()}`
  );
  if (response.status === 200) {
    setSecretInLocalStorage(response.data.secret);
    return response.data;
  }
  throw new Error(COULD_NOT_RETRIEVE_SECRET_FOR_APP_MESSAGE);
};

export const fetchUserToken = async (): Promise<string> => {
  const { spaProxyUrl } = getConfig();
  const { secret, ticket: newTicket } = await fetchSecretFromAppName();
  const response = await axios.get(
    `${spaProxyUrl}/api/${secret}/get_token_from_ticket/${newTicket}`
  );
  if (response.status === 200) {
    clearTicketFromLocalStorage();
    return response.data;
  }
  throw new Error(COULD_NOT_GET_USER_TOKEN_MESSAGE);
};

export const fetchCrmData = async (
  userTokenId: string
): Promise<ICrmDataResponse> => {
  const { spaProxyUrl } = getConfig();
  const response = await axios.get(
    `${spaProxyUrl}/api/${getSecretFromLocalStorage()}/get_shared_delivery_address/${userTokenId}`
  );
  if (response.status === 200) {
    return response.data;
  }
  logService.info(
    `Response status: ${response.status} Response: ${JSON.stringify(
      response.data
    )}`
  );
  throw new Error(COULD_NOT_RETRIEVE_CRM_DATA_MESSAGE);
};
