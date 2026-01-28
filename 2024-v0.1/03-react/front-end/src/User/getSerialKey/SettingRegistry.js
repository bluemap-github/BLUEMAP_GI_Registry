import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GET_REGI_API_INFO } from '../api';
import FullScreenLoadingSpinner from '../../Common/FullScreenLoadingSpinner';
import { getDecryptedItem, setEncryptedItem } from "../../cryptoComponent/storageUtils";

const SettingRegistry = () => {
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [registry, setRegistry] = useState(null); // 레지스트리 데이터 상태 관리
    const regi_uri = getDecryptedItem('REGISTRY_URI');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(GET_REGI_API_INFO, { params: { regiURI: regi_uri } });
                setRegistry(result.data); // 데이터 저장
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // 데이터가 로드된 후 로딩 상태 false
            }
        };

        fetchData();
    }, [regi_uri]);

    if (loading) {
        return <FullScreenLoadingSpinner />; // 로딩 중일 때 보여줄 UI
    }

    if (!registry) {
        return <div>데이터를 불러오지 못했습니다.</div>; // 데이터가 없을 때
    }

    const { regi_item, participate_item } = registry; // 데이터 구조에서 각 객체를 추출

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{fontWeight: "bold"}}>Open API 정보</h2>
            <div style={{ height: '5px', borderBottom: '1px solid #d1d1d1' }}></div>
            <h5 style={{fontWeight: "bold", marginTop: "35px"}}>레지스트리 기본정보</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table">
                <tbody>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Name</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd', width: '75%' }}>{regi_item.name || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Description</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd', width: '75%' }}>{regi_item.contentSummary || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className='table-primary' style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>활용기간</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>제한 없음</td>
                    </tr>
                </tbody>
            </table>

            {/* Service Information Section */}
            <h5 style={{fontWeight: "bold", marginTop: "35px"}}>서비스정보</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>서비스 유형</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>REST</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>데이터포맷</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>JSON</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>End Point</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            <a href={'http://bluemap.kr:21803/'} target="_blank" rel="noopener noreferrer">
                                {'http://bluemap.kr:21803/'}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>swagger 주소</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            <a href={`http://bluemap.kr:21803/swagger`} target="_blank" rel="noopener noreferrer">
                                {`http://bluemap.kr:21803/swagger`}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>registry URI 정보</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{regi_item.uniformResourceIdentifier || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>API 인증키 (serviceKey)</th>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{participate_item.serial_key || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            {/* Request Parameter Section */}
            <h5 style={{fontWeight: "bold", marginTop: "35px"}}>요청변수(Request Parameter)</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>항목명</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>설명</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>regiURI</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>접속하려는 레지스트리의 URI</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>serviceKey</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>api를 제공받기위한 인증키</td>
                    </tr>
                    {/* Additional rows as needed */}
                </tbody>
            </table>

            {/* Request Parameter Section */}
            <h5 style={{fontWeight: "bold", marginTop: "35px"}}>제공 api 목록</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>구분</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>메서드</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>주소</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>추가예정</td>
                    </tr>
                    {/* Additional rows as needed */}
                </tbody>
            </table>
            <div>
                <button className='btn btn-primary mt-4' onClick={() => window.history.back()}>Back to My Page</button>
            </div>
        </div>
    );
};

export default SettingRegistry;
