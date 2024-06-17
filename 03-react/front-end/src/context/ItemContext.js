import React, { createContext, useState, useEffect } from 'react';

// Context 생성
export const ItemContext = createContext();

// Context Provider 컴포넌트
export const ItemProvider = ({ children }) => {
    // 세션 스토리지에서 초기 상태 가져오기
    const getInitialItemDetails = () => {
        const savedItemDetails = sessionStorage.getItem('itemDetails');
        return savedItemDetails ? JSON.parse(savedItemDetails) : null;
    };

    // 초기 상태를 세션 스토리지에서 불러오기
    const [itemDetails, setItemDetails] = useState(getInitialItemDetails);

    // itemDetails가 변경될 때마다 세션 스토리지에 저장
    useEffect(() => {
        if (itemDetails) {
            sessionStorage.setItem('itemDetails', JSON.stringify(itemDetails));
        } else {
            sessionStorage.removeItem('itemDetails');
        }
    }, [itemDetails]);

    return (
        <ItemContext.Provider value={{ itemDetails, setItemDetails }}>
            {children}
        </ItemContext.Provider>
    );
};
