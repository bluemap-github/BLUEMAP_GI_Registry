const DEPLOY_URL = 'hjk0815.pythonanywhere.com';
// const DEPLOY_URL = '127.0.0.1:8000';

// S100_Registry > Register.js
export const REGISTER_ITEM_LIST_URL = `https://${DEPLOY_URL}/api/v1/register/1/itemList/`;

// S100_Registry > Detail > Detail.js
export const ITEM_DETAIL_URL = `https://${DEPLOY_URL}/api/v1/registerItem/`;

// S100_Registry > Insert > Item.js
export const CREATE_ITEM_URL = `https://${DEPLOY_URL}/api/v1/registerItem/1/post/`;

// S100_Registry > Detail > modals > Add > MIAdd.js
// S100_Registry > Insert > Item.js
export const CREATE_MANAGEMENT_INFO_URL = (itemId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/${itemId}/managementInfo/post/`;
};

// S100_Registry > Detail > modals > Add > RSAdd.js
// S100_Registry > Insert > Item.js
export const CREATE_REFERENCE_SOURCE_URL  = (itemId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

// S100_Registry > Detail > modals > Add >RAdd.js
// S100_Registry > Insert > Item.js
export const CREATE_REFERENCE_URL  = (itemId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/${itemId}/reference/post/`;
};

// S100_Registry > Detail > modals > Update > IUpdate.js
export const PUT_ITEM_URL = (itemId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/${itemId}/put/`;
};

// S100_Registry > Detail > modals > Update > MIUpdate.js
export const PUT_MI_URL = (MIId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/managementInfo/${MIId}/put/`;
};

// S100_Registry > Detail > modals > Update > RSUpdate.js
export const PUT_RS_URL = (RSId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/referenceSource/${RSId}/put/`;
};


// S100_Registry > Detail > modals > Update > RUpdate.js
export const PUT_R_URL = (RId) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/reference/${RId}/put/`;
};


// S100_Registry > Detail > modals > Base.js
// S100_Registry > Register.js
export const DEL_ITEM_URL  = (idx) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/${idx}/delete/`;
};

// S100_Registry > Detail > modals > Base.js
export const DEL_MI_URL  = (idx) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/managementInfo/${idx}/delete/`;
};
export const DEL_RS_URL  = (idx) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/referenceSource/${idx}/delete/`;
};
export const DEL_R_URL  = (idx) => {
    return `https://${DEPLOY_URL}/api/v1/registerItem/reference/${idx}/delete/`;
};



export const TEST = (itemId) => {
    return `안녕 ${itemId}`;
};