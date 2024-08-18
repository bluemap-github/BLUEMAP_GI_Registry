import React from 'react';
import { useNavigate } from 'react-router-dom';
import {SIGN_IN, MY_MAIN, BROWSING} from './PageLinks';
import NavDropDown from './NavDropDown';
const Navbar = ({ userInfo }) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        sessionStorage.removeItem('itemDetails');
        sessionStorage.removeItem('REGISTRY_NAME');
        sessionStorage.removeItem('REGISTRY_URI');
        navigate(SIGN_IN); 
        window.location.reload();
    };
    const handleMyPage = () => {
        navigate(MY_MAIN);
        sessionStorage.removeItem('itemDetails');
        sessionStorage.removeItem('REGISTRY_NAME');
        sessionStorage.removeItem('REGISTRY_URI');
    };
    const gotoBrowse = () => {
        sessionStorage.removeItem('itemDetails');
        sessionStorage.removeItem('REGISTRY_NAME');
        sessionStorage.removeItem('REGISTRY_URI');
        navigate(BROWSING);
    }
    const goto_login = () => {
        navigate(SIGN_IN);
    }
    return (
        <nav style={{height: '100%'}}>
            <ul style={{display: 'flex', justifyContent: 'space-between', height: '100%'}}>
                <div style={{alignContent: 'center', fontSize: '23px', fontWeight:'bold', color: '#007bff'}}>BLUEMAP GI Registry</div>
                <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                    <li style={{marginRight: '5px', marginLeft: '5px'}}>
                        <button className='btn btn-outline-secondary' onClick={gotoBrowse}>Browsing registry</button>
                    </li>
                    {userInfo ? <></>:
                    <>
                        <li style={{marginRight: '5px', marginLeft: '5px'}}>
                            <button className='btn btn-outline-secondary' onClick={goto_login}>Log in</button>
                        </li>
                    </>}
                    {userInfo ? <NavDropDown userInfo={userInfo} /> : (<></>)}
                    
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;
