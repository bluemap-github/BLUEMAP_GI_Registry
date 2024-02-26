import React, { useState } from 'react';
import axios from 'axios';
import { CREATE_ITEM_URL } from '../api';
import ItemInput from './components/ItemInput';
import ManagementInfoInput from './components/ManagementInfoInput';
import ReferenceSourceInput from './components/ReferenceSourceInput';
import ReferenceInput from './components/ReferenceInput';

// CREATE_MI_URL을 동적으로 생성하는 함수
const createManagementInfoUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/managementInfo/post/`;
};

// CREATE_MI_URL을 동적으로 생성하는 함수
const createReferenceSourceUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

// CREATE_MI_URL을 동적으로 생성하는 함수
const createReferenceUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/reference/post/`;
};

function Item() {
    const [item, setItem] = useState('');
    const [managementInfos, setManagementInfos] = useState(['']); // 관리 정보 입력 창 배열
    const [referenceSources, setReferenceSources] = useState([]);
    const [references, setReferences] = useState([]);

    const handleSubmitItem = async () => {
        try {
            const itemData = JSON.parse(item);
            const itemResponse = await axios.post(CREATE_ITEM_URL, itemData);
            console.log('Item data successfully posted:', itemResponse.data);

            // Item 데이터를 CREATE_ITEM_URL로 POST 후 Item의 ID 가져오기
            const itemId = itemResponse.data.id;

            // 모든 MI에 대해 작업하는 for 문
            for (const managementInfo of managementInfos) {
                if (managementInfo.trim() === '') continue; // 빈 데이터는 무시

                // Management Info를 저장할 URL 생성 후 POST
                const miUrl = createManagementInfoUrl(itemId);
                const managementInfoData = JSON.parse(managementInfo);
                const MIResponse = await axios.post(miUrl, managementInfoData);
                console.log('Management Info data successfully posted:', MIResponse);
            }

            // 모든 RS에 대해 작업
            for (const referenceSource of referenceSources) {
                if (referenceSource.trim() === '') continue;

                const rsUrl = createReferenceSourceUrl(itemId);
                const referenceSourceData = JSON.parse(referenceSource);
                const RSResponse = await axios.post(rsUrl, referenceSourceData);
                console.log('Reference Source data successfully posted:', RSResponse);
            }


            // 모든 R에 대해 작업
            for(const reference of references) {
                if (reference.trim() === '') continue;

                const rUrl = createReferenceUrl(itemId);
                const referenceData = JSON.parse(reference);
                const RResponse = await axios.post(rUrl, referenceData);
                console.log('Reference data successfully posted:', RResponse);
            }

        } catch (error) {
            console.error('Error posting data:', error);
        }
    };


    // Item 관련 함수
    const ItemChange = (event) => {
        setItem(event.target.value);
    };


    // Management Info 관련 함수
    const addMIInput = () => {
        setManagementInfos([...managementInfos, '']); // 새로운 관리 정보 입력 창 추가
    };
    const popMIInput = (index) => {
        const newManagementInfos = [...managementInfos];
        newManagementInfos.splice(index, 1); // 인덱스에 해당하는 입력 창 제거
        setManagementInfos(newManagementInfos);
    };
    const MIChange = (event, index) => {
        const newManagementInfos = [...managementInfos];
        newManagementInfos[index] = event.target.value;
        setManagementInfos(newManagementInfos);
    };


    // Reference Source 관련 함수
    const addRSInput = () => {
        setReferenceSources([...referenceSources, '']); // 새로운 관리 정보 입력 창 추가
    };
    const popRSInput = (index) => {
        const newreferenceSources = [...referenceSources];
        newreferenceSources.splice(index, 1); // 인덱스에 해당하는 입력 창 제거
        setReferenceSources(newreferenceSources);
    };
    const RSChange = (event, index) => {
        const newreferenceSources = [...referenceSources];
        newreferenceSources[index] = event.target.value;
        setReferenceSources(newreferenceSources);
    };

    // Reference 관련 함수
    const addRInput = () => {
        setReferences([...references, '']);
    };
    const popRInput = (index) => {
        const newReferences = [...references];
        newReferences.splice(index, 1);
        setReferences(newReferences)
    };
    const RChange = (event, index) => {
        const newReferences = [...references];
        newReferences[index] = event.target.value;
        setReferences(newReferences)
    };

    return (
        <div className="container mt-5">
            <div>
                <ItemInput item={item} ItemChange={ItemChange}/>

                <ManagementInfoInput managementInfos={managementInfos} MIChange={MIChange} popMIInput={popMIInput} />
                <button className='mt-3' onClick={addMIInput}>+ Add Management Info</button>

                <ReferenceSourceInput referenceSources={referenceSources} RSChange={RSChange} popRSInput={popRSInput}/>
                <button className='mt-3' onClick={addRSInput}>+ Add Reference Source</button>
                
                <ReferenceInput references={references} RChange={RChange} popRInput={popRInput}/>
                <button className='mt-3' onClick={addRInput}>+ Add Reference</button>
            </div>
            <button className='mt-3' onClick={handleSubmitItem}>Submit</button>
        </div>
    );
}

export default Item;
