import { ChromeMsg, PRIV_STORAGE_KEY, TKeyStorage } from "./types";

let privKey = ""
chrome.storage.local.get(PRIV_STORAGE_KEY).then((r) => {
    privKey = (r as TKeyStorage).privKey
})
chrome.runtime.onMessage.addListener(
    async function (message: ChromeMsg, sender, sendResponse) {
        switch (message.type) {
            case "getprivkey":
                sendResponse(privKey)
                break;
        }
    }
)
