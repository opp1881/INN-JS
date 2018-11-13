export interface ICrmData {
  contactInfo: IContactInfo;
  deliveryAddress?: IDeliveryAddress;
}

export interface IContactInfo {
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
}

export interface IDeliveryAddressPart {
  addressLine1: string;
  addressLine2?: string;
  company?: string;
  countryCode?: string;
  postalCity?: string;
  postalCode?: string;
}

export interface IDeliveryInfoPart {
  additionalAddressInfo?: string;
  deliveryTime?: string;
  pickupPoint?: string;
}

export interface IDeliveryAddress
  extends IDeliveryAddressPart,
    IDeliveryInfoPart {}

export interface ICrmDataResponse {
  [key: string]: any;
}
