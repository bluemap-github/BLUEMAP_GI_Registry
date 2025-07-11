import {DEPLOY_URL} from '../index.js'

// DataDictionary/DDR_List.js
export const GET_DDR_ITEM_LIST = `${DEPLOY_URL}/api/v1/ddr_item_list/get/`;
// DataDictionary/DDR_Detail.js
export const GET_DDR_VALUE_ONE = `${DEPLOY_URL}/api/v1/ddr_item_one/get/`;
export const POST_ENUMERATED_VALUE = `${DEPLOY_URL}/api/v1/enumerated_value/post/`;
export const POST_SIMPLE_ATTRIBUTE = `${DEPLOY_URL}/api/v1/simple_attribute/post/`;  
export const POST_ATTRIBUTE_CONSTRAINTS = `${DEPLOY_URL}/api/v1/attribute_constraints/post/`;
export const GET_ATTRIBUTE_CONSTRAINTS = `${DEPLOY_URL}/api/v1/attribute_constraints/get/`;
export const POST_COMPLEX_ATTRIBUTE = `${DEPLOY_URL}/api/v1/complex_attribute/post/`;
export const POST_FEATURE = `${DEPLOY_URL}/api/v1/feature/post/`;
export const POST_INFORMATION = `${DEPLOY_URL}/api/v1/information/post/`;


export const SEARCH_RELATED_ITEM = `${DEPLOY_URL}/api/v1/related_item/search/`;
export const SUB_ATT_LIST_SEARCH = `${DEPLOY_URL}/api/v1/sub_att_list_search/get/`;
export const POST_CONCEPT_ITEM = `${DEPLOY_URL}/api/v1/concept_item/item/post/`;

// DataDictionary/Update/DDRUpdate.js
export const PUT_ENUMERATED_VALUE = `${DEPLOY_URL}/api/v1/enumerated_value/put/`;
export const PUT_SIMPLE_ATTRIBUTE = `${DEPLOY_URL}/api/v1/simple_attribute/put/`;
export const PUT_COMPLEX_ATTRIBUTE = `${DEPLOY_URL}/api/v1/complex_attribute/put/`;
export const PUT_FEATURE = `${DEPLOY_URL}/api/v1/feature/put/`;
export const PUT_INFORMATION = `${DEPLOY_URL}/api/v1/information/put/`;
export const PUT_CONSTRAINT = `${DEPLOY_URL}/api/v1/attribute_constraints/put/`; 

// DataDictionary/Update/AssoUpdate.js
export const PUT_ASSOCIATED_ATTRIBUTE = `${DEPLOY_URL}/api/v1/associated_attribute/put/`;
export const PUT_SUB_ATTRIBUTE = `${DEPLOY_URL}/api/v1/sub_attribute/put/`;
export const PUT_DISTINCTION = `${DEPLOY_URL}/api/v1/distinction/put/`;

export const DELETE_CONSTRAINT = `${DEPLOY_URL}/api/v1/attribute_constraints/delete/`;


// IHO-dataDictionary
export const POST_CONCEPT_ITEM_IHO = `${DEPLOY_URL}/iho-integration/concept_item/post/`;
export const POST_MANAGEMENT_INFO_IHO = `${DEPLOY_URL}/iho-integration/concept_management_info/post/`;
export const POST_REFERENCE_SOURCE_IHO = `${DEPLOY_URL}/iho-integration/concept_reference_source/post/`;
export const POST_REFERENCE_IHO = `${DEPLOY_URL}/iho-integration/concept_reference/post/`;
export const POST_SIMPLE_ATTRIBUTE_IHO = `${DEPLOY_URL}/iho-integration/simple_attribute/post/`;
export const POST_COMPLEX_ATTRIBUTE_IHO = `${DEPLOY_URL}/iho-integration/complex_attribute/post/`;
export const POST_ENUMERATED_VALUE_IHO = `${DEPLOY_URL}/iho-integration/enumerated_value/post/`;
export const POST_FEATURE_IHO = `${DEPLOY_URL}/iho-integration/feature/post/`;
export const POST_INFORMATION_IHO = `${DEPLOY_URL}/iho-integration/information/post/`;

export const SEARCH_RELATED_ITEM_IHO = `${DEPLOY_URL}/iho-integration/related_item/search/`;