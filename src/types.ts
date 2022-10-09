export type ChromeMsg = {
    type: "encrypt" | "decrypt",
    data: string
}

export type TKeyStorage = {
    privKey: string
}
export const PRIV_STORAGE_KEY = "privKey"