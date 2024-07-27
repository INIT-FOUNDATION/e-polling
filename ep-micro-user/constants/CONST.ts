import { envUtils } from "ep-micro-common";

export const allowed_headers =
  "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip";

export const OBJECT_STORAGE_BUCKET = envUtils.getStringEnvVariableOrDefault("EP_OBJECT_STORAGE_BUCKET", "lta-dev");