import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INTRO } from './PageLinks';
const NotAllowed = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate(INTRO);
    }
    return (
        <div>
            <h1>Not Allowed</h1>
            <p>해당 레지스트리에 접근권한이 없습니다.</p>
            <button onClick={goToHome}>back to my page</button>
        </div>
    );
};

export default NotAllowed;