import { StateCreator } from "zustand"
import { AccountInfo } from "@models/common"

export interface AccountInfoSlice {
  accountInfo: AccountInfo
  saveAccountInfo: (payload: AccountInfo) => void
  removeAccountInfo: () => void
}

export const createAccountInfoSlice: StateCreator<AccountInfoSlice, [], [], AccountInfoSlice> = (set) => ({
  accountInfo: {
    userId: null,
    username: null,
    gmail: null,
    picture: null,
    role: null,
  },
  saveAccountInfo: (payload: AccountInfo) =>
    set(() => ({
      accountInfo: payload,
    })),
  removeAccountInfo: () =>
    set(() => ({
      accountInfo: {
        userId: null,
        username: null,
        gmail: null,
        picture: null,
        role: null,
      },
    })),
})
