import { ICrmData } from '../types';
import { getQueryParamValue, getAddressFromQuery } from '../utils/query';
import { setCrmDataInSessionStorage } from '../utils/session-storage';
import { areCrmDataFieldsEmpty } from './crm-data';
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
	popup.document.body.innerHTML = LoadingPage();
    return popup;
  }
  throw new Error('Could not open login popup');
}

function redirectPopup(
  popup: Window,
  ssoLoginUrl: string,
  withUserCheckout: boolean
): void {
  popup.location.href = `${ssoLoginUrl}?UserCheckout=${withUserCheckout}`;
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

export default async function login(
  withUserCheckout: boolean
): Promise<{
  appSecret: string;
  ssoLoginUUID: string;
}> {
  const popup = openPopup();
  const session = await initializeSession();

  redirectPopup(popup, session.ssoLoginUrl, withUserCheckout);

  const provisionedSecret = getQueryParamValue(window.location.search, 'code');
  if (provisionedSecret) {
    await pollForLoginCompletion(popup, true);
    return { appSecret: provisionedSecret, ssoLoginUUID: session.ssoLoginUUID };
  } else {
    const [appSecret, crmData] = await pollForLoginCompletion(popup, false);
    if (crmData !== null && !areCrmDataFieldsEmpty(crmData)) {
      // User did not register, so we set the user contact info to be data from query params
      setCrmDataInSessionStorage(crmData as ICrmData);
    }
    return {
      appSecret: appSecret as string,
      ssoLoginUUID: session.ssoLoginUUID
    };
  }
}
