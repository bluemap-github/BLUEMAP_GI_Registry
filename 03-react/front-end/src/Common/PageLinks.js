const URI = sessionStorage.getItem('REGISTRY_URI');

export const INTRO =  "/";
export const SIGN_IN =  "/user/signin";
export const SIGN_UP =  "/user/signup";
export const MY_MAIN =  "/user/mymain";
export const CREATE_REGI =  "/user/create-registry";

export const ERROR =  "/error";
// export const RERI_HOME =  `/${sessionStorage.getItem('REGISTRY_URI')}`;
// export const CONCEPT_LIST =  `/${sessionStorage.getItem('REGISTRY_URI')}/concept/list`;
// export const CONCEPT_DETAIL =  `/${sessionStorage.getItem('REGISTRY_URI')}/concept/detail`;
// export const CREATE_ITEM =  `/${sessionStorage.getItem('REGISTRY_URI')}/create`;
// export const DDR_LIST =  `/${sessionStorage.getItem('REGISTRY_URI')}/dataDictionary/list`;
// export const DDR_DETAIL =  `/${sessionStorage.getItem('REGISTRY_URI')}/dataDictionary/detail`;
// export const PORTAYAL_LIST =  `/${sessionStorage.getItem('REGISTRY_URI')}/portrayal/list`; 

export const ACCESS =  `/check-access`;
export const ENTER_REGI =(regi_uri)=> `/${regi_uri}`;
export const test_home =(regi_uri)=> `/${regi_uri}/home`;

export const BROWSING =  "/browsing";