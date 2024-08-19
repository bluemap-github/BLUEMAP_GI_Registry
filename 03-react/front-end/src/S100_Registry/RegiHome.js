import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GET_REGISTRY_DETAIL } from '../User/api';

const RegiHome = () => {
    const regi_uri = sessionStorage.getItem('REGISTRY_URI');
    const navigate = useNavigate();
    const [registryInfo, setRegistryInfo] = useState(null);

    useEffect(() => {
        getRegistryInfo();
    }, []);

    const getRegistryInfo = () => {
        if (regi_uri) {
            axios.get(GET_REGISTRY_DETAIL, {
                params: {
                    regi_uri: regi_uri,
                }
            })
            .then(response => {
                if (response.data) {
                    setRegistryInfo(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    };

    return (
        <div className="p-5">
            {registryInfo ? (
                <div style={{ maxWidth: '70vw', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
                            <path fill="currentColor" fillRule="evenodd" d="m6.379 4.5l-.44-.44l-.621-.62A1.5 1.5 0 0 0 4.258 3H3a1.5 1.5 0 0 0-1.5 1.5v5.25l1.376-2.293A3 3 0 0 1 5.45 6h7.05A1.5 1.5 0 0 0 11 4.5zM14 6.026V6a3 3 0 0 0-3-3H7l-.621-.621A3 3 0 0 0 4.257 1.5H3a3 3 0 0 0-3 3V11a3 3 0 0 0 3 3h8.301a3 3 0 0 0 2.573-1.457l1.791-2.985A2.35 2.35 0 0 0 14 6.026M10 12.5h1.301a1.5 1.5 0 0 0 1.287-.728l1.791-2.986l1.286.772l-1.286-.772a.85.85 0 0 0-.728-1.286H5.449a1.5 1.5 0 0 0-1.287.728l-1.791 2.986a.85.85 0 0 0 .728 1.286z" clipRule="evenodd"/>
                        </svg>
                        <h5 style={{ fontWeight: 'bold', margin: 0 }}>Registry Information</h5>
                    </div>
                    <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold', width: '20%' }}>Name</td>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>{registryInfo.name}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>URL</td>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>http://bluemap.kr:21804/{registryInfo.uniformResourceIdentifier}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Operating Language</td>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>{registryInfo.operatingLanguage}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Summary</td>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>{registryInfo.contentSummary}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Last Change</td>
                                <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>{registryInfo.dateOfLastChange}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RegiHome;
