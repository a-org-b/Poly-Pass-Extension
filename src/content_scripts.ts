import { ChromeMsg } from "./types";

console.table("Starting WaSecure");


chrome.runtime.sendMessage<ChromeMsg, string>({
    data: "max",
    type: "encrypt"
}, (r) => console.log)