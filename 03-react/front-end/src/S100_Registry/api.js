// S100_Registry > Register.js
export const REGISTER_ITEM_LIST_URL = 'https://hjk0815.pythonanywhere.com/api/v1/register/1/itemList/';

// S100_Registry > Detail > Detail.js
export const ITEM_DETAIL_URL = 'https://hjk0815.pythonanywhere.com/api/v1/registerItem/';

// S100_Registry > Insert > Item.js
export const CREATE_ITEM_URL = 'https://hjk0815.pythonanywhere.com/api/v1/registerItem/1/post/';

// S100_Registry > Detail > modals > Add > MIAdd.js
// S100_Registry > Insert > Item.js
export const CREATE_MANAGEMENT_INFO_URL = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/managementInfo/post/`;
};

// S100_Registry > Detail > modals > Add > RSAdd.js
// S100_Registry > Insert > Item.js
export const CREATE_REFERENCE_SOURCE_URL  = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

// S100_Registry > Detail > modals > Add >RAdd.js
// S100_Registry > Insert > Item.js
export const CREATE_REFERENCE_URL  = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/reference/post/`;
};

// // S100_Registry > Detail > modals > Update > IUpdate.js
// export const  = '';

// // S100_Registry > Detail > modals > Update > MIUpdate.js
// export const  = '';

// // S100_Registry > Detail > modals > Update > RSUpdate.js
// export const  = '';

// // S100_Registry > Detail > modals > Update > RUpdate.js
// export const  = '';

// // S100_Registry > Detail > modals > Base.js
// export const  = '';
// export const  = '';
// export const  = '';
// export const  = '';

// // S100_Registry > Insert > Item.js
// export const  = '';
// export const  = '';
// export const  = '';

// // S100_Registry > Register.js
// export const  = '';

//
export const TEST = (itemId) => {
    return `안녕 ${itemId}`;
};