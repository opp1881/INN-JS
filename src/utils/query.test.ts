import { getQueryParamValue, getAddressFromQuery } from './query';

const mockCrmDataObject = {
  deliveryaddress: {
    contact: {
      name: 'Myfirstname MylastName',
      emailAddress: '',
      phoneNumber: ''
    },
    addressLine1: 'My address 2',
    postalcode: '0123',
    deliveryinformation: {
      additionalAddressInfo: '',
      Deliverytime: '',
      pickupPoint: ''
    }
  }
};

describe('query-utils', () => {
  describe('getQueryParamValue', () => {
    it('should return null for missing param key', () => {
      expect(getQueryParamValue('?a=b&c=d', 'e')).toBeNull();
    });

    it('should return return null if only query param value is equal to key', () => {
      expect(getQueryParamValue('?a=b&c=d', 'd')).toBeNull();
    });

    it('should return the value of the query param if present', () => {
      expect(getQueryParamValue('?a=b&c=d', 'c')).toBe('d');
    });

    it('should be case insensitive when finding query params', () => {
      expect(getQueryParamValue('?A=b&C=d', 'c')).toBe('d');
    });

    it('should replace plus with space for query params', () => {
      expect(getQueryParamValue('?value=d+c&value2=k', 'value')).toBe('d c');
    });
    it('should decode encoded URis', () => {
      expect(getQueryParamValue('?value=%C3%B8', 'value')).toBe('ø');
    });
  });
  describe('getAddressFromQuery', () => {
    it('should create a ICrmDataResponse out a string with query params', () => {
      expect(
        getAddressFromQuery(
          `?firstName=${
            mockCrmDataObject.deliveryaddress.contact.name.split(' ')[0]
          }&lastName=${
            mockCrmDataObject.deliveryaddress.contact.name.split(' ')[1]
          }&zipcode=${
            mockCrmDataObject.deliveryaddress.postalcode
          }&streetAddress=${mockCrmDataObject.deliveryaddress.addressLine1}`
        )
      ).toEqual(mockCrmDataObject);
    });
    it('should handle + instead of space in params', () => {
      const mockCrmDataObjectWithPlus = {
        deliveryaddress: {
          contact: {
            name: 'Myfirstname MylastName',
            emailAddress: '',
            phoneNumber: ''
          },
          addressLine1: 'My+address+2',
          postalcode: '0123',
          deliveryinformation: {
            additionalAddressInfo: '',
            Deliverytime: '',
            pickupPoint: ''
          }
        }
      };
      expect(
        getAddressFromQuery(
          `?firstName=${
            mockCrmDataObjectWithPlus.deliveryaddress.contact.name.split(' ')[0]
          }&lastName=${
            mockCrmDataObjectWithPlus.deliveryaddress.contact.name.split(' ')[1]
          }&zipcode=${
            mockCrmDataObjectWithPlus.deliveryaddress.postalcode
          }&streetAddress=${
            mockCrmDataObjectWithPlus.deliveryaddress.addressLine1
          }`
        )
      ).toEqual(mockCrmDataObject);
    });
  });
});
