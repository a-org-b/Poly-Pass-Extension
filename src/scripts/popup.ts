import { PRIV_STORAGE_KEY, TKeyStorage } from "../types";

const privateKey = "";



const privKey_h3 = document.getElementById("privKeyText")
const privKey_input = document.getElementById("privKeyInput") as HTMLInputElement
const set_btn = document.getElementById("setBtn")

set_btn?.addEventListener("click", () => {
    const tKeyStorage: TKeyStorage = {
        privKey: privKey_input.value
    }
    chrome.storage.local.set(tKeyStorage)
})
chrome.storage.local.get(PRIV_STORAGE_KEY).then((r) => {
    if (privKey_h3)
        privKey_h3.innerText = (r as TKeyStorage).privKey
})