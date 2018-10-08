import axios from 'axios';

import { getConfig } from './config';
import {
  clearTicketFromLocalStorage,
  getSecretFromLocalStorage,
  getTicketFromLocalStorage,
  setSecretInLocalStorage
} from './local-storage';

export const fetchSecretFromAppName = async () => {
  const { appName, spaProxyUrl } = getConfig();
  const response = await axios.get(
    `${spaProxyUrl}/load/api/${appName}?ticket=${getTicketFromLocalStorage()}`
  );
  if (response.status === 200) {
    setSecretInLocalStorage(response.data.secret);
    return response.data;
  }
  throw new Error(
    `Could not get secret from app name. Http status code is ${response.status}`
  );
};

export const fetchUserToken = async () => {
  const { spaProxyUrl } = getConfig();
  const { secret, ticket: newTicket } = await fetchSecretFromAppName();
  const response = await axios.get(
    `${spaProxyUrl}/api/${secret}/get_token_from_ticket/${newTicket}`
  );
  if (response.status === 200) {
    clearTicketFromLocalStorage();
    return response.data;
  }
  throw new Error(
    `Could not get user token from user ticket. Response status is ${
      response.status
    }`
  );
};

export const fetchCrmData = async userTokenId => {
  const { spaProxyUrl } = getConfig();
  const response = await axios.get(
    `${spaProxyUrl}/api/${getSecretFromLocalStorage()}/get_shared_delivery_address/${userTokenId}`
  );
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(
    `Could not get crm data. Response status is ${response.status}`
  );
};
