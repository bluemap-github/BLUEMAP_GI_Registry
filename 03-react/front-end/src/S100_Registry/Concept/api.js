import {DEPLOY_URL} from '../index.js'
import {USER_SERIAL} from '../../userSerial.js'

// Concept > Test.js
export const MONGO_DB_POST  = `${DEPLOY_URL}/api/v1/sample_post/`;
export const MONGO_DB_GET_ALL  = `${DEPLOY_URL}/api/v1/get_student_list/`;

// Concept > Register.js
// export const REGISTER_ITEM_LIST_URL = `${DEPLOY_URL}/api/v1/1/itemList/`;
export const REGISTER_ITEM_LIST_URL = `${DEPLOY_URL}/api/v1/concept_item_list/get/${USER_SERIAL}/`;

// Concept > Detail > Detail.js
// export const ITEM_DETAIL_URL = `${DEPLOY_URL}/api/v1/registerItem/`;
export const ITEM_DETAIL_URL = `${DEPLOY_URL}/api/v1/concept_item/get/`;

// Concept > Insert > Item.js
// export const CREATE_ITEM_URL = `${DEPLOY_URL}/api/v1/registerItem/1/post/`;
export const CREATE_ITEM_URL = `${DEPLOY_URL}/api/v1/concept_item/post/`;

// Concept > Detail > modals > Add > MIAdd.js
// Concept > Insert > Item.js
export const CREATE_MANAGEMENT_INFO_URL = (itemId) => {
    // return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/managementInfo/post/`;
    return `${DEPLOY_URL}/api/v1/concept_item/mamagement_info/post/${itemId}/`;
};

// Concept > Detail > modals > Add > RSAdd.js
// Concept > Insert > Item.js
export const CREATE_REFERENCE_SOURCE_URL  = (itemId) => {
    // return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/referenceSource/post/`;
    return `${DEPLOY_URL}/api/v1/concept_item/reference_source/post/${itemId}/`;
};

// Concept > Detail > modals > Add >RAdd.js
// Concept > Insert > Item.js
export const CREATE_REFERENCE_URL  = (itemId) => {
    // return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/reference/post/`;
    return `${DEPLOY_URL}/api/v1/concept_item/reference/post/${itemId}/`;
};

// Concept > Detail > modals > Update > IUpdate.js
export const PUT_ITEM_URL = (itemId) => {
    // return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/put/`;
    return `${DEPLOY_URL}/api/v1/concept_item/put/${itemId}/`;
};

// Concept > Detail > modals > Update > MIUpdate.js
export const PUT_MI_URL = (MIId) => {
    // return `${DEPLOY_URL}/api/v1/registerItem/managementInfo/${MIId}/put/`;
    return `${DEPLOY_URL}/api/v1/concept_item/mamagement_info/put/${MIId}/`;
};

// Concept > Detail > modals > Update > RSUpdate.js
export const PUT_RS_URL = (RSId) => {
    return `${DEPLOY_URL}/api/v1/concept_item/reference_source/put/${RSId}/`;
};


// Concept > Detail > modals > Update > RUpdate.js
export const PUT_R_URL = (RId) => {
    // return `${DEPLOY_URL}/api/v1/registerItem/reference/${RId}/put/`;
    return `${DEPLOY_URL}/api/v1/concept_item/reference/put/${RId}/`;
};


// Concept > Detail > modals > Base.js
// Concept > Register.js
export const DEL_ITEM_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/concept_item/delete/${idx}/`;
};

// Concept > Detail > modals > Base.js
export const DEL_MI_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/concept_item/mamagement_info/delete/${idx}/`;
};
export const DEL_RS_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/concept_item/reference_source/delete/${idx}/`;
};
export const DEL_R_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/concept_item/reference/delete/${idx}/`;
};






