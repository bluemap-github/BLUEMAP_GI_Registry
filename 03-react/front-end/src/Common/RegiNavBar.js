import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { SIGN_IN, MY_MAIN, BROWSING } from './PageLinks';
import NavDropDown from './NavDropDown';

const RegiNavBar = ({ userInfo }) => {
    const navigate = useNavigate();
    const gotoBrowse = () => {
        Cookies.remove('itemDetails'); // 아이템 세부사항을 쿠키에서 제거
        Cookies.remove('REGISTRY_NAME'); // 레지스트리 이름을 쿠키에서 제거
        Cookies.remove('REGISTRY_URI'); // 레지스트리 URI를 쿠키에서 제거
        navigate("/main/browsing");
    };

    const goto_login = () => {
        navigate(SIGN_IN);
    };

    return (
        <nav className='nav-inner'>
            <div style={{ display: 'flex', alignItems: 'center'}}>
                <div style={{ fontSize: '23px', fontWeight: 'bold', color: '#007bff', marginLeft: '10px'}}>레지스트리 이름</div>                
            </div>
            <div style={{height: '100%', alignContent: 'center', marginRight: '10px'}}>
                {userInfo ? <></> : (
                    <button className='btn btn-outline-secondary' onClick={goto_login}>Log in</button>
                )}
                {userInfo ? <NavDropDown userInfo={userInfo} /> : (<></>)}
            </div>
        </nav>
    );
}

export default RegiNavBar;
