import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { RERI_HOME, CREATE_ITEM, CONCEPT_LIST, DDR_LIST, PORTAYAL_LIST } from '../Common/PageLinks';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (url) => {
    return location.pathname === url ? 'regi-menu active' : 'regi-menu';
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
  }

  return (
    <nav className="sidebar-wide">
      <div>
        <div onClick={goto_home} style={{ textDecoration: 'none', color: 'black' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}`)}>
          <div className='regi-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m-.01 8H11a1 1 0 0 0-.117 1.993L11 12v4.99c0 .52.394.95.9 1.004l.11.006h.49a1 1 0 0 0 .596-1.803L13 16.134V11.01c0-.52-.394-.95-.9-1.004zM12 7a1 1 0 1 0 0 2a1 1 0 0 0 0-2"/></g></svg>
            REGISTER INFO
          </div>
        </div>
        <div onClick={goto_concept_list} style={{ textDecoration: 'none', color: 'black' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}/concept/list`)}>
          <div className='regi-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M2 4.5V6h3.586a.5.5 0 0 0 .353-.146L7.293 4.5L5.939 3.146A.5.5 0 0 0 5.586 3H3.5A1.5 1.5 0 0 0 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.086a1.5 1.5 0 0 1 1.06.44L8.207 4H12.5A2.5 2.5 0 0 1 15 6.5v2.585A1.5 1.5 0 0 0 14.5 9H14V6.5A1.5 1.5 0 0 0 12.5 5H8.207l-1.56 1.56A1.5 1.5 0 0 1 5.585 7H2v4.5A1.5 1.5 0 0 0 3.5 13h4.585a1.5 1.5 0 0 0 .297.5a1.5 1.5 0 0 0-.297.5H3.5A2.5 2.5 0 0 1 1 11.5zM9.5 10a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 14.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"></path></svg>
            CONCEPT
          </div>
        </div>
        <div onClick={goto_ddr_list} style={{ textDecoration: 'none', color: 'black' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}/dataDictionary/list`)}>
          <div className='regi-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M2 4.5V6h3.586a.5.5 0 0 0 .353-.146L7.293 4.5L5.939 3.146A.5.5 0 0 0 5.586 3H3.5A1.5 1.5 0 0 0 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.086a1.5 1.5 0 0 1 1.06.44L8.207 4H12.5A2.5 2.5 0 0 1 15 6.5v2.585A1.5 1.5 0 0 0 14.5 9H14V6.5A1.5 1.5 0 0 0 12.5 5H8.207l-1.56 1.56A1.5 1.5 0 0 1 5.585 7H2v4.5A1.5 1.5 0 0 0 3.5 13h4.585a1.5 1.5 0 0 0 .297.5a1.5 1.5 0 0 0-.297.5H3.5A2.5 2.5 0 0 1 1 11.5zM9.5 10a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 14.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"></path></svg>
            DATA DICTIONARY
          </div>
        </div>
        <div onClick={goto_portayal_list} style={{ textDecoration: 'none', color: 'black' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}/portrayal/list`)}>
          <div className='regi-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M2 4.5V6h3.586a.5.5 0 0 0 .353-.146L7.293 4.5L5.939 3.146A.5.5 0 0 0 5.586 3H3.5A1.5 1.5 0 0 0 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.086a1.5 1.5 0 0 1 1.06.44L8.207 4H12.5A2.5 2.5 0 0 1 15 6.5v2.585A1.5 1.5 0 0 0 14.5 9H14V6.5A1.5 1.5 0 0 0 12.5 5H8.207l-1.56 1.56A1.5 1.5 0 0 1 5.585 7H2v4.5A1.5 1.5 0 0 0 3.5 13h4.585a1.5 1.5 0 0 0 .297.5a1.5 1.5 0 0 0-.297.5H3.5A2.5 2.5 0 0 1 1 11.5zM9.5 10a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 14.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"></path></svg>
            PORTRAYAL
          </div>
        </div>
        <div onClick={goto_create_item} style={{ textDecoration: 'none', color: 'black' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}/create`)}>
          <div className='regi-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5z"></path><path fill="currentColor" d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z"></path></svg>
            CREATE CONCEPT
          </div>
        </div>
        <div onClick={goto_create_portrayal_item} style={{ textDecoration: 'none', color: 'black' }} className={isActive(`/${Cookies.get('REGISTRY_URI')}/create-portrayal`)}>
          <div className='regi-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5z"></path><path fill="currentColor" d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z"></path></svg>
            CREATE PORTRAYAL
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
