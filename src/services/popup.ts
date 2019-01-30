import { getQueryParamValue, getAddressFromQuery } from '../utils/query';
import { getRequireConsent } from './config';
import { initializeSession } from './request';
import LoadingPage from '../components/LoadingPage';

const isLoginNotInProgress = (popup): boolean =>
  !popup || popup.closed || popup.closed === undefined;

/* Horisontal positioning */
const popupWidth = 525;
const popupPosX = window.screenLeft + (window.outerWidth / 2 - popupWidth / 2);

/* Vertical positioning */
const popupHeight = 700;
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
): Promise<[string | null, object | null]> {
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
                const crmDataFromSearchQuery = getAddressFromQuery(search);
                const code = getQueryParamValue(search, 'code');
                if (code) {
                  resolve([code, crmDataFromSearchQuery]);
                } else {
                  reject('Could not find required query params');
                }
              }
            }
          }
        } catch (e) {} // tslint:disable-line
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
    const [appSecret, crmData] = await pollForLoginCompletion(popup, false);
    if (crmData !== null) {
      // User did not register, so we set the user contact info to be data from query params
      sessionStorage.setItem(
        'crmDataForUnregisteredUser',
        JSON.stringify(crmData)
      );
    }
    return {
      appSecret: appSecret as string,
      ssoLoginUUID: session.ssoLoginUUID
    };
  }
}
