import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getDecryptedItem } from "../cryptoComponent/storageUtils";

const CheckRole = ({ children }) => {
    const role = getDecryptedItem('role');
    const location = useLocation(); // 현재 경로에 접근

    // role 쿠키가 없을 경우 리디렉션 처리
    if (!role) {
        // 현재 경로에서 "/dataDictionary/list" 같은 세부 경로를 제거
        const baseUri = location.pathname.split('/').slice(0, 2).join('/');

        // 예를 들어 "/0819test-regi"로 리디렉션
        return <Navigate to={baseUri} />;
    }

    // role 쿠키가 있는 경우에는 자식 컴포넌트를 렌더링
    return children;
};

export default CheckRole;
