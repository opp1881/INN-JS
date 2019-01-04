export interface IDecodedJwt {
  sub: string;
  jti: string;
  iss: string;
  aud: string;
  iat: number;
  userticket: string;
  applicationName: string;
  applicationId: string;
  roles: any[];
  exp: number;
}
