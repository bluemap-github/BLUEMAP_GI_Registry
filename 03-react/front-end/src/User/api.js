import {DEPLOY_URL} from './index.js'

export const CHECK_EMAIL = `${DEPLOY_URL}/user/check-email/`;
export const SIGN_UP = `${DEPLOY_URL}/user/signup/`;
export const SIGN_IN = `${DEPLOY_URL}/user/login/`;
export const CHECK_AUTH = `${DEPLOY_URL}/user/check-auth/`;
export const LOG_OUT = `${DEPLOY_URL}/user/logout/`;
export const POST_REGISTRY = `${DEPLOY_URL}/api/v1/concept_register/post/`;
export const GET_REGISTRY_DETAIL = `${DEPLOY_URL}/api/v1/concept_register/get/`;
export const GET_OWN_REGISTRIES = `${DEPLOY_URL}/user/registery_list/get/`;
export const GET_REGI_INFO_FOR_GUEST = `${DEPLOY_URL}/api/v1/register_info_for_guest/get/`;