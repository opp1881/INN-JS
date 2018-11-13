import { IDecodedJwt } from '../types';

export default function parseJWT(token: string): IDecodedJwt | null {
  if (token.split('.').length !== 3) {
    return null;
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonString = window.atob(base64);
  return JSON.parse(jsonString);
}
