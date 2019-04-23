import {
  IContactInfo,
  ICrmDataResponse,
  IDeliveryAddress,
  IDeliveryAddressPart,
  IDeliveryInfoPart,
  ICrmData
} from '../types';

const isObject = (item: any): boolean => typeof item === 'object';

const extractContactInfo = (crmData: ICrmDataResponse): IContactInfo => {
  const { contact } = crmData.deliveryaddress;
  return {
    emailAddress: contact.email,
    firstName: crmData.firstName,
    lastName: crmData.lastName,
    fullName: contact.name,
    phoneNumber: contact.phoneNumber
  };
};

const extractDeliveryAddress = (
  crmData: ICrmDataResponse
): IDeliveryAddressPart => {
  const { deliveryaddress } = crmData;
  return {
    addressLine1: deliveryaddress.addressLine1,
    addressLine2: deliveryaddress.addressLine2,
    company: deliveryaddress.company,
    countryCode: deliveryaddress.countryCode,
    postalCity: deliveryaddress.postalcity,
    postalCode: deliveryaddress.postalcode
  };
};

const extractDeliveryInfo = (crmData: ICrmDataResponse): IDeliveryInfoPart => {
  const { deliveryinformation } = crmData.deliveryaddress;
  return {
    additionalAddressInfo: deliveryinformation.additionalAddressInfo,
    deliveryTime: deliveryinformation.Deliverytime,
    pickupPoint: deliveryinformation.pickupPoint
  };
};

export const getContactInfo = (crmData: ICrmDataResponse): IContactInfo => {
  if (
    isObject(crmData) &&
    isObject(crmData.deliveryaddress) &&
    isObject(crmData.deliveryaddress.contact)
  ) {
    return extractContactInfo(crmData);
  }
  throw new Error('Could not retrieve contact information');
};

export const getDeliveryAddress = (
  crmData: ICrmDataResponse
): IDeliveryAddress => {
  if (
    isObject(crmData) &&
    isObject(crmData.deliveryaddress) &&
    isObject(crmData.deliveryaddress.deliveryinformation)
  ) {
    return {
      ...extractDeliveryAddress(crmData),
      ...extractDeliveryInfo(crmData)
    };
  }
  throw new Error('Could not retreive address');
};

export const areCrmDataFieldsEmpty = (crmData: ICrmDataResponse): boolean => {
  const { deliveryaddress } = crmData;
  return (
    deliveryaddress.contact.name === '' && deliveryaddress.addressLine1 === ''
  );
};

export const getDeliveryInfo = (crmData: ICrmDataResponse): ICrmData => ({
  contactInfo: getContactInfo(crmData),
  deliveryAddress: getDeliveryAddress(crmData)
});
