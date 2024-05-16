import {DEPLOY_URL} from '../index.js'

// Concept > Test.js
export const MONGO_DB_POST  = `${DEPLOY_URL}/api/v1/sample_post/`;
export const MONGO_DB_GET_ALL  = `${DEPLOY_URL}/api/v1/sample_get/`;

// Concept > Register.js
export const REGISTER_ITEM_LIST_URL = `${DEPLOY_URL}/api/v1/register/1/itemList/`;

// Concept > Detail > Detail.js
export const ITEM_DETAIL_URL = `${DEPLOY_URL}/api/v1/registerItem/`;

// Concept > Insert > Item.js
export const CREATE_ITEM_URL = `${DEPLOY_URL}/api/v1/registerItem/1/post/`;

// Concept > Detail > modals > Add > MIAdd.js
// Concept > Insert > Item.js
export const CREATE_MANAGEMENT_INFO_URL = (itemId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/managementInfo/post/`;
};

// Concept > Detail > modals > Add > RSAdd.js
// Concept > Insert > Item.js
export const CREATE_REFERENCE_SOURCE_URL  = (itemId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

// Concept > Detail > modals > Add >RAdd.js
// Concept > Insert > Item.js
export const CREATE_REFERENCE_URL  = (itemId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/reference/post/`;
};

// Concept > Detail > modals > Update > IUpdate.js
export const PUT_ITEM_URL = (itemId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/${itemId}/put/`;
};

// Concept > Detail > modals > Update > MIUpdate.js
export const PUT_MI_URL = (MIId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/managementInfo/${MIId}/put/`;
};

// Concept > Detail > modals > Update > RSUpdate.js
export const PUT_RS_URL = (RSId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/referenceSource/${RSId}/put/`;
};


// Concept > Detail > modals > Update > RUpdate.js
export const PUT_R_URL = (RId) => {
    return `${DEPLOY_URL}/api/v1/registerItem/reference/${RId}/put/`;
};


// Concept > Detail > modals > Base.js
// Concept > Register.js
export const DEL_ITEM_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/registerItem/${idx}/delete/`;
};

// Concept > Detail > modals > Base.js
export const DEL_MI_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/registerItem/managementInfo/${idx}/delete/`;
};
export const DEL_RS_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/registerItem/referenceSource/${idx}/delete/`;
};
export const DEL_R_URL  = (idx) => {
    return `${DEPLOY_URL}/api/v1/registerItem/reference/${idx}/delete/`;
};





