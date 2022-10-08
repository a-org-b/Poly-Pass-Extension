
const privateKey = "";

const PRIV_STORAGE_KEY = "PRIVATE_KEY"

type keyStorage = {
    privKey: string
}
const privKey_h3 = document.getElementById("privKey")
chrome.storage.local.get(PRIV_STORAGE_KEY).then((r) => {
    if (privKey_h3)
        privKey_h3.innerText = (r as keyStorage).privKey
})