import React, { useState } from 'react';
import axios from 'axios';
import { CREATE_ITEM_URL } from '../api';
import ItemInput from './components/ItemInput';
import ManagementInfoInput from './components/ManagementInfoInput';
import ReferenceSourceInput from './components/ReferenceSourceInput';
import ReferenceInput from './components/ReferenceInput';


// CREATE_MI_URL을 동적으로 생성하는 함수
const createManagementInfoUrl = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/managementInfo/post/`;
};

// CREATE_MI_URL을 동적으로 생성하는 함수
const createReferenceSourceUrl = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

// CREATE_MI_URL을 동적으로 생성하는 함수
const createReferenceUrl = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/reference/post/`;
};

function Item() {
    const [item, setItem] = useState('');
    const [managementInfos, setManagementInfos] = useState(['']); // 관리 정보 입력 창 배열
    const [referenceSource, setReferenceSource] = useState(null);
    const [references, setReferences] = useState(null);

    const handleSubmitItem = async () => {
        try {
            // const itemData = JSON.parse(item);
            const itemResponse = await axios.post(CREATE_ITEM_URL, item);
            console.log('Item data successfully posted:', itemResponse.data);

            // Item 데이터를 CREATE_ITEM_URL로 POST 후 Item의 ID 가져오기
            const itemId = itemResponse.data.id;

            // 모든 MI에 대해 작업하는 for 문
            for (const managementInfo of managementInfos) {
                // if (managementInfo.trim() === '') continue; // 빈 데이터는 무시

                // Management Info를 저장할 URL 생성 후 POST
                const miUrl = createManagementInfoUrl(itemId);
                const MIResponse = await axios.post(miUrl, managementInfo);
                console.log('Management Info data successfully posted:', MIResponse);
            }

            // RS에 대해 작업
            if (referenceSource) {
                const rsUrl = createReferenceSourceUrl(itemId);
                const RSResponse = await axios.post(rsUrl, referenceSource);
                console.log('Reference Source data successfully posted:', RSResponse);
            }

            // 모든 R에 대해 작업
            if (references != null) {
                for(const reference of references) {
                    if (reference) {
                        const rUrl = createReferenceUrl(itemId);
                        const RResponse = await axios.post(rUrl, reference);
                        console.log('Reference data successfully posted:', RResponse);
                    }
                }
            }
            window.location.href = `/detail/${itemId}`;
        } catch (error) {
            console.error('Error posting data:', error);
            console.log(item)
        }
    };


    // Item 관련 함수
    const ItemChange = (formData) => {setItem(formData);};
    
    // Management Info 관련 함수
    const MIChange = (formData) => {setManagementInfos(formData);};

    // Reference Source 관련 함수
    const RSChange = (formData) => {setReferenceSource(formData);};

    // Reference 관련 함수
    const RChange = (formData) => {setReferences(formData);};

    return (
        <div className="container mt-5">
            <div style={{height: '70px'}}></div>
            <div>
                <h1>Regist Data</h1>
            </div>
            <div className='mt-5'>
                <ItemInput item={item} onFormSubmit={ItemChange}/>
                <ManagementInfoInput onFormSubmit={MIChange}/>
                <ReferenceSourceInput onFormSubmit={RSChange}/>
                <ReferenceInput onFormSubmit={RChange}/>
            </div>
            <div className='text-end'>
                <button className='mt-3 btn btn-sm btn-primary' onClick={handleSubmitItem}>Submit</button>
            </div>
            <div style={{height: '200px'}}></div>
        </div>
    );
}

export default Item;
