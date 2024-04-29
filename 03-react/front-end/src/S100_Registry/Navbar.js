import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sidebar">
      {/* 네비게이션 바 내용 */}
      <div>
        <div className='title-menu'>
          <Link to="/" style={{textDecoration: 'none', color: 'black'}}>LOGO HERE</Link>
        </div>
        <div className='regi-menu'>
          <Link to="/" style={{textDecoration: 'none', color: 'black'}} >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M2 4.5V6h3.586a.5.5 0 0 0 .353-.146L7.293 4.5L5.939 3.146A.5.5 0 0 0 5.586 3H3.5A1.5 1.5 0 0 0 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.086a1.5 1.5 0 0 1 1.06.44L8.207 4H12.5A2.5 2.5 0 0 1 15 6.5v2.585A1.5 1.5 0 0 0 14.5 9H14V6.5A1.5 1.5 0 0 0 12.5 5H8.207l-1.56 1.56A1.5 1.5 0 0 1 5.585 7H2v4.5A1.5 1.5 0 0 0 3.5 13h4.585a1.5 1.5 0 0 0 .297.5a1.5 1.5 0 0 0-.297.5H3.5A2.5 2.5 0 0 1 1 11.5zM9.5 10a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 14.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"></path></svg>
            REGISTER
          </Link>
        </div>
        <div className='regi-menu'>
          <Link to="/create" style={{textDecoration: 'none', color: 'black'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5z"></path><path fill="currentColor" d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z"></path></svg>
            CREATE DATA
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
