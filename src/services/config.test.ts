import {
  clearConfig,
  getConfig,
  setConfig,
  verifyRequiredConfig
} from './config';

describe('configService', () => {
  describe('getConfig', () => {
    it('should contain no default values', () => {
      expect(getConfig()).toEqual({});
    });
  });

  describe('setConfig', () => {
    beforeEach(clearConfig);

    it('should merge provided configs with existing configs', () => {
      setConfig({
        ssoLoginUrl: 'https://test.test'
      });
      const existingConfigKeys = Object.keys(getConfig());
      setConfig({
        appName: 'some value'
      });
      const newConfig = Object.keys(getConfig());
      expect(newConfig.length - existingConfigKeys.length).toEqual(1);
    });

    it('should overwrite already existing config keys', () => {
      setConfig({ appName: 'Example app 1' });
      expect(getConfig().appName).toEqual('Example app 1');
      setConfig({ appName: 'Example app 2' });
      expect(getConfig().appName).toEqual('Example app 2');
    });
  });

  describe('verifyRequiredConfig', () => {
    beforeEach(clearConfig);

    it('should return true if all required configuration is present', () => {
      setConfig({
        appName: 'exampleApp',
        spaProxyUrl: 'https://proxy.url',
        ssoLoginUrl: 'https://login.url'
      });
      expect(verifyRequiredConfig()).toEqual(true);
    });

    it('should throw error if configuration of wrong type is provided', () => {
      setConfig({
        appName: 123,
        spaProxyUrl: 'https://proxy.url',
        ssoLoginUrl: 'https://login.url'
      } as any);
      expect(verifyRequiredConfig).toThrow();
    });

    it('should throw error if missing appName', () => {
      setConfig({
        spaProxyUrl: 'https://proxy.url',
        ssoLoginUrl: 'https://login.url'
      });
      expect(verifyRequiredConfig).toThrow();
    });

    it('should throw error if missing spaProxyUrl', () => {
      setConfig({
        appName: 'exampleApp',
        ssoLoginUrl: 'https://login.url'
      });

      expect(verifyRequiredConfig).toThrow();
    });

    it('should throw error if missing ssoLoginUrl', () => {
      setConfig({
        appName: 'exampleApp',
        spaProxyUrl: 'https://proxy.url'
      });

      expect(verifyRequiredConfig).toThrow();
    });
  });
});
