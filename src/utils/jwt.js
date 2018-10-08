import jwtDecode from 'jwt-decode';

export default function parseJWT(jwtToken) {
  return jwtDecode(jwtToken);
}
