import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 토글 상태 관리
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isRegistryOpen, setRegistryOpen] = useState(true);

  const isActive = (url) => {
    return location.pathname === url ? 'regi-menu active' : 'regi-menu';
  };

  const toggleCreateMenu = () => {
    setCreateOpen(!isCreateOpen); // CREATE 토글 상태 변경
  };

  const toggleRegistryMenu = () => {
    setRegistryOpen(!isRegistryOpen); // REGISTRY 토글 상태 변경
  };

  const goto_home = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}`);
  };

  const goto_concept_list = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/concept/list`);
  };

  const goto_create_item = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/create`);
  };

  const goto_ddr_list = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/dataDictionary/list`);
  };

  const goto_portayal_list = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/list`);
  };

  const goto_create_portrayal_item = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/create-portrayal`);
  };

  return (
    <nav className="sidebar-wide">
      <div>
        <div onClick={goto_home} style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}`)}>
          <div className='regi-menu' style={{paddingLeft: '10px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z" clipRule="evenodd"/></svg>
            REGISTRY INFO
          </div>
        </div>

        <div>
          {/* REGISTRY 버튼을 클릭 시 하위 메뉴를 토글 */}
          <div onClick={toggleRegistryMenu} style={{ color: 'black', fontWeight: 'bold' }} className="regi-menu">
            <div style={{paddingLeft: '10px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="m6.44 4.06l.439.44H12.5A1.5 1.5 0 0 1 14 6v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11V4.5A1.5 1.5 0 0 1 3.5 3h1.257a1.5 1.5 0 0 1 1.061.44zM.5 4.5a3 3 0 0 1 3-3h1.257a3 3 0 0 1 2.122.879L7.5 3h5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3zm4.25 2a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5z" clipRule="evenodd"/></svg>
              REGISTRY
            </div>
            <div className="toggle-arrow">
              {isRegistryOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19.707 16.207a1 1 0 0 1-1.414 0L12 9.914l-6.293 6.293a1 1 0 0 1-1.414-1.414L10.586 8.5a2 2 0 0 1 2.828 0l6.293 6.293a1 1 0 0 1 0 1.414"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4.293 7.793a1 1 0 0 1 1.414 0L12 14.086l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 15.5a2 2 0 0 1-2.828 0L4.293 9.207a1 1 0 0 1 0-1.414"/></svg>
              )}
            </div>
          </div>

          {/* REGISTRY 하위 메뉴가 열렸을 때만 표시 */}
          {isRegistryOpen && (
            <>
              {/* CONCEPT */}
              <div onClick={goto_concept_list} style={{ textDecoration: 'none', color: 'black' }} className={`regi-menu create-menu-item ${isActive(`/${Cookies.get('REGISTRY_URI')}/concept/list`)}`}>
                <div className='regi-menu-item-inner'>CONCEPT</div>
              </div>

              {/* DATA DICTIONARY */}
              <div onClick={goto_ddr_list} style={{ textDecoration: 'none', color: 'black' }} className={`regi-menu create-menu-item ${isActive(`/${Cookies.get('REGISTRY_URI')}/dataDictionary/list`)}`}>
                <div className='regi-menu-item-inner'>DATA DICTIONARY</div>
              </div>

              {/* PORTRAYAL */}
              <div onClick={goto_portayal_list} style={{ textDecoration: 'none', color: 'black' }} className={`regi-menu create-menu-item ${isActive(`/${Cookies.get('REGISTRY_URI')}/portrayal/list`)}`}>
                <div className='regi-menu-item-inner'>PORTRAYAL</div>
              </div>
            </>
          )}
        </div>

        {/* CREATE 버튼을 클릭 시 토글 */}
      <div onClick={toggleCreateMenu} style={{ textDecoration: 'none', color: 'black' }} className="regi-menu">
        <div style={{paddingLeft: '10px', fontWeight: 'bold'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M12.5 12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 12V4A1.5 1.5 0 0 1 5 2.5h2.757a1.5 1.5 0 0 1 1.061.44l3.243 3.242a1.5 1.5 0 0 1 .439 1.06zm.621-6.879A3 3 0 0 1 14 7.243V12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h2.757a3 3 0 0 1 2.122.879zM8.75 6.75a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5z" clipRule="evenodd"/></svg>
        CREATE
        </div>
        <div className="toggle-arrow">
          {isCreateOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19.707 16.207a1 1 0 0 1-1.414 0L12 9.914l-6.293 6.293a1 1 0 0 1-1.414-1.414L10.586 8.5a2 2 0 0 1 2.828 0l6.293 6.293a1 1 0 0 1 0 1.414"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M4.293 7.793a1 1 0 0 1 1.414 0L12 14.086l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 15.5a2 2 0 0 1-2.828 0L4.293 9.207a1 1 0 0 1 0-1.414"/></svg>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <>
          <div onClick={goto_create_item} style={{ textDecoration: 'none', color: 'black' }} className={`regi-menu create-menu-item ${isActive(`/${Cookies.get('REGISTRY_URI')}/create`)}`}>
            <div className='regi-menu-item-inner'>CREATE CONCEPT DATA</div>
          </div>
          <div onClick={goto_create_portrayal_item} style={{ textDecoration: 'none', color: 'black' }} className={`regi-menu create-menu-item ${isActive(`/${Cookies.get('REGISTRY_URI')}/create-portrayal`)}`}>
            <div className='regi-menu-item-inner'>CREATE PORTRAYAL DATA</div>
          </div>
        </>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
