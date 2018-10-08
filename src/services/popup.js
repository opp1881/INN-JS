import { getConfig } from './config';
import { setTicketInLocalStorage } from './local-storage';

export default function getUserTicket() {
  const { ssoLoginUrl } = getConfig();

  /* Horisontal positioning */
  const popupWidth = 480;
  const popupPosX =
    window.screenLeft + (window.outerWidth / 2 - popupWidth / 2);

  /* Vertical positioning */
  const popupHeight = 640;
  const popupPosY =
    window.screenTop + (window.outerHeight / 2 - popupHeight / 2);

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

  const popup = window.open(
    `${ssoLoginUrl}?redirectURI=${
      window.origin
    }&UserCheckout=true&popupOrigin=${window.origin}`,
    'innspaclient',
    windowFeatures
  );

  return new Promise(resolve => {
    /* eslint-disable prefer-arrow-callback */
    window.addEventListener('message', function eventListener(event) {
      if (ssoLoginUrl.startsWith(event.origin)) {
        window.removeEventListener('message', eventListener);
        setTicketInLocalStorage(event.data);
        popup.close();
        resolve(event.data);
      }
    });
  });
}
