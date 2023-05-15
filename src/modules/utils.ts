import {backendUrl} from './api';
import {IAsset} from './rest';
import {Md5} from 'ts-md5';
import {availableLanguages} from "../i18n";

const thumb = (id: string, size: number) => {
  return `${backendUrl}/thumb/${size}/${id}`;
};

const formatNumber = (value: number, maximumFractionDigits: number = 0): string => {
  return value?.toLocaleString(undefined, {maximumFractionDigits});
};

const generatePassword = (length: number = 8) => {
  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};



const download = (file: IAsset, name?: string): void => {
  window.location.href = `${backendUrl}/assets/download/${file.id}${name ? `/${name}` : ''}`;
};

const range = (from: number, to: number): number[] => {
  const result: number[] = [];
  for (let i = from; i <= to; i++) result.push(i);
  return result;
};

const monthRange = (): string[] => {
  return range(1, 12).map((v) => (v < 10 ? '0' : '') + v);
};

const getStringColor = (str: string): string => {
  return `#${Md5.hashStr(str).substring(0, 6)}`;
};

const views = (value: number): string => {
  if (value < 1000) return value.toString();
  if (value < 1_000_000) {
    let res = (value / 1000).toFixed(1);
    res = res.replace(/\.0$/, '');
    return `${res}k`;
  }
  let res = (value / 1_000_000).toFixed(1);
  res = res.replace(/\.0$/, '');
  return `${res}m`;
}

export const getLang = (ln?: string) => {
  //@ts-ignore
  if (!ln) ln = localStorage.getItem('ln') || (window?.navigator?.userLanguage || window.navigator.language).substring(0, 2);
  const rusList = ['ru', 'uk', 'kk', 'be', 'az', 'lv', 'ee', 'tr', 'ka', 'hy', 'uz', 'mo', 'bg'];
  if (rusList.includes(ln || '')) ln = 'ru';
  ln = availableLanguages.includes(ln!) ? ln : 'en';
  return ln;
}

export {
  thumb,
  formatNumber,
  generatePassword,
  download,
  range,
  monthRange,
  getStringColor,
  views
};
