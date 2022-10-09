export type ChromeMsg = {
    type: "getprivkey",
    data: string
}

export type TKeyStorage = {
    privKey: string
}
export const PRIV_STORAGE_KEY = "privKey"