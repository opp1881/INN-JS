import { getConfig } from './config';
import {
  getSecretFromLocalStorage,
  setSecretInLocalStorage,
  setTokenInLocalStorage
} from '../utils/local-storage';
import { ISecretResponse, ICrmDataResponse } from '../types';

import { getAsJson, getAsText } from './fetch';

// TODO: Connected to old flow. Remove when ready
async function oldFetchSecretFromAppName(
  userticket: string
): Promise<ISecretResponse> {
  const { appName } = getConfig();

  const data = await getAsJson(`/load/api/${appName}?ticket=${userticket}`);

  setSecretInLocalStorage(data.secret);
  return data;
}

// TODO: Connected to old flow. Remove when ready
export async function oldFetchUserToken(userticket: string): Promise<string> {
  const { secret, ticket: newTicket } = await oldFetchSecretFromAppName(
    userticket
  );

  const userToken = await getAsText(
    `/api/${secret}/get_token_from_ticket/${newTicket}`
  );

  setTokenInLocalStorage(userToken);
  return userToken;
}

export async function fetchUserToken(
  userTicket: string,
  secret: string
): Promise<string> {
  const userToken = await getAsText(
    `/api/${secret}/get_token_from_ticket/${userTicket}`
  );

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
