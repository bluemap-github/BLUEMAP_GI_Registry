import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function MyMainDropDown({ registry, connectToRegistry, connectToSetting }) {
    const [show, setShow] = useState(false);

    const handleToggle = () => {
        setShow(!show);
    };

    return (
        <Dropdown show={show} onToggle={handleToggle}>
            <div onClick={handleToggle} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.2em" viewBox="0 0 20 20">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>
                </svg>
            </div>

            {/* <Dropdown.Menu style={{ padding: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', minWidth: '150px', transform: 'translate(-80%, 0)'}} align="end"> */}
            <Dropdown.Menu style={{ padding: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', minWidth: '150px'}} align="end">
                <Dropdown.Item onClick={(e) => connectToRegistry(e, registry)} style={{ padding: '10px 20px', color: '#333' }}>
                    Enter Registry
                </Dropdown.Item>
                <Dropdown.Item onClick={(e) => connectToSetting(e, registry)} style={{ padding: '10px 20px', color: '#333' }}>
                    View API Informations
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default MyMainDropDown;
