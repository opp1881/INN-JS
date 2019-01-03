import { IConfig } from '../types';
import { Mode, ProxyUrl } from '../enums';
import { verifyRequiredConfig } from './validate-config';

const DEFAULT_CONFIG = {
  requireConsent: false
};

let config;

export const getConfig = (): IConfig => config;

export const clearConfig = (): void => {
  config = undefined;
};

export const getMode = (): Mode => config.mode;

export const getAppName = (): string => config.appName;

export const getProxyUrl = (): string =>
  getMode() === Mode.DEV ? ProxyUrl.DEV : ProxyUrl.PROD;

export const getRequireConsent = (): boolean => config.requireConsent;

export const initConfig = (newConfig: IConfig = config): void => {
  const errors = verifyRequiredConfig(newConfig)
    .filter(result => !result.valid)
    .map(result => result.text);

  if (errors.length > 0) {
    throw new Error(
      'Required config is not correct: ' + errors.map(error => `\n${error}`)
    );
  }

  config = {
    appName: newConfig.appName,
    mode: newConfig.mode.toLowerCase(),
    requireConsent:
      newConfig.requireConsent === undefined
        ? DEFAULT_CONFIG.requireConsent
        : newConfig.requireConsent
  };
};
