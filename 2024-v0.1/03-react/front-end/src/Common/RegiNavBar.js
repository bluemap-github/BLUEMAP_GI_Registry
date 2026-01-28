import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { SIGN_IN, ENTER_REGI } from './PageLinks';
import NavDropDown from './NavDropDown';
import { getOwnRegistries } from '../User/myPage/GetRegistery';
import { getDecryptedItem, setEncryptedItem } from "../cryptoComponent/storageUtils";

const RegiNavBar = ({ userInfo }) => {
    const [ownRegistries, setOwnRegistries] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRegistry, setSelectedRegistry] = useState(null); // 현재 선택된 레지스트리 상태
    const navigate = useNavigate();
    const role = getDecryptedItem('role'); // 쿠키에서 role을 가져옴

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getOwnRegistries("owner");
                setOwnRegistries(result);

                // 쿠키에서 REGISTRY_URI를 가져와 현재 레지스트리로 설정
                const savedRegistryURI = getDecryptedItem('REGISTRY_URI');
                const initialRegistry = result.find(reg => reg.uniformResourceIdentifier === savedRegistryURI) || result[0];
                
                if (initialRegistry) {
                    setSelectedRegistry(initialRegistry);
                    setEncryptedItem('REGISTRY_URI', initialRegistry.uniformResourceIdentifier, { expires: 7 });
                    setEncryptedItem('REGISTRY_NAME', initialRegistry.name, { expires: 7 });
                }
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, []); // 첫 렌더링 시 한 번만 호출

    const handleRegistryChange = (e) => {
        const selectedUri = e.target.value;
        const registry = ownRegistries.find(reg => reg.uniformResourceIdentifier === selectedUri);

        if (registry) {
            setSelectedRegistry(registry); // 선택된 레지스트리 상태 업데이트
            setEncryptedItem('REGISTRY_URI', registry.uniformResourceIdentifier, { expires: 7 });
            setEncryptedItem('REGISTRY_NAME', registry.name, { expires: 7 });
            navigate(ENTER_REGI(registry.uniformResourceIdentifier));
        }
    };

    const gotoLogin = () => {
        navigate(SIGN_IN);
    };

    return (
        <nav className="nav-inner">
            <div>
                <div style={{ fontSize: '23px', fontWeight: 'bold', color: '#007bff', marginLeft: '10px' }}>
                    BLUEMAP GI Registry
                </div>
            </div>
            <div style={{ height: '100%', alignContent: 'center', marginRight: '10px', display: 'flex', alignItems: 'center'  }}>
                {role && role !== 'guest' && ownRegistries.length > 0 && (
                    <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center', position: 'relative', padding: '1px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '5px' }}>
                            Currently In-Use:
                        </div>
                        <select
                            className="form-select"
                            style={{
                                width: '250px',
                                height: '45px',
                                fontSize: '16px',
                                padding: '5px 10px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                marginLeft: '10px',
                            }}
                            onChange={handleRegistryChange}
                            value={selectedRegistry?.uniformResourceIdentifier || ""}
                        >
                            {ownRegistries.map((registry) => (
                                <option
                                    key={registry.uniformResourceIdentifier}
                                    value={registry.uniformResourceIdentifier}
                                    style={{ padding: '8px 10px' }}
                                >
                                    {registry.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {userInfo ? (
                    <NavDropDown userInfo={userInfo} />
                ) : (
                    <button className="btn btn-outline-secondary" onClick={gotoLogin}>
                        Log in
                    </button>
                )}
            </div>
        </nav>
    );
};

export default RegiNavBar;
