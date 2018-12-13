import { getConfig, getProxyUrl, getAppName } from './config';
import { getQueryParamValue } from '../utils/query';
import { setSecretInLocalStorage } from '../utils/local-storage';
import { Flow } from '../enums';
import { IPopupResult } from '../types';

const isLoginNotInProgress = (popupWindow): boolean =>
  !popupWindow || popupWindow.closed || popupWindow.closed === undefined;

/* Horisontal positioning */
const popupWidth = 480;
const popupPosX = window.screenLeft + (window.outerWidth / 2 - popupWidth / 2);

/* Vertical positioning */
const popupHeight = 640;
const popupPosY = window.screenTop + (window.outerHeight / 2 - popupHeight / 2);

const windowFeatures = `left=${popupPosX},
                          top=${popupPosY},
                          height=${popupHeight},
                          width=${popupWidth},
                          menubar=no,
                          chrome=yes,
                          toolbar=no,
                          personalbar=no,
                          resizable=no,
                          titlebar=no`;

function openPopup(path: string, requireConsent: boolean): Window | null {
  return window.open(
    `${path}?redirectURI=${window.origin}&UserCheckout=${requireConsent}`,
    'innspaclient',
    windowFeatures
  );
}

function executeSecretProvisionedFlow(
  requireConsent: boolean,
  secret: string | null
): Promise<IPopupResult> {
  let code = secret;
  if (!code) {
    code = getQueryParamValue(window.location.search, 'code');
  }
  if (!code) {
    throw new Error(
      "Missing 'code' query param. This is required for the secret-provisioned flow"
    );
  }
  const popup = openPopup(
    `${getProxyUrl()}/api/${secret}/ssologin/${getAppName()}`,
    requireConsent
  );
  const ticketQueryParamKey = 'userticket'; // This flow redirects from SSOLWA - will return ticket as 'userticket'

  return pollForLoginResult(popup, ticketQueryParamKey, code);
}

function executeSecretUnknownFlow(
  requireConsent: boolean
): Promise<IPopupResult> {
  const popup = openPopup(
    `${getProxyUrl()}/load/ssologin/${getAppName()}`,
    requireConsent
  );
  const ticketQueryParamKey = 'ticket'; // This flow redirects from SPAProxy - will return ticket as 'ticket'

  return pollForLoginResult(popup, ticketQueryParamKey, null);
}

function pollForLoginResult(
  popup: Window | null,
  ticketParam: string,
  code: string | null
): Promise<IPopupResult> {
  return new Promise((resolve, reject) => {
    const pollTimer = window.setInterval(() => {
      if (isLoginNotInProgress(popup)) {
        window.clearInterval(pollTimer);
      } else {
        try {
          if (popup!.location.href.indexOf(window.origin) !== -1) {
            window.clearInterval(pollTimer);
            const { search } = popup!.location;

            popup!.close();
            if (search) {
              const userticket = getQueryParamValue(search, ticketParam);

              // Assume secret-unknown flow when code is missing. Fetch from query params in popup
              if (!code) {
                code = getQueryParamValue(search, 'code');
              }
              if (userticket && code) {
                resolve({ userticket, code });
              } else {
                reject('Could not find required query params');
              }
            } else {
              reject('Could not find any query params');
            }
          }
          /* tslint:disable */
        } catch (e) {}
        /* tslint:enable */
      }
    }, 20);
  });
}

export default function getUserTicket(
  secret: string | null
): Promise<IPopupResult> {
  const { flow, requireConsent } = getConfig();

  if (flow === Flow.SECRET_PROVISIONED) {
    return executeSecretProvisionedFlow(requireConsent, secret);
  } else {
    return executeSecretUnknownFlow(requireConsent);
  }
}
