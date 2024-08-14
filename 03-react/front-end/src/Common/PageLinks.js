const URI = sessionStorage.getItem('REGISTRY_URI');

export const INTRO =  "/";
export const SIGN_IN =  "/user/signin";
export const SIGN_UP =  "/user/signup";
export const MY_MAIN =  "/user/mymain";
export const CREATE_REGI =  "/user/create-registry";

export const ERROR =  "/error";
export const RERI_HOME =  `/${URI}/home`;
export const CONCEPT_LIST =  `/${URI}/concept/list`;
export const CONCEPT_DETAIL =  `/${URI}/concept/detail`;
export const CREATE_ITEM =  `/${URI}/create`;
export const DDR_LIST =  `/${URI}/dataDictionary/list`;
export const DDR_DETAIL =  `/${URI}/dataDictionary/detail`;
export const PORTAYAL_LIST =  `/${URI}/portrayal/list`; 

export const ACCESS =  `/check-access`;
export const ENTER_REGI =(regi_uri)=> `/${regi_uri}`;
export const test_home =(regi_uri)=> `/${regi_uri}/home`;

export const BROWSING =  "/browsing";