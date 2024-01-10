import * as dotenv from 'dotenv'
export const ENVIROMENT = process.env.NODE_ENV || 'development'
// Get enviroment path
export const enviromentPath = `.env.${ENVIROMENT}`
dotenv.config({
	path: enviromentPath
})

export const PORT = process.env.PORT || 3000
export const DATABASE_URL = process.env.DATABASE_URL
// Redis

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
export const REDIS_USERNAME = process.env.REDIS_USERNAME
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_URL = process.env.REDIS_URL

// JWT
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME =
	process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME =
	process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
export const JWT_OTHERS_TOKEN_EXPIRATION_TIME =
	process.env.JWT_OTHERS_TOKEN_EXPIRATION_TIME

export const JWT_OTHERS_TOKEN_PRIVATE_KEY =
	process.env.JWT_OTHERS_TOKEN_PRIVATE_KEY
export const JWT_OTHERS_TOKEN_PUBLIC_KEY =
	process.env.JWT_OTHERS_TOKEN_PUBLIC_KEY

export const JWT_ACCESS_TOKEN_PRIVATE_KEY =
	process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY
export const JWT_ACCESS_TOKEN_PUBLIC_KEY =
	process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
export const JWT_REFRESH_TOKEN_PRIVATE_KEY =
	process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY
export const JWT_REFRESH_TOKEN_PUBLIC_KEY =
	process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY

export const PROTOCOL = process.env.PROTOCOL || 'http'
export const FRONT_END_DOMAIN = process.env.FRONT_END_HOST || 'localhost:4000'
export const BACK_END_DOMAIN = process.env.BACK_END_HOST || 'localhost:3000'
export const FRONT_END_URL =
	process.env.PROTOCOL + '://' + process.env.FRONT_END_HOST
export const BACK_END_URL =
	process.env.PROTOCOL + '://' + process.env.BACK_END_HOST

export const SUCCESS_OAUTH_LOGIN_PAGE_URL =
	FRONT_END_URL + process.env.SUCCESS_OAUTH_LOGIN_PATH

export const FE_VERIFICATION_URL = FRONT_END_DOMAIN + '/auth/verify-email'
export const FE_RESET_PASSWORD_URL = FRONT_END_DOMAIN + '/auth/reset-password'
export const FE_INVITE_TO_COURSE_URL = FRONT_END_DOMAIN + '/invite-course'
// Email

export const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY
// OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export const GOOGLE_CALLBACK_URL =
	BACK_END_URL + process.env.GOOGLE_CALLBACK_URL

export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET
export const FACEBOOK_CALLBACK_URL =
	BACK_END_URL + process.env.FACEBOOK_CALLBACK_URL

export const APP_LOGO = process.env.APP_LOGO
