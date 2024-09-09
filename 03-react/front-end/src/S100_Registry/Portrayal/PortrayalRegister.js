import React, { useState } from 'react';
import PR_List from './Read/PR_List';
import PR_Filter from './Read/FilterComponents/PR_Filter';

const PortrayalRegister = () => {
    const [viewType, setViewType] = useState('SymbolSchema'); // 현재 선택된 viewType 상태

    const clickHandler = (viewType) => {
        setViewType(viewType); // 새로운 viewType을 상태로 저장
    };

    return (
        <>
            <div>
                <PR_Filter clickHandler={clickHandler} viewType={viewType} /> {/* viewType prop 전달 */}
            </div>
            <div>
                <PR_List viewType={viewType}/>
            </div>
        </>
    );
};

export default PortrayalRegister;
