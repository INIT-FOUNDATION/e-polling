export const allowed_headers =
  "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip";

export const CACHE_TTL = {
  SHORT: 15 * 60,
  MID: 60 * 60,
  PAYMENT_LINK: 2 * 60 * 30,
  LONG: 24 * 60 * 60,
};

export const GENDER = {
  MALE: 1,
  FEMALE: 2,
  OTHERS: 3
}
