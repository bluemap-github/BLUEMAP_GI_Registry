import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userInfo }) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('jwt'); 
        sessionStorage.removeItem('USER_SERIAL');
        sessionStorage.removeItem('itemDetails');
        navigate('/user/signin'); 
    };
    const handleMyPage = () => {
        navigate('/user/mymain');
        sessionStorage.removeItem('USER_SERIAL');
        sessionStorage.removeItem('itemDetails');
    };
    
    return (
        <nav style={{height: '100%'}}>
            <ul style={{display: 'flex', justifyContent: 'end', height: '100%'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <li style={{marginRight: '5px', marginLeft: '5px'}}>
                        <button className='btn btn-outline-secondary' onClick={handleMyPage}>My Page</button>
                    </li>
                    <li style={{marginRight: '5px', marginLeft: '5px'}}>
                        <button className='btn btn-outline-secondary' onClick={handleLogout}>Log out</button>
                    </li>
                </div>
                <div className="dropdown">
                    <div className='profile' data-bs-toggle="dropdown" aria-expanded="false">
                        <div style={{height: '100%', alignContent: 'center'}}>{userInfo && userInfo.name}</div>
                        <svg style={{height: '100%', alignContent: 'center'}} xmlns="http://www.w3.org/2000/svg" width="2.75rem" height="2.75rem" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984"></path></g></svg>
                    </div>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="/user/mymain">My Page</a></li>
                        <li><a className="dropdown-item" onClick={handleLogout}>Log out</a></li>
                    </ul>
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;
