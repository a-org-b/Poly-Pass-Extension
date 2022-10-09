import { ChromeMsg } from "./types";
const v = "1.0"
console.log("Starting WaSecure", v);

window.onload = () => {
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
            const msgElements = document.querySelectorAll<HTMLSpanElement>('div[data-testid="msg-container"] span[dir="ltr"] span')
            msgElements.forEach(e => {
                decryptText(e)
            })
        }
    });

}



function decryptText(ele: HTMLSpanElement) {
    if (ele.innerText.startsWith("__")) {

        chrome.runtime.sendMessage<ChromeMsg, string>({
            data: ele.innerText.substring(2),
            type: "decrypt"
        }, (decryptText) => {
            if (decryptText)
                ele.innerText = decryptText
        })
    }

}

function encryptAndSend() {
    const inputSpanEle = document.querySelector('div[role="textbox"] span.selectable-text.copyable-text') as HTMLSpanElement
    const div_contentEdit = document.querySelector('div[role="textbox"][data-testid="conversation-compose-box-input"]')
    chrome.runtime.sendMessage<ChromeMsg, string>({
        data: inputSpanEle.innerText,
        type: "encrypt"
    }, (encryptedText) => {
        var dT = null;
        try { dT = new DataTransfer(); } catch (e) { }
        var evt = new ClipboardEvent('paste', { clipboardData: dT });
        evt.clipboardData?.setData('text/plain', "__" + encryptedText);
        div_contentEdit?.dispatchEvent(evt)

        setTimeout(() => {
            const compose_btn = document.querySelector('button[data-testid="compose-btn-send"]') as HTMLButtonElement
            compose_btn.click()
        }, 100)
    })
}