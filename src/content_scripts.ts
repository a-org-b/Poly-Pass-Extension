import { PRIV_STORAGE_KEY, TKeyStorage } from "./types";
const v = "1.0"
console.log("Starting WaSecure", v);
import CryptoJS from "crypto-js"

window.onload = () => {
    if (!window.location.href.startsWith("https://web.whatsapp.com/")) {
        return
    };

    chrome.storage.local.get(PRIV_STORAGE_KEY).then((r) => {
        privKey = (r as TKeyStorage).privKey
    })


    const newComposeBtn = document.createElement("button")
    newComposeBtn.innerText = "Compose"
    newComposeBtn.style.position = "fixed"
    newComposeBtn.style.right = "4%"
    newComposeBtn.style.bottom = "4%"
    newComposeBtn.style.zIndex = "100"
    newComposeBtn.addEventListener("click", encryptAndSend)
    document.body.appendChild(newComposeBtn)

    MutationObserver = window.MutationObserver;

    var observer = new MutationObserver(documentChanged);

    observer.observe(document, {
        subtree: true,
        childList: true
    });
}

const documentChanged: MutationCallback = (a, b) => {
    a.forEach(element => {
        if (element.addedNodes.length || element.removedNodes.length) {
            const msgElements = document.querySelectorAll<HTMLSpanElement>('span[dir="ltr"].selectable-text.copyable-text span')
            msgElements.forEach(e => {
                decryptText(e)
            })
        }
    });

}
let privKey = ""

function decryptText(ele: HTMLSpanElement) {
    if (ele.innerText.startsWith("__") && privKey.length) {
        const bytes = CryptoJS.AES.decrypt(ele.innerText.substring(2), privKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText) ele.innerText = originalText
    }
}

function encryptAndSend() {
    const inputSpanEle = document.querySelector('div[role="textbox"] span.selectable-text.copyable-text') as HTMLSpanElement
    const div_contentEdit = document.querySelector('div[role="textbox"][data-testid="conversation-compose-box-input"]')
    var ciphertext = CryptoJS.AES.encrypt(inputSpanEle.innerText, privKey).toString();
    var dT = null;
    try { dT = new DataTransfer(); } catch (e) { }
    var evt = new ClipboardEvent('paste', { clipboardData: dT });
    evt.clipboardData?.setData('text/plain', "__" + ciphertext);
    div_contentEdit?.dispatchEvent(evt)

    setTimeout(() => {
        const compose_btn = document.querySelector('button[data-testid="compose-btn-send"]') as HTMLButtonElement
        compose_btn.click()
    }, 100)

}