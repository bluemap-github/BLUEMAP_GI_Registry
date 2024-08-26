import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트

const IsOwnRegi = ({ children }) => {
    const role = Cookies.get('role'); // 쿠키에서 role을 가져옴

    // role이 없거나 guest일 경우 접근 제한
    if (!role || role === 'guest') {
        return <Navigate to="/notallowed" />;
    }

    return children; // role이 owner라면 자식 컴포넌트를 렌더링
};

export default IsOwnRegi;
