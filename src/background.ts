import { ChromeMsg } from "./types";

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener(
        async function (message: ChromeMsg, sender, sendResponse) {
            switch (message.type) {
                case "encrypt":
                    console.log("got data", message.data);
                    sendResponse("ancedata encrpytion max njoy")

                    break;
            }
        }
    )
})