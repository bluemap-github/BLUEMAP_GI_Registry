import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RERI_HOME } from '../Common/PageLinks';

const InnerNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const moveToHome = () => {
        navigate(RERI_HOME);
    };
    const [error, setError] = useState('');
    const [pathSegments, setPathSegments] = useState(['Home', '']);

    const getPathSegments = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        try {
            if (pathSegments.length === 0) {
                return ['Home', '']; // Default to 'Home' if the path is empty
            }

            // Capitalize the first letter of the first path segment
            const firstSegment = pathSegments[0];
            const capitalizedSegment = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);

            // Handle second segment, provide a default if undefined
            const secondSegment = pathSegments[1] || 'Default'; // Default to 'Default' if undefined
            const capitalizedSecondSegment = secondSegment.charAt(0).toUpperCase() + secondSegment.slice(1);

            return [capitalizedSegment, capitalizedSecondSegment];
        } catch (error) {
            setError(error.message);
            return ['Home', '']; // Return default in case of error
        }
    };

    useEffect(() => {
        const segments = getPathSegments();
        setPathSegments(segments);
    }, [location]);

    const [firstSegment, secondSegment] = pathSegments;

    return (
        <div className='inner-nav'>
            {error ? (
                <div>{error}</div>
            ) : (
                <>
                    {firstSegment === 'Home' ? (
                        <h5 style={{ fontWeight: 'bold' }}>Register Information</h5>
                    ) : (
                        <h5 style={{ fontWeight: 'bold' }}>{firstSegment} Register</h5>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            className='inner-nav-link inner-nav-link-click'
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={moveToHome}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 1024 1024"
                            >
                                <path
                                    fill="currentColor"
                                    d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3c0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8c24.9-25 24.9-65.5-.1-90.5"
                                />
                            </svg>
                            <div>Home</div>
                        </div>
                        {firstSegment === 'Home' ? null : (
                            <>
                                <p className='inner-nav-link'>|</p>
                                <p className='inner-nav-link inner-nav-link-click' onClick={moveToHome}>
                                    {firstSegment}
                                </p>
                                <p className='inner-nav-link'>|</p>
                                <p className='inner-nav-link inner-nav-link-click' onClick={moveToHome}>
                                    {secondSegment}
                                </p>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default InnerNav;
