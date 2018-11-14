import { IConfig } from '../types';
import { RequiredOptions, Mode, ProxyUrl } from '../enums';

const REQUIRED_OPTIONS = [RequiredOptions.APP_NAME, RequiredOptions.MODE];

let config;

const isNonEmptyString = (testString: string): boolean =>
  typeof testString === 'string' && testString.length > 0;

const isNonEmptyObject = (obj): boolean =>
  typeof obj === 'object' && Object.keys(obj).length > 0;

const verifyPresence = (newConfig: IConfig, option: string): boolean =>
  isNonEmptyString(newConfig[option]);

export const verifyRequiredConfig = (newConfig: IConfig = config): boolean =>
  isNonEmptyObject(newConfig) &&
  REQUIRED_OPTIONS.every(
    (option: string): boolean => verifyPresence(newConfig, option)
  );

export const getConfig = (): IConfig => config;

export const clearConfig = (): void => {
  config = undefined;
};

export const getMode = (): Mode => config.mode;

export const getAppName = (): string => config.appName;

export const getProxyUrl = (): string => {
  switch (getMode()) {
    case Mode.DEV:
      return ProxyUrl.DEV;
    case Mode.PROD:
      return ProxyUrl.PROD;
    default:
      throw new Error('Running in invalid mode');
  }
};

export const initConfig = (newConfig: IConfig): void => {
  if (verifyRequiredConfig(newConfig)) {
    config = {
      appName: newConfig.appName,
      mode: newConfig.mode.toLowerCase()
    };
  } else {
    throw new Error('Required config is not present');
  }
};
