import parseJwt from './jwt';

const validToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MTIzNDU2NyIsIm5hbWUiOiJUb3JlIFRlc3RicnVrZXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTUxNjIzOTAyMn0.0am62xZC1CAadIufN8VRlGSZe594oJBOeVEsgvoQxfqkeS2ESpqmnP498lve0vYS3par_iZz3PqelRmSc2T06U1kuyfLRWKJcCwUY3a_D3Xs_e6tP5sigM-dMjxmYIYvj-_Ni28ia-hzCUV8LRoTx-pXpSJlp89CrJrRkpJkZGE';

const invalidToken = 'ey123.ey4569djaisl';

describe('jwt', () => {
  describe('decodeJwt', () => {
    it('should decode a token', () => {
      expect(parseJwt(validToken)).toEqual({
        sub: '91234567',
        name: 'Tore Testbruker',
        admin: false,
        iat: 1516239022
      });
    });

    it('should throw error when unable to decode token', () => {
      expect(parseJwt(invalidToken)).toEqual(null);
    });
  });
});
