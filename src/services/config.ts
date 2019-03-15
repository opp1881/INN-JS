import { IConfig } from '../types';
import { Mode, ProfileLink, ProxyUrl, BackgroundImage } from '../enums';
import { verifyRequiredConfig } from './validate-config';

let config;

export const getConfig = (): IConfig => config;

export const clearConfig = (): void => {
  config = undefined;
};

export const getMode = (): Mode => config.mode;

export const getAppName = (): string => config.appName;

export const getProxyUrl = (): string => {
  if (config.proxyUrl) {
    return config.proxyUrl;
  }
  return getMode() === Mode.DEV ? ProxyUrl.DEV : ProxyUrl.PROD;
}


export const getBackgroundImageUrl = (): string => {
  if (config.profileBackgroundUrl) {
    return config.profileBackgroundUrl;
  }
  return getMode() === Mode.DEV ? BackgroundImage.DEV : BackgroundImage.PROD;
}

export const getProfileLink = (): string => {
  if (config.profileUrl) {
    return config.profileUrl;
  }
  return getMode() === Mode.DEV ? ProfileLink.DEV : ProfileLink.PROD;
}

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
    profileUrl: newConfig.profileUrl,
    profileBackgroundUrl: newConfig.profileBackgroundUrl,
    proxyUrl: newConfig.proxyUrl
  };
};
