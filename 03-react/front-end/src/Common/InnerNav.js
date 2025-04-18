import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getDecryptedItem, setEncryptedItem } from "../cryptoComponent/storageUtils";

const InnerNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [error, setError] = useState('');
    const [breadcrumb, setBreadcrumb] = useState(['Home']); // 기본 브레드크럼 상태

    useEffect(() => {
        let newBreadcrumb = ['Home'];

        // 각 경로에 따른 브레드크럼 설정
        switch (location.pathname) {
            case '/':
                newBreadcrumb = ['Home'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/concept/list`:
                newBreadcrumb = ['Home', 'Concept Register', 'Item List'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/concept/detail`:
                newBreadcrumb = ['Home', 'Concept Register', 'Item Detail'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/create`:
                newBreadcrumb = ['Home', 'Create Concept & Data Dictionary Item'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/dataDictionary/list`:
                newBreadcrumb = ['Home', 'Data Dictionary Register', 'Item List'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/dataDictionary/detail`:
                newBreadcrumb = ['Home', 'Data Dictionary Register', 'Item Detail'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/portrayal/list`:
                newBreadcrumb = ['Home', 'Portrayal Register', 'Item List'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/portrayal/detail`:
                newBreadcrumb = ['Home', 'Portrayal Register', 'Item Detail'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/create-portrayal`:
                newBreadcrumb = ['Home', 'Portrayal Register', 'Create Item'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/iho-concept/list`:
                newBreadcrumb = ['Home', 'IHO Concept Register', 'Item List'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/iho-concept/detail`:
                newBreadcrumb = ['Home', 'IHO Concept Register', 'Item Detail'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/iho-dataDictionary/list`:
                newBreadcrumb = ['Home', 'IHO Data Dictionary Register', 'Item List'];
                break;
            case `/${getDecryptedItem('REGISTRY_URI')}/iho-dataDictionary/detail`:
                newBreadcrumb = ['Home', 'IHO Data Dictionary Register', 'Item Detail'];
                break;
            default:
                break;
        }

        setBreadcrumb(newBreadcrumb); // 브레드크럼 업데이트
    }, [location]);

    const handleClick = (segment) => {
        if (segment === 'Home') {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}`);
        } else if (segment === 'Portrayal Register') {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}/portrayal/list`);
        } else if (segment === 'Concept Register') {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}/concept/list`);
        } else if (segment === 'Data Dictionary Register') {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}/dataDictionary/list`);
        } else if (segment === 'IHO Concept Register') {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}/iho-concept/list`);
        } else if (segment === 'IHO Data Dictionary Register') {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}/iho-dataDictionary/list`);
        }
    };

    return (
        <div className='inner-nav' style={{marginLeft: '20px'}}>
            {error ? (
                <div>{error}</div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='inner-nav-link' style={{display: "flex", alignItems: "center"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.1em" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="m6.44 4.06l.439.44H12.5A1.5 1.5 0 0 1 14 6v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11V4.5A1.5 1.5 0 0 1 3.5 3h1.257a1.5 1.5 0 0 1 1.061.44zM.5 4.5a3 3 0 0 1 3-3h1.257a3 3 0 0 1 2.122.879L7.5 3h5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3zm4.25 2a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5z" clipRule="evenodd"/></svg>
                    </div>
                    {breadcrumb.map((segment, index) => (
                        <React.Fragment key={index}>
                            {index !== 0 && 
                                <p className='inner-nav-link'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="27" viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
                                </p>}
                            <p
                                className={index === breadcrumb.length - 1 ? 'inner-nav-final' : 'inner-nav-link'}
                                onClick={() => index !== breadcrumb.length - 1 && handleClick(segment)}
                                style={{ cursor: index === breadcrumb.length - 1 ? 'default' : 'pointer' }}
                            >
                                {segment}
                            </p>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InnerNav;
