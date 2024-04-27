export interface  AccountInfo {
  userId: string | null
  username: string | null
  gmail: string | null
  picture: string | null
  role: string | null
}

export interface AuthInfo {
  accessToken: string | null
  refreshToken: string | null
}

export enum ROLE_ACCOUNT {
  GUEST = 0,
  CUSTOMER = 1,
  BOOSTER = 2,
  MANAGER = 3,
  ADMIN = 4
}
