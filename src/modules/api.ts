import { RestAPI } from './rest';
import i18next from "i18next";

const isDev = !!window.location.host.match(/^(localhost|127\.|192\.)/) && false;
const backendUrl = isDev ? 'http://192.168.1.223:8004' : 'https://api.zoundo.com';
const API = new RestAPI(backendUrl, isDev);

API.setHeadersHandler((headers) => {
  headers['Accept-Language'] = i18next.language;
});

export { API, isDev, backendUrl };
