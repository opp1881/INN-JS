import { IDecodedJwt } from '../types';

export default function parseJWT(token: string): IDecodedJwt | null {
  if (token.split('.').length !== 3) {
    return null;
  }
  const base64 = token
    .split('.')[1]
    .replace('-', '+')
    .replace('_', '/');

  return JSON.parse(window.atob(base64));
}
