import { IDeviceDetails } from "../types/custom";
import { Request } from "express";

export const appendClientDetailsInRequest = (req: Request): IDeviceDetails => {
    return {
        deviceType: req.headers['uo-device-type'] as string || '',
        deviceOs: req.headers['uo-os'] as string || '',
        deviceOsVersion: req.headers['uo-os-version'] as string || '',
        isMobile: req.headers['uo-is-mobile'] ?  Boolean(req.headers['uo-is-mobile']) : false,
        isTablet: req.headers['uo-is-tablet'] ? Boolean(req.headers['uo-is-tablet']) : false,
        isDesktop: req.headers['uo-is-desktop'] ? Boolean(req.headers['uo-is-desktop']) : false,
        browserVersion: req.headers['uo-browser-version'] as string || '',
        browserName: req.headers['uo-browser'] as string || '',
        clientIp: req.headers['uo-client-ip'] as string || ''
    };
}