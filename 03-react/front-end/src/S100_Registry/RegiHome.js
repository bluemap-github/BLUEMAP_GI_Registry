import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONCEPT_LIST, DDR_LIST, PORTAYAL_LIST } from '../Common/PageLinks';
import axios from 'axios';
import {GET_REGISTRY_DETAIL} from '../User/api';

const RegiHome = () => {
    const regi_uri = sessionStorage.getItem('REGISTRY_URI');
    const navigate = useNavigate();
    const [registryInfo, setRegistryInfo] = useState(null);

    useEffect(() => {
        getRegistryInfo();
    }, []);
    const getRegistryInfo = () => {
        if (regi_uri) {
            axios.get(GET_REGISTRY_DETAIL,{
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
                <div>
                    <div style={{ backgroundColor: '#F8F8F8', width: '70vw'}} className='p-3'>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m6.379 4.5l-.44-.44l-.621-.62A1.5 1.5 0 0 0 4.258 3H3a1.5 1.5 0 0 0-1.5 1.5v5.25l1.376-2.293A3 3 0 0 1 5.45 6h7.05A1.5 1.5 0 0 0 11 4.5zM14 6.026V6a3 3 0 0 0-3-3H7l-.621-.621A3 3 0 0 0 4.257 1.5H3a3 3 0 0 0-3 3V11a3 3 0 0 0 3 3h8.301a3 3 0 0 0 2.573-1.457l1.791-2.985A2.35 2.35 0 0 0 14 6.026M10 12.5h1.301a1.5 1.5 0 0 0 1.287-.728l1.791-2.986l1.286.772l-1.286-.772a.85.85 0 0 0-.728-1.286H5.449a1.5 1.5 0 0 0-1.287.728l-1.791 2.986a.85.85 0 0 0 .728 1.286z" clip-rule="evenodd"/></svg>
                            <h5 style={{ fontWeight: 'bold', margin: 0, marginLeft: '5px'}}>레지스트리 기본정보</h5>
                        </div>
                        <p>name : {registryInfo.name}</p>
                        <p>Operating Language : {registryInfo.operatingLanguage}</p>
                        <p>Summary : {registryInfo.contentSummary}</p>
                        <p>Last Change : {registryInfo.dateOfLastChange}</p>
                    </div>
                    {/* <div style={{ backgroundColor: '#F8F8F8', width: '70vw'}} className='p-3 mt-4'>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.5 12a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9M21 9a3 3 0 1 1-6 0a3 3 0 0 1 6 0M9.5 13c1.993 0 3.805.608 5.137 1.466c.667.43 1.238.937 1.653 1.49c.407.545.71 1.2.71 1.901c0 .755-.35 1.36-.864 1.797c-.485.41-1.117.676-1.77.859c-1.313.367-3.05.487-4.866.487s-3.553-.12-4.865-.487c-.654-.183-1.286-.449-1.77-.859C2.349 19.218 2 18.612 2 17.857c0-.702.303-1.356.71-1.9c.415-.554.986-1.062 1.653-1.49C5.695 13.607 7.507 13 9.5 13m8.5 0c1.32 0 2.518.436 3.4 1.051c.822.573 1.6 1.477 1.6 2.52c0 .587-.253 1.073-.638 1.426c-.357.328-.809.528-1.244.66c-.87.263-1.99.343-3.118.343h-.203c.13-.348.203-.73.203-1.143c0-.99-.423-1.85-.91-2.5c-.486-.649-1.13-1.22-1.849-1.691A6.06 6.06 0 0 1 18 13"/></g></svg>
                            <h5 style={{ fontWeight: 'bold', margin: 0, marginLeft: '5px'}}>초대된 사용자</h5>
                        </div>
                        <div>
                            <p>api 만들어 ~</p>
                        </div>
                    </div> */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RegiHome;
