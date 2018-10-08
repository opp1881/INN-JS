const isObject = item => typeof item === 'object';

const extractContactInfo = crmData => {
  const { contact } = crmData.deliveryaddress;
  return {
    emailAddress: contact.email,
    fullName: contact.name,
    phoneNumber: contact.phoneNumber
  };
};

const extractDeliveryAddress = crmData => {
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

const extractDeliveryInfo = crmData => {
  const { deliveryinformation } = crmData.deliveryaddress;
  return {
    additionalAddressInfo: deliveryinformation.additionalAddressInfo,
    deliveryTime: deliveryinformation.Deliverytime,
    pickupPoint: deliveryinformation.pickupPoint
  };
};

export const getContactInfo = crmData => {
  if (
    isObject(crmData) &&
    isObject(crmData.deliveryaddress) &&
    isObject(crmData.deliveryaddress.contact)
  ) {
    return extractContactInfo(crmData);
  }
  throw new Error('Could not retrieve contact information from CRM data');
};

export const getDeliveryAddress = crmData => {
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
  throw new Error('Could not retrieve address from CRM data');
};

export const getDeliveryInfo = crmData => ({
  contactInfo: getContactInfo(crmData),
  deliveryAddress: getDeliveryAddress(crmData)
});
