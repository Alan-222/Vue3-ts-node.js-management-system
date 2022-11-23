import Cookies from 'js-cookie';

const TokenKey = 'Access-Token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

const RefreshTokenKey = 'Refresh-Token';

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey);
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token, { expires: 7 });
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey);
}
