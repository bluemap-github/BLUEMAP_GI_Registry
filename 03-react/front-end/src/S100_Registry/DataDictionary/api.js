import {DEPLOY_URL} from '../index.js'
import {USER_SERIAL} from '../../userSerial.js'

export const GET_ENUMERATED_VALUE_LIST = `${DEPLOY_URL}/api/v1/enumerated_value_list/get/${USER_SERIAL}/`;

export const GET_SIMPLE_ATTRIBUTE_LIST = `${DEPLOY_URL}/api/v1/simple_attribute_list/get/${USER_SERIAL}/`;