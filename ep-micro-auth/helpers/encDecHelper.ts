import CryptoJS from "crypto-js";

export const decryptPayload = function (reqData: string): string {
    if (reqData) {
        let bytes = CryptoJS.AES.decrypt(reqData, "EP@$#&*(!@%^&");
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return "";
    }
};