export const API_ENDPOINT = "http://localhost:9999"

// export interface Response<T> {
//   success: boolean
//   data: T | null
//   message?: string
//   errorCode?: number
// }

export interface Response<T> {
  success?: boolean
  data: T | null
  message?: string
}