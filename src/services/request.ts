import { getConfig } from './config';
import {
  clearTicketFromLocalStorage,
  getSecretFromLocalStorage,
  getTicketFromLocalStorage,
  setSecretInLocalStorage,
  setTokenInLocalStorage
} from '../utils/local-storage';
import { ISecretResponse, ICrmDataResponse } from '../types';

import { getAsJson, getAsText } from './fetch';

async function fetchSecretFromAppName(): Promise<ISecretResponse> {
  const { appName } = getConfig();

  const data = await getAsJson(
    `/load/api/${appName}?ticket=${getTicketFromLocalStorage()}`
  );

  setSecretInLocalStorage(data.secret);
  return data;
}

export async function fetchUserToken(): Promise<string> {
  const { secret, ticket: newTicket } = await fetchSecretFromAppName();

  const userToken = await getAsText(
    `/api/${secret}/get_token_from_ticket/${newTicket}`
  );

  clearTicketFromLocalStorage();
  setTokenInLocalStorage(userToken);
  return userToken;
}

export async function fetchCrmData(
  userTokenId: string
): Promise<ICrmDataResponse> {
  return await getAsJson(
    `/api/${getSecretFromLocalStorage()}/get_shared_delivery_address/${userTokenId}`
  );
}
