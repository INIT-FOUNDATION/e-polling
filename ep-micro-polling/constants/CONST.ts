import { envUtils } from "ep-micro-common";

export const allowed_headers =
  "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-ip";

export const CONFIG =  {
  REDIS_EXPIRE_TIME_PWD: 28800,
  SHA256_PVT_KEY: "EP_2024"
}

export const DEFAULT_PASSWORD = "EP123!@#";

export const OBJECT_STORAGE_BUCKET = envUtils.getStringEnvVariableOrDefault("EP_OBJECT_STORAGE_BUCKET", "lta-dev");

export const WEBSITE_URL = envUtils.getStringEnvVariableOrDefault("EP_WEBSITE_URL", "http://localhost:4200");