import { IConfig } from '../types';
import { MISSING_CONFIGURATION_MESSAGE } from '../constants/error-messages';

const REQUIRED_OPTIONS = ['appName', 'spaProxyUrl', 'ssoLoginUrl'];

let config = {};

export const setConfig = (newConfig: IConfig): void => {
  config = {
    ...config,
    ...newConfig
  };
};

export const getConfig = (): IConfig => config;

export const clearConfig = (): void => {
  config = {};
};

const isNonEmptyString = (testString: string): boolean =>
  typeof testString === 'string' && testString.length > 0;

const verifyPresence = (configKey: string): boolean => {
  const configValue = getConfig()[configKey];
  if (isNonEmptyString(configValue)) {
    return true;
  }
  throw new Error(MISSING_CONFIGURATION_MESSAGE);
};

export const verifyRequiredConfig = (): boolean =>
  REQUIRED_OPTIONS.every(verifyPresence);
