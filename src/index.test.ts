import * as innClient from './index';
import * as localStorageService from './utils/local-storage';
import * as jwt from './utils/jwt';
import * as popup from './services/popup';
import * as request from './services/request';
import { IDecodedJwt, ICrmData, IContactInfo } from './types';

const BUTTON_ID = 'inn-sso-button';
const BUTTON_CONTAINER_ID = 'login-button-container';
const DUMMY_TOKEN = 'abc';
const DUMMY_USER = { sub: 'abc' } as IDecodedJwt;
const SECRET = 'secret';
const SSO_LOGIN_UUID = 'uuid';

function tick(): Promise<any> {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

function getButton(): HTMLElement {
  return document.getElementById(BUTTON_ID) as HTMLElement;
}

function createButtonContainer(): void {
  const container = document.createElement('div');
  container.setAttribute('id', BUTTON_CONTAINER_ID);
  document.body.appendChild(container);
}

function removeButtonContainer(): void {
  const container = document.getElementById(BUTTON_CONTAINER_ID) as HTMLElement;
  document.body.removeChild(container);
}

let mockOnSuccess: jest.Mock;
let mockOnError: jest.Mock;

describe('inn-js', () => {
  beforeAll(() => {
    innClient.init({
      appName: 'unittest',
      mode: 'development',
      requireConsent: false
    });

    mockOnSuccess = jest.fn();
    mockOnError = jest.fn();
  });

  beforeEach(() => {
    createButtonContainer();
  });

  afterEach(() => {
    removeButtonContainer();
    jest.restoreAllMocks();
    mockOnError.mockReset();
    mockOnSuccess.mockReset();
  });

  describe('addLoginButtonTo', () => {
    it('should throw error when parent can not be found', () => {
      expect(() => innClient.addLoginButtonTo('non-existing-id')).toThrow();
    });

    it('should trigger onSuccess with token after authenticating', async () => {
      jest.spyOn(innClient, 'authenticate').mockResolvedValueOnce(DUMMY_TOKEN);

      innClient.addLoginButtonTo(
        BUTTON_CONTAINER_ID,
        mockOnSuccess,
        mockOnError
      );

      const button = getButton();
      expect(button).toBeDefined();

      button.click();
      await tick();
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(DUMMY_TOKEN);
      expect(mockOnError).toHaveBeenCalledTimes(0);
    });

    it('should trigger onError when authentication fails', async () => {
      jest.spyOn(innClient, 'authenticate').mockImplementationOnce(() => {
        throw new Error();
      });

      innClient.addLoginButtonTo(
        BUTTON_CONTAINER_ID,
        mockOnSuccess,
        mockOnError
      );

      const button = getButton();
      expect(button).toBeDefined();

      button.click();
      await tick();
      expect(mockOnSuccess).toHaveBeenCalledTimes(0);
      expect(mockOnError).toHaveBeenCalledTimes(1);
    });
  });

  describe('addCheckoutButtonTo', () => {
    it('should throw error when parent can not be found', () => {
      expect(() => innClient.addCheckoutButtonTo('non-existing-id')).toThrow();
    });

    it('should trigger onSuccess with token after authenticating', async () => {
      jest.spyOn(innClient, 'authenticate').mockResolvedValue(DUMMY_TOKEN);

      innClient.addCheckoutButtonTo(
        BUTTON_CONTAINER_ID,
        mockOnSuccess,
        mockOnError
      );

      const button = getButton();
      expect(button).toBeDefined();

      button.click();
      await tick();
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(DUMMY_TOKEN);
      expect(mockOnError).toHaveBeenCalledTimes(0);
    });

    it('should trigger onError when authentication fails', async () => {
      jest.spyOn(innClient, 'authenticate').mockImplementationOnce(() => {
        throw new Error();
      });

      innClient.addCheckoutButtonTo(
        BUTTON_CONTAINER_ID,
        mockOnSuccess,
        mockOnError
      );

      const button = getButton();
      expect(button).toBeDefined();

      button.click();
      await tick();

      expect(mockOnSuccess).toHaveBeenCalledTimes(0);
      expect(mockOnError).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    it('should return null if token is not in local storage', () => {
      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(false);

      expect(innClient.getUser()).toBeNull();
    });

    it('should return decoded token if token is in local storage', () => {
      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(true);

      jest.spyOn(jwt, 'default').mockReturnValueOnce(DUMMY_USER);

      expect(innClient.getUser()).toEqual(DUMMY_USER);
    });
  });

  describe('getToken', () => {
    it('should return token if token is in local storage', () => {
      jest
        .spyOn(localStorageService, 'getTokenFromLocalStorage')
        .mockReturnValueOnce(DUMMY_TOKEN);

      expect(innClient.getToken()).toEqual(DUMMY_TOKEN);
    });

    it('should return null if token is not in local storage', () => {
      jest
        .spyOn(localStorageService, 'getTokenFromLocalStorage')
        .mockReturnValueOnce(null);

      expect(innClient.getToken()).toBeNull();
    });
  });

  describe('getDeliveryInfo', () => {
    it('should return delivery info if token is in local storage', async () => {
      jest
        .spyOn(innClient, 'getCrmData')
        .mockResolvedValueOnce(require('../test-data/crm-data.json'));

      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(true);

      const deliveryInfo = (await innClient.getDeliveryInfo()) as ICrmData;
      expect(deliveryInfo.contactInfo.fullName).toEqual('Tore Testbruker');
      expect(deliveryInfo.deliveryAddress!.postalCity).toEqual('Oslo');
    });

    it('should return null if token is not in local storage', async () => {
      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(false);

      expect(await innClient.getDeliveryInfo()).toBeNull();
    });
  });

  describe('getContactInfo', () => {
    it('should return contact info if token is in local storage', async () => {
      jest
        .spyOn(innClient, 'getCrmData')
        .mockResolvedValueOnce(require('../test-data/crm-data.json'));

      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(true);

      const contactInfo = (await innClient.getContactInfo()) as IContactInfo;
      expect(contactInfo.fullName).toEqual('Tore Testbruker');
    });

    it('should return null if token is not in local storage', async () => {
      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(false);

      expect(await innClient.getContactInfo()).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should return token if authentication succeeds', async () => {
      jest.spyOn(popup, 'default').mockResolvedValueOnce({
        appSecret: SECRET,
        ssoLoginUUID: SSO_LOGIN_UUID
      });

      jest
        .spyOn(request, 'exchangeForToken')
        .mockResolvedValueOnce(DUMMY_TOKEN);

      const token = await innClient.authenticate({ withUserCheckout: true });
      expect(token).toEqual(DUMMY_TOKEN);
    });

    it('should set token and secret in local storage if authentication succeeds', async () => {
      jest
        .spyOn(localStorageService, 'isTokenInLocalStorage')
        .mockReturnValueOnce(false);

      jest.spyOn(popup, 'default').mockResolvedValueOnce({
        appSecret: SECRET,
        ssoLoginUUID: SSO_LOGIN_UUID
      });

      jest
        .spyOn(request, 'exchangeForToken')
        .mockResolvedValueOnce(DUMMY_TOKEN);

      const mockSetTokenInLocalStorage = jest.spyOn(
        localStorageService,
        'setTokenInLocalStorage'
      );
      const mockSetSecretInLocalStorage = jest.spyOn(
        localStorageService,
        'setSecretInLocalStorage'
      );

      await innClient.authenticate({ withUserCheckout: true });

      expect(mockSetTokenInLocalStorage).toHaveBeenCalledTimes(1);
      expect(mockSetTokenInLocalStorage).toHaveBeenCalledWith(DUMMY_TOKEN);

      expect(mockSetSecretInLocalStorage).toHaveBeenCalledTimes(1);
      expect(mockSetSecretInLocalStorage).toHaveBeenCalledWith(SECRET);
    });
  });
});
