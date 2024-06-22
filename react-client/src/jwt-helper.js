// tokenHelper.js
import {jwtDecode} from 'jwt-decode';


export const saveUser = (token) => {
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.removeItem('token');
};


export const getToken = () => {
  return localStorage.getItem('token');
};


export const isTokenExpired = () => {
  const token = getToken();
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return true;
  }
};


export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && !isTokenExpired();
};
