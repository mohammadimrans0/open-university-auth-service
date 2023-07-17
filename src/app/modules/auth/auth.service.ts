import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { User } from '../user/user.model'
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface'
import { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import { jwtHelper } from '../../../helpers/jwtHelper'

// login user

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload

  const user = new User()

  const isUserExist = await user.isUserExist(id)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !user.isPasswordMatched(password, isUserExist?.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password do not match')
  }

  // create access token and refresh token
  const { id: userId, role, needPasswordChange } = isUserExist

  const accessToken = jwtHelper.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  const refreshToken = jwtHelper.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return { accessToken, refreshToken, needPasswordChange }
}

// refresh token

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  const user = new User()

  let verifiedToken = null

  // verify token
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    )
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token')
  }

  const { userId } = verifiedToken

  // checking deleted user refresh token
  const isUserExist = await user.isUserExist(userId)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // generate new token
  const newAccessToken = jwtHelper.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  return { accessToken: newAccessToken }
}

// change password

const changePassword = async (
  userDetail: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const user = new User()

  const { password, newPassword } = payload

  const isUserExist = await User.findOne({ id: userDetail?.userId }).select(
    '+password'
  )

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await user.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect')
  }

  // data update
  isUserExist.password = newPassword
  isUserExist.needPasswordChange = false

  // updating using save()
  isUserExist.save()
}

export const AuthService = { loginUser, refreshToken, changePassword }
