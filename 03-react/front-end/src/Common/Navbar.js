import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { SIGN_IN, MY_MAIN, BROWSING } from './PageLinks';
import NavDropDown from './NavDropDown';

const Navbar = ({ userInfo }) => {
    const navigate = useNavigate();
    const gotoBrowse = () => {
        Cookies.remove('itemDetails'); // 아이템 세부사항을 쿠키에서 제거
        Cookies.remove('REGISTRY_NAME'); // 레지스트리 이름을 쿠키에서 제거
        Cookies.remove('REGISTRY_URI'); // 레지스트리 URI를 쿠키에서 제거
        navigate(BROWSING);
    };

    const goto_login = () => {
        navigate(SIGN_IN);
    };

    return (
        <nav style={{ height: '100%' }}>
            <ul style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ alignContent: 'center', fontSize: '23px', fontWeight: 'bold', color: '#007bff' }}>BLUEMAP GI Registry</div>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                    <li style={{ marginRight: '5px', marginLeft: '5px' }}>
                        <button className='btn btn-outline-secondary' onClick={gotoBrowse}>Browsing registry</button>
                    </li>
                    {userInfo ? <></> : (
                        <>
                            <li style={{ marginRight: '5px', marginLeft: '5px' }}>
                                <button className='btn btn-outline-secondary' onClick={goto_login}>Log in</button>
                            </li>
                        </>
                    )}
                    {userInfo ? <NavDropDown userInfo={userInfo} /> : (<></>)}
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;
