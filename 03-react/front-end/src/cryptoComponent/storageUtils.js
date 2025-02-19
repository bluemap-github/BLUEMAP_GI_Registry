import CryptoJS from "crypto-js";

// 🔐 .env에서 가져온 SECRET_KEY (없으면 기본값 설정)
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "default-fallback-key";  

// 데이터 저장 (AES 암호화)
export const setEncryptedItem = (key, value) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
    sessionStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error("Error encrypting data:", error);
  }
};

// 데이터 가져오기 (AES 복호화)
export const getDecryptedItem = (key) => {
  try {
    const encryptedData = sessionStorage.getItem(key);
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

// 데이터 삭제
export const removeEncryptedItem = (key) => {
  sessionStorage.removeItem(key);
};
