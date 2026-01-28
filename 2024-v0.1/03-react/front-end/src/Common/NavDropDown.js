import Dropdown from 'react-bootstrap/Dropdown';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { SIGN_IN } from './PageLinks';

function NavDropDown({ userInfo }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt')
        Cookies.remove('itemDetails'); // 아이템 세부사항을 쿠키에서 제거
        Cookies.remove('REGISTRY_NAME'); // 레지스트리 이름을 쿠키에서 제거
        Cookies.remove('REGISTRY_URI'); // 레지스트리 URI를 쿠키에서 제거
        navigate(SIGN_IN);
        window.location.reload();
    };
  return (
    <Dropdown>
      <Dropdown.Toggle style={{display: 'flex', alignItems: 'center',width: '100px', height: '100%'}}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.25rem' }}>
            {userInfo.name}
        </div>
        <svg style={{ height: '31px', alignContent: 'center' }} xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
                <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984"></path>
            </g>
        </svg>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="/user/mymain">My Page</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NavDropDown;