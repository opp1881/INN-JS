import { getAppName } from './config';
import {
  getSecretFromLocalStorage,
  setTokenInLocalStorage
} from '../utils/local-storage';
import { ICrmDataResponse, ILoginSession } from '../types';
import { getAsJson, getAsText, post, postWithJsonResponse } from './fetch';
import { getQueryParamValue } from '../utils/query';

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
    `/generic/${getSecretFromLocalStorage()}/${userTokenId}/shared-delivery-address`
  );
}

export async function initializeSession(): Promise<ILoginSession> {
  const appSecret = getQueryParamValue(window.location.search, 'code');
  if (appSecret) {
    return await postWithJsonResponse(
      `/application/session/${appSecret}/user/auth/ssologin`
    );
  } else {
    return await postWithJsonResponse(
      `/application/${getAppName()}/user/auth/ssologin`
    );
  }
}

export async function exchangeForToken(
  appSecret: string,
  ssoLoginUUID: string
): Promise<string> {
  const token = await post(
    `/application/session/${appSecret}/user/auth/ssologin/${ssoLoginUUID}/exchange-for-token`
  );
  return token;
}
