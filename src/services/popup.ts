import { getQueryParamValue } from '../utils/query';
import { getRequireConsent } from './config';
import { initializeSession } from './request';
import LoadingPage from '../components/LoadingPage';

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

function openPopup(): Window {
  const popup = window.open('about:blank', 'innspaclient', windowFeatures);
  if (popup) {
    popup.document.body.appendChild(LoadingPage());
    return popup;
  }
  throw new Error('Could not open login popup');
}

function redirectPopup(popup: Window, ssoLoginUrl: string): void {
  popup.location.href = `${ssoLoginUrl}${
    getRequireConsent() ? '?UserCheckout=true' : ''
  }`;
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

export default async function login(): Promise<{
  appSecret: string;
  ssoLoginUUID: string;
}> {
  const popup = openPopup();
  const session = await initializeSession();

  redirectPopup(popup, session.ssoLoginUrl);

  const provisionedSecret = getQueryParamValue(window.location.search, 'code');
  if (provisionedSecret) {
    await pollForLoginCompletion(popup, true);
    return { appSecret: provisionedSecret, ssoLoginUUID: session.ssoLoginUUID };
  } else {
    const appSecret = await pollForLoginCompletion(popup, false);
    return { appSecret, ssoLoginUUID: session.ssoLoginUUID };
  }
}
