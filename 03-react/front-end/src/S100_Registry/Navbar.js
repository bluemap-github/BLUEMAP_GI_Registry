// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{position: 'fixed', top: '0', width: '100%', backgroundColor: 'white', zIndex: '1000'}}>
        <div className=''>
            <Link to="/"><button className='m-2 btn btn-light'>Register List</button></Link>
            <Link to="/create"><button className='m-2 btn btn-light'>Create data</button></Link>
        </div>
    </nav>
  );
};

export default Navbar;
