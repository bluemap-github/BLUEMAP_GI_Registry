import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트

// Context 생성
export const ItemContext = createContext();

// Context Provider 컴포넌트
export const ItemProvider = ({ children }) => {
    // 쿠키에서 초기 상태 가져오기
    const getInitialItemDetails = () => {
        const savedItemDetails = Cookies.get('itemDetails');
        return savedItemDetails ? JSON.parse(savedItemDetails) : null;
    };

    // 초기 상태를 쿠키에서 불러오기
    const [itemDetails, setItemDetails] = useState(getInitialItemDetails);

    // itemDetails가 변경될 때마다 쿠키에 저장
    useEffect(() => {
        if (itemDetails) {
            Cookies.set('itemDetails', JSON.stringify(itemDetails), { expires: 7 }); // 쿠키 유효 기간 7일
        } else {
            Cookies.remove('itemDetails');
        }
    }, [itemDetails]);

    return (
        <ItemContext.Provider value={{ itemDetails, setItemDetails }}>
            {children}
        </ItemContext.Provider>
    );
};
