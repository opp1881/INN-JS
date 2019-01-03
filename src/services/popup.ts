import { getQueryParamValue } from '../utils/query';
import { getRequireConsent } from './config';

const isLoginNotInProgress = (popup): boolean =>
  !popup || popup.closed || popup.closed === undefined;

/* Horisontal positioning */
const popupWidth = 480;
const popupPosX = window.screenLeft + (window.outerWidth / 2 - popupWidth / 2);

/* Vertical positioning */
const popupHeight = 640;
const popupPosY = window.screenTop + (window.outerHeight / 2 - popupHeight / 2);

/* Poll interval in ms */
const pollInterval = 20;

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

function pollForLoginCompletion(
  popup: Window | null,
  isSecretProvisioned: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pollTimer = window.setInterval(() => {
      if (isLoginNotInProgress(popup)) {
        window.clearInterval(pollTimer);
      } else {
        try {
          if (popup && popup.location.href.indexOf(window.origin) !== -1) {
            window.clearInterval(pollTimer);

            if (isSecretProvisioned) {
              popup.close();
              resolve();
            } else {
              const { search } = popup!.location;

              popup.close();
              if (search) {
                const code = getQueryParamValue(search, 'code');
                if (code) {
                  resolve(code);
                } else {
                  reject('Could not find required query params');
                }
              }
            }
          }
          /* tslint:disable */
        } catch (e) {}
        /* tslint:enable */
      }
    }, pollInterval);
  });
}

export default async function login(url: string): Promise<string> {
  const popup = openPopup(url, getRequireConsent());
  const provisionedSecret = getQueryParamValue(window.location.search, 'code');
  if (provisionedSecret) {
    await pollForLoginCompletion(popup, true);
    return provisionedSecret;
  }
  return await pollForLoginCompletion(popup, false);
}
