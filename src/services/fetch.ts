import { getProxyUrl } from './config';
import { getTokenFromLocalStorage } from '../utils/local-storage';

const getUrl = (path: string): string =>
  path.startsWith('/') ? `${getProxyUrl()}${path}` : `${getProxyUrl()}/${path}`;

const getHeaders = (headers: HeadersInit = {}): HeadersInit => {
  const token = getTokenFromLocalStorage();
  return headers;
  // return token
  //   ? {
  //       ...headers,
  //       Authorization: `Bearer ${token}`
  //     }
  //   : headers;
};

export const getAsJson = async (path: string): Promise<any> => {
  const response = await fetch(getUrl(path), {
    headers: getHeaders({
      accept: 'application/json'
    })
  });

  if (response.status === 200) {
    return await response.json();
  }

  throw new Error('Request failed');
};

export const getAsText = async (path: string): Promise<string> => {
  const response = await fetch(getUrl(path), { headers: getHeaders() });

  if (response.status === 200) {
    return await response.text();
  }

  throw new Error('Request failed');
};

export const postWithJsonResponse = async (path: string): Promise<any> => {
  const response = await fetch(getUrl(path), {
    headers: getHeaders({ accept: 'application/json' }),
    method: 'POST'
  });

  if (response.status === 200) {
    return await response.json();
  }
  throw new Error('Request failed');
};

export const post = async (path: string): Promise<any> => {
  const response = await fetch(getUrl(path), {
    method: 'POST'
  });

  if (response.status === 200) {
    return await response.text();
  }

  throw new Error('Request failed');
};
