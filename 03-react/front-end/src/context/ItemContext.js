import React, { createContext, useState } from 'react';

// Context 생성
export const ItemContext = createContext();

// Context Provider 컴포넌트
export const ItemProvider = ({ children }) => {
    const [itemDetails, setItemDetails] = useState(null);

    return (
        <ItemContext.Provider value={{ itemDetails, setItemDetails }}>
            {children}
        </ItemContext.Provider>
    );
};