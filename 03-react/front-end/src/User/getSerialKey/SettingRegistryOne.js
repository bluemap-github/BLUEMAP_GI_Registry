import React from 'react';

const SettingRegistryOne = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Basic Information Section */}
            <h2>레지스트리 기본정보</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Name</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', width: '75%' }}>국민권익위원회_민원빅데이터_분석정보_API_2023</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>Description</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', width: '75%' }}>국민권익위원회_민원빅데이터_분석정보_API_2023</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>서비스유형</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>REST</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>활용기간</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>제한 없음</td>
                    </tr>
                </tbody>
            </table>

            {/* Service Information Section */}
            <h2>서비스정보</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>데이터포맷</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>JSON</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>End Point</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            <a href="http://apis.data.go.kr/1140100/minAnalsInfoView6" target="_blank" rel="noopener noreferrer">
                                http://apis.data.go.kr/1140100/minAnalsInfoView6
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', width: '25%' }}>API 인증키 (serviceKey)</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            M1l5W2GaSsGp9RGh8x6Z0zGngno7FRRsWT/M6HTwyUeQXjmifzGWOFgCTQjo7uK9OjyMvV46Uy6fsRk/sYQJaT0qg93GPD3d
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Request Parameter Section */}
            <h2>요청변수(Request Parameter)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
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
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            레지스트리에서 발급받은 API 인증키
                        </td>
                    </tr>
                    {/* Additional rows as needed */}
                </tbody>
            </table>
        </div>
    );
};

export default SettingRegistryOne;
