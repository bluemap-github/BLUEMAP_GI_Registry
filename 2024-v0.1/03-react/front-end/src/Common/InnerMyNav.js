import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InnerNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getPathSegments = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        if (pathSegments.length === 0) {
            return ['Home', ''];
        }

        const firstSegment = pathSegments[0];
        let capitalizedFirstSegment = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
        let secondSegment = 'Default';

        switch (location.pathname) {
            case '/user/mymain':
                capitalizedFirstSegment = 'User';
                secondSegment = 'My Registries';
                break;
            case '/user/create-registry':
                capitalizedFirstSegment = 'User';
                secondSegment = 'Create New Registry';
                break;
            case '/user/setting-registry':
                capitalizedFirstSegment = 'User';
                secondSegment = 'API Information';
                break;
            default:
                capitalizedFirstSegment = pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
                secondSegment = pathSegments[1] ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : 'Default';
                break;
        }

        return [capitalizedFirstSegment, secondSegment];
    };

    const moveToMyPage = () => {
        navigate('/user/mymain');
    };

    const [firstSegment, secondSegment] = getPathSegments();

    return (
        <div className='inner-nav' style={{ marginLeft: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* 첫 번째 브레드크럼 요소 (Home 링크) */}
                <div className='inner-nav-link' style={{ display: "flex", alignItems: "center", cursor: 'pointer' }} onClick={moveToMyPage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <g fill="none" fillRule="evenodd">
                            <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                            <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984"/>
                        </g>
                    </svg>
                    <p className='inner-nav-link'>{firstSegment} Page</p>
                </div>

                {/* 구분 아이콘 */}
                <p className='inner-nav-link'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="27" viewBox="0 0 12 24">
                        <defs>
                            <path id="weuiArrowOutlined0" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/>
                        </defs>
                        <use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/>
                    </svg>
                </p>

                {/* 두 번째 브레드크럼 요소 */}
                <p
                    className='inner-nav-final'
                    // onClick={() => console.log(`Clicked on breadcrumb: ${secondSegment}`)}
                    style={{ cursor: 'pointer' }}
                >
                    {secondSegment}
                </p>
            </div>
        </div>
    );
};

export default InnerNav;
