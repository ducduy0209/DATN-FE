import { StateCreator } from "zustand"
import { AuthInfo } from "@models/common"

export interface AuthInfoSlice {
  authInfo: AuthInfo
  saveAuthInfo: (payload: AuthInfo) => void
  removeAuthInfo: () => void
}

export const createAuthInfoSlice: StateCreator<AuthInfoSlice, [], [], AuthInfoSlice> = (set) => ({
  authInfo: {
    accessToken: null,
    refreshToken: null,
  },
  saveAuthInfo: (payload: AuthInfo) =>
    set(() => ({
      authInfo: payload,
    })),
  removeAuthInfo: () =>
    set(() => ({
      authInfo: {
        accessToken: null,
        refreshToken: null,
      },
    })),
})
