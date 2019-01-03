export * from './config';
export * from './crm-data';
export * from './jwt';
export * from './secret';
export * from './user-data';
export * from './popup-result';

export interface ILoginSession {
  ssoLoginUrl: string;
  ssoLoginUUID: string;
}
