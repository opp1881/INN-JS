import { expect } from 'chai';

import {
  getContactInfo,
  getDeliveryAddress,
  getDeliveryInfo
} from './crm-data';

const ADDITIONAL_ADDRESS_INFO = 'Additional address info';
const ADDRESS_LINE_1 = 'Address line 1';
const ADDRESS_LINE_2 = 'Address line 2';
const COMPANY_NAME = 'Company name';
const COUNTRY_CODE = 'no';
const DELIVERY_TIME = 'Delivery time';
const EMAIL_ADDRESS = 'email@example.com';
const FULL_NAME = 'FirstName Surname';
const PHONE_NUMBER = '12345678';
const PICKUP_POINT = 'Pickup point';
const POSTAL_CITY = 'City';
const POSTAL_CODE = '0123';

const mockData = {
  deliveryaddress: {
    reference: '',
    postalcode: POSTAL_CODE,
    countryCode: COUNTRY_CODE,
    contact: {
      phoneNumber: PHONE_NUMBER,
      emailConfirmed: false,
      name: FULL_NAME,
      email: EMAIL_ADDRESS,
      phoneNumberConfirmed: 'false'
    },
    name: FULL_NAME,
    postalcity: POSTAL_CITY,
    addressLine1: ADDRESS_LINE_1,
    company: COMPANY_NAME,
    addressLine2: ADDRESS_LINE_2,
    deliveryinformation: {
      pickupPoint: PICKUP_POINT,
      additionalAddressInfo: ADDITIONAL_ADDRESS_INFO,
      Deliverytime: DELIVERY_TIME
    },
    tags: '66c5dc2c-8629-4d45-ad82-c2997444666b'
  }
};

describe('crmData', () => {
  describe('getContactInfo', () => {
    it('should return name, email address and phone number', () => {
      const contactInfo = getContactInfo(mockData);
      expect(contactInfo).to.deep.equal({
        emailAddress: EMAIL_ADDRESS,
        fullName: FULL_NAME,
        phoneNumber: PHONE_NUMBER
      });
    });

    it('should throw error if crmdata is not an object', () => {
      expect(() => getContactInfo()).to.throw();
    });

    it('should throw error if deliveryaddress is not an object', () => {
      expect(() => getContactInfo({})).to.throw();
    });

    it('should throw error if contact is not an object', () => {
      expect(() => getContactInfo({ deliveryaddress: {} })).to.throw();
    });
  });

  describe('getDeliveryAddress', () => {
    it('should return delivery address', () => {
      const deliveryAddress = getDeliveryAddress(mockData);
      expect(deliveryAddress).to.deep.equal({
        additionalAddressInfo: ADDITIONAL_ADDRESS_INFO,
        addressLine1: ADDRESS_LINE_1,
        addressLine2: ADDRESS_LINE_2,
        company: COMPANY_NAME,
        countryCode: COUNTRY_CODE,
        deliveryTime: DELIVERY_TIME,
        pickupPoint: PICKUP_POINT,
        postalCity: POSTAL_CITY,
        postalCode: POSTAL_CODE
      });
    });

    it('should throw error if crmdata is not an object', () => {
      expect(() => getDeliveryAddress()).to.throw();
    });

    it('should throw error if deliveryaddress is not an object', () => {
      expect(() => getDeliveryAddress({})).to.throw();
    });

    it('should throw error if deliveryinformation is not an object', () => {
      expect(() => getDeliveryAddress({ deliveryaddress: {} })).to.throw();
    });
  });

  describe('getDeliveryInfo', () => {
    it('should return deliver info', () => {
      const deliveryInfo = getDeliveryInfo(mockData);
      expect(deliveryInfo).to.deep.equal({
        contactInfo: {
          emailAddress: EMAIL_ADDRESS,
          fullName: FULL_NAME,
          phoneNumber: PHONE_NUMBER
        },
        deliveryAddress: {
          additionalAddressInfo: ADDITIONAL_ADDRESS_INFO,
          addressLine1: ADDRESS_LINE_1,
          addressLine2: ADDRESS_LINE_2,
          company: COMPANY_NAME,
          countryCode: COUNTRY_CODE,
          deliveryTime: DELIVERY_TIME,
          pickupPoint: PICKUP_POINT,
          postalCity: POSTAL_CITY,
          postalCode: POSTAL_CODE
        }
      });
    });
  });
});
