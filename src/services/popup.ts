import { getConfig, getProxyUrl, getAppName } from './config';
import { getQueryParamValue } from '../utils/query';
import { setTicketInLocalStorage } from '../utils/local-storage';

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

export default function getUserTicket(): Promise<any> {
  const popup = window.open(
    `${getProxyUrl()}/load/ssologin/${getAppName()}?redirectURI=${
      window.origin
    }&UserCheckout=true`,
    'innspaclient',
    windowFeatures
  );

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
              const userticket = getQueryParamValue(search, 'ticket');
              const secret = getQueryParamValue(search, 'code');
              if (userticket && secret) {
                setTicketInLocalStorage(userticket);
                resolve({ userticket, secret });
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
