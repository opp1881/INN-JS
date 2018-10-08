const REQUIRED_OPTIONS = ['appName', 'spaProxyUrl', 'ssoLoginUrl'];

let config = {};

export const setConfig = newConfig => {
  config = {
    ...config,
    ...newConfig
  };
};

export const getConfig = () => config;

export const clearConfig = () => {
  config = {};
};

const isNonEmptyString = testString =>
  typeof testString === 'string' && testString.length > 0;

const verifyPresence = configKey => {
  const configValue = getConfig()[configKey];
  if (isNonEmptyString(configValue)) {
    return true;
  }
  throw new Error(
    `Error in INN-JS configuration. Missing config with key:${configKey}`
  );
};

export const verifyRequiredConfig = () =>
  REQUIRED_OPTIONS.every(verifyPresence);
