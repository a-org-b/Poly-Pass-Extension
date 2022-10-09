import { ChromeMsg, PRIV_STORAGE_KEY, TKeyStorage } from "./types";
import CryptoJS from "crypto-js"
// Encrypt

// Decrypt


let privKey = ""
chrome.storage.local.get(PRIV_STORAGE_KEY).then((r) => {
    privKey = (r as TKeyStorage).privKey
})
chrome.runtime.onMessage.addListener(
    async function (message: ChromeMsg, sender, sendResponse) {
        switch (message.type) {
            case "encrypt":
                var ciphertext = CryptoJS.AES.encrypt(message.data, privKey).toString();
                sendResponse(ciphertext)
                break;

            case "decrypt":
                console.log("decryption in progress");
                var bytes = CryptoJS.AES.decrypt(message.data, privKey);
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                sendResponse(originalText)
                break;
        }
    }
)
