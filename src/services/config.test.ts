import {
  initConfig,
  getMode,
  getAppName,
  getProxyUrl,
  getConfig,
  getFlow,
  getRequireConsent
} from './config';
import { Mode, ProxyUrl, Flow } from '../enums';
import { IConfig } from '../types';

const APP_NAME = 'example-app';
const VALID_CONFIG = {
  appName: APP_NAME,
  mode: Mode.DEV,
  flow: Flow.SECRET_PROVISIONED,
  requireConsent: false
};

describe('configService', () => {
  describe('initConfig', () => {
    it('should set config for app', () => {
      initConfig(VALID_CONFIG);
      expect(getConfig()).toEqual(VALID_CONFIG);
    });

    it('should throw for empty config object', () => {
      expect(() => initConfig({} as IConfig)).toThrow();
    });

    it('should throw for missing required options', () => {
      expect(() => initConfig({ appName: 'example' } as IConfig)).toThrow();
    });

    it('should not include excess options', () => {
      initConfig({
        ...VALID_CONFIG,
        excessOption: 'someValue'
      } as IConfig);
      expect(getConfig()).toEqual(VALID_CONFIG);
    });
  });

  describe('getMode', () => {
    it('should return mode application is running in', () => {
      initConfig(VALID_CONFIG);
      expect(getMode()).toBe(Mode.DEV);
    });
  });

  describe('getAppName', () => {
    it('should return app name from config', () => {
      initConfig(VALID_CONFIG);
      expect(getAppName()).toBe(APP_NAME);
    });
  });

  describe('getProxyUrl', () => {
    it('should return DEV url when in DEV mode', () => {
      initConfig(VALID_CONFIG);
      expect(getProxyUrl()).toBe(ProxyUrl.DEV);
    });

    it('should return PROD url when in PROD mode', () => {
      initConfig({
        ...VALID_CONFIG,
        mode: Mode.PROD
      });
      expect(getProxyUrl()).toBe(ProxyUrl.PROD);
    });
  });

  describe('getFlow', () => {
    it('should return flow application is using', () => {
      initConfig(VALID_CONFIG);
      expect(getFlow()).toBe(Flow.SECRET_PROVISIONED);
    });
  });

  describe('getRequireConsent', () => {
    it('should return configured consent', () => {
      initConfig({
        ...VALID_CONFIG,
        requireConsent: true
      });
      expect(getRequireConsent()).toBe(true);
    });

    it('should return default consent', () => {
      initConfig(VALID_CONFIG);
      expect(getRequireConsent()).toBe(false);
    });
  });
});
