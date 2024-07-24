
import CryptoJS from "crypto-js";

export const allowed_headers =
  "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip";

export const CACHE_TTL = {
  SHORT: 15 * 60,
  MID: 60 * 60,
  PAYMENT_LINK: 2 * 60 * 30,
  LONG: 24 * 60 * 60,
};

export const CONFIG =  {
  REDIS_EXPIRE_TIME_PWD: 28800,
  SHA256_PVT_KEY: "EP_2024"
}

export const ROLES_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2
}

export const USERS_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2,
  LOCKED: 3,
  LOGGED_IN: 4,
  LOGGED_OUT: 5
}

export const GENDER = {
  MALE: 1,
  FEMALE: 2,
  OTHERS: 3
}

export const MENUS_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2
}

export const DEPARTMENTS_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2
}

export const APP_VERSION_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  UNDER_MAINTENANCE: 2
}

export const GRID_DEFAULT_OPTIONS = {
  PAGE_SIZE: 50,
  CURRENT_PAGE: 1
}

export const USER_REPORTING_ASSOCIATION_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1
}

export const DEFAULT_PASSWORD = "OWA123!@#";

export const decryptPayload = function (reqData: string) {
  if (reqData) {
    let bytes = CryptoJS.AES.decrypt(reqData, "OWA@$#&*(!@%^&");
    return bytes.toString(CryptoJS.enc.Utf8);
  } else {
    return "";
  }
};