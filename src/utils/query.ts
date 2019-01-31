import { ICrmDataResponse } from '../types';

export const getQueryParamValue = (
  search: string,
  queryParamKey: string
): string | null => {
  const regexPattern = new RegExp(`^${queryParamKey}=`, 'i');

  const queryParam = search
    .replace('?', '')
    .split('&')
    .find(q => regexPattern.test(q));

  return queryParam
    ? decodeURI(replaceCharactersInString(queryParam.split('=')[1], '+', ' '))
    : null;
};

export const getAddressFromQuery = (search: string): ICrmDataResponse => {
  return {
    deliveryaddress: {
      contact: {
        name: getFullNameFromParams(search) || '',
        emailAddress: getQueryParamValue(search, 'emailAddress') || '',
        phoneNumber: getQueryParamValue(search, 'phoneNumber') || ''
      },
      addressLine1: getQueryParamValue(search, 'streetAddress') || '',
      postalcode: getQueryParamValue(search, 'zipcode') || '',
      deliveryinformation: {
        additionalAddressInfo:
          getQueryParamValue(search, 'additionalAddressInfo') || '',
        Deliverytime: getQueryParamValue(search, 'Deliverytime') || '',
        pickupPoint: getQueryParamValue(search, 'pickupPoint') || ''
      }
    }
  };
};

const getFullNameFromParams = (search: string): string | null => {
  const firstName = getQueryParamValue(search, 'firstName');
  const lastName = getQueryParamValue(search, 'lastName');
  return firstName && lastName ? `${firstName} ${lastName}` : null;
};

const replaceCharactersInString = (
  target: string,
  search: string,
  replacement: string
) => {
  return target.split(search).join(replacement);
};
