import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { GET_REGISTRY_DETAIL } from '../User/api';
import { getDecryptedItem, setEncryptedItem } from "../cryptoComponent/storageUtils";

const RegiHome = () => {
    const regi_uri = getDecryptedItem('REGISTRY_URI'); // 쿠키에서 REGISTRY_URI 가져오기
    const navigate = useNavigate();
    const [registryInfo, setRegistryInfo] = useState(null);

    useEffect(() => {
        getRegistryInfo();
    }, [regi_uri]);

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

    if (!registryInfo) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ fontWeight: "bold" }}>{registryInfo.name}</h2>
            <div style={{ height: '5px', borderBottom: '1px solid #d1d1d1' }}></div>
            <h5 style={{ fontWeight: "bold", marginTop: "35px" }}>Registry Informations</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table">
                <tbody>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Name</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd', width: '75%' }}>{registryInfo.name}</td>
                    </tr>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>URL</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd', width: '75%' }}>
                            <a href={`http://bluemap.kr:21804/${registryInfo.uniformResourceIdentifier}`} target="_blank" rel="noopener noreferrer">
                                {`http://bluemap.kr:21804/${registryInfo.uniformResourceIdentifier}`}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Operating Language</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{registryInfo.operatingLanguage || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Summary</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{registryInfo.contentSummary || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Last Change</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{registryInfo.dateOfLastChange || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RegiHome;
