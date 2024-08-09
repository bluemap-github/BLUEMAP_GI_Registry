import { Link, useLocation,useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../User/api';
import { SIGN_IN, CREATE_ITEM} from './PageLinks';
const MySidebar = () => {
  const location = useLocation();

  const isActive = (url) => {
    return location.pathname === url ? 'regi-menu active' : 'regi-menu';
  };
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 JWT 토큰을 가져오기
    const token = localStorage.getItem('jwt');

    if (token) {
        // 사용자 정보를 가져오기 위해 API 요청 보내기
        axios.get(CHECK_AUTH, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setUserInfo(response.data.user);
        })
        .catch(error => {
            if (error.response) {
                setError(error.response.data.error);
                if (error.response.status === 401) {
                    navigate(SIGN_IN);
                }
            } else {
                setError(error.message);
            }
        });
    } else {
        setError('No token found');
        navigate(SIGN_IN); // 토큰이 없을 경우 로그인 페이지로 리디렉션
    }
  }, [navigate]);

  if (error) {
      return <div>Error: {error}</div>;
  }

  if (!userInfo) {
      return <div>Loading...</div>;
  }

  return (
    <nav className="sidebar-wide">
      <Link style={{textDecoration: 'none', color: 'black'}} className={isActive(CREATE_ITEM)}>
        <div className='regi-menu'>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h8v-2H4V8h16v4h2V8a2 2 0 0 0-2-2h-8l-2-2m8 10a.26.26 0 0 0-.26.21l-.19 1.32c-.3.13-.59.29-.85.47l-1.24-.5c-.11 0-.24 0-.31.13l-1 1.73c-.06.11-.04.24.06.32l1.06.82a4.2 4.2 0 0 0 0 1l-1.06.82a.26.26 0 0 0-.06.32l1 1.73c.06.13.19.13.31.13l1.24-.5c.26.18.54.35.85.47l.19 1.32c.02.12.12.21.26.21h2c.11 0 .22-.09.24-.21l.19-1.32c.3-.13.57-.29.84-.47l1.23.5c.13 0 .26 0 .33-.13l1-1.73a.26.26 0 0 0-.06-.32l-1.07-.82c.02-.17.04-.33.04-.5s-.01-.33-.04-.5l1.06-.82a.26.26 0 0 0 .06-.32l-1-1.73c-.06-.13-.19-.13-.32-.13l-1.23.5c-.27-.18-.54-.35-.85-.47l-.19-1.32A.236.236 0 0 0 20 14m-1 3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5c-.84 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5"></path></svg>
          레지스트리 설정
        </div>
      </Link>
      <Link style={{textDecoration: 'none', color: 'black'}} className={isActive(CREATE_ITEM)}>
        <div className='regi-menu'>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8m0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m2.595 7.811a3.5 3.5 0 0 1 0-1.622l-.992-.573l1-1.732l.992.573A3.5 3.5 0 0 1 17 14.645V13.5h2v1.145c.532.158 1.012.44 1.405.812l.992-.573l1 1.732l-.991.573a3.5 3.5 0 0 1 0 1.622l.991.573l-1 1.732l-.992-.573a3.5 3.5 0 0 1-1.405.812V22.5h-2v-1.145a3.5 3.5 0 0 1-1.405-.812l-.992.573l-1-1.732zM18 19.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"></path></svg>
          기본정보 수정
        </div>
      </Link>
    </nav>
  );
};

export default MySidebar;
