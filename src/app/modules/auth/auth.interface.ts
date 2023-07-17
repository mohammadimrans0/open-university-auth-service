export type ILoginUser = {
  id: string
  password: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
  needPasswordChange: boolean | undefined
}

export type IRefreshTokenResponse = {
  accessToken: string
}

export type IChangePassword = {
  password: string
  newPassword: string
}
