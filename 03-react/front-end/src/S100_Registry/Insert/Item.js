import React, { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { POST_MANAGEMENT_INFO, POST_REFERENCE_SOURCE , POST_REFERENCE } from '../Concept/api';
import { POST_ENUMERATED_VALUE, POST_SIMPLE_ATTRIBUTE, POST_COMPLEX_ATTRIBUTE, POST_FEATURE, POST_INFORMATION, POST_CONCEPT_ITEM } from '../DataDictionary/api.js';
import ManagementInfoInput from './components/ManagementInfoInput';
import ReferenceSourceInput from './components/ReferenceSourceInput';
import ReferenceInput from './components/ReferenceInput';
import ChooseType from './ChooseType';
import ItemInput from './components/dataDictionary/ItemInput';
import SimpleAttribute from './components/dataDictionary/SimpleAttribute';
import ComplexAttribute from './components/dataDictionary/ComplexAttribute';
import Feature from './components/dataDictionary/Feature';
import Information from './components/dataDictionary/Information';
import EnumeratedValue from './components/dataDictionary/EnumeratedValue';
import {USER_SERIAL} from '../../userSerial.js';
import { ItemContext } from '../../context/ItemContext';

function Item() {
    const [item, setItem] = useState('');
    const [managementInfos, setManagementInfos] = useState(['']); // 관리 정보 입력 창 배열
    const [referenceSource, setReferenceSource] = useState(null);
    const [references, setReferences] = useState(null);
    const { register_id } = useParams();
    const [selectedApiUrl, setSelectedApiUrl] = useState(POST_CONCEPT_ITEM);
    const [apiType, setApiType] = useState('Concept Item');
    const { setItemDetails } = useContext(ItemContext); 
    const navigate = useNavigate(); 

    const handleSubmitItem = async () => {
        try {
            // const itemData = JSON.parse(item);
            const itemResponse = await axios.post(
                selectedApiUrl, 
                item, 
                {
                    params: {
                        user_serial: USER_SERIAL
                    }
                });
            console.log('Item data successfully posted ~:', itemResponse.data);

            // Item 데이터를 selectedApiUrl로 POST 후 Item의 ID 가져오기
            const itemId = itemResponse.data.encrypted_data;
            const item_iv = itemResponse.data.iv;

            // 모든 MI에 대해 작업하는 for 문
            for (const managementInfo of managementInfos) {

                // Management Info를 저장할 URL 생성 후 POST
                await axios.post(POST_MANAGEMENT_INFO, managementInfo, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }

            // RS에 대해 작업
            if (referenceSource) {
                await axios.post(POST_REFERENCE_SOURCE, referenceSource, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }

            // 모든 R에 대해 작업
            if (references != null) {
                for(const reference of references) {
                    if (reference) {
                        await axios.post(POST_REFERENCE, reference, {
                            params: {
                                item_id: itemId,
                                item_iv: item_iv,
                            }
                        });
                    }
                }
            }
            setItemDetails({ 
                item_id: itemId,
                item_iv: item_iv
            });
            navigate('/concept/detail');
        } catch (error) {
            console.error('Error posting data:', error);
            console.log(item)
        }
    };


    const ItemChange = (formData) => {setItem(formData);};
    const MIChange = (formData) => {setManagementInfos(formData);};
    const RSChange = (formData) => {setReferenceSource(formData);};
    const RChange = (formData) => {setReferences(formData);};

    const getSelestedApi = (type) => {
        console.log(type);
        switch (type) {
            case 'Concept Item':
                setSelectedApiUrl(POST_CONCEPT_ITEM);
                setApiType('Concept Item');
                break;
            case 'Enumerated value':
                setSelectedApiUrl(POST_ENUMERATED_VALUE);
                setApiType('Enumerated Value');
                break;
            case 'Simple Attribute':
                setSelectedApiUrl(POST_SIMPLE_ATTRIBUTE);
                setApiType('Simple Attribute');
                break;
            case 'Complex Attribute':
                setSelectedApiUrl(POST_COMPLEX_ATTRIBUTE);
                setApiType('Complex Attribute');
                break;
            case 'Feature':
                setSelectedApiUrl(POST_FEATURE);
                setApiType('Feature');
                break;
            case 'Information':
                setSelectedApiUrl(POST_INFORMATION);
                setApiType('Information');
                break;
            default:
                break;
        }
    };

    return (
        <div className="container p-5">
            <div style={{display: "flex"}}>
                <h1>Create Data</h1>
            </div>
            <ChooseType getSelestedApi={getSelestedApi} />
            <div className='mt-1'>
                {apiType === 'Concept Item' && <ItemInput item={item} onFormSubmit={ItemChange} registerId={register_id} selectedApiUrl={selectedApiUrl}/>}
                {apiType === 'Enumerated Value' && <EnumeratedValue item={item} onFormSubmit={ItemChange} registerId={register_id} selectedApiUrl={selectedApiUrl}/>}
                {apiType === 'Simple Attribute' && <SimpleAttribute item={item} onFormSubmit={ItemChange} registerId={register_id} selectedApiUrl={selectedApiUrl}/>}
                {apiType === 'Complex Attribute' && <ComplexAttribute item={item} onFormSubmit={ItemChange} registerId={register_id} selectedApiUrl={selectedApiUrl}/>}
                {apiType === 'Feature' && <Feature item={item} onFormSubmit={ItemChange} registerId={register_id} selectedApiUrl={selectedApiUrl}/>}
                {apiType === 'Information' && <Information item={item} onFormSubmit={ItemChange} registerId={register_id} selectedApiUrl={selectedApiUrl}/>}
                <ManagementInfoInput onFormSubmit={MIChange} />
                <ReferenceSourceInput onFormSubmit={RSChange} />
                <ReferenceInput onFormSubmit={RChange} />
            </div>
            <div className='text-end'>
                <button className='mt-3 btn btn-sm btn-primary' onClick={handleSubmitItem}>Submit</button>
            </div>
            <div style={{height: '200px'}}></div>
        </div>
    );
}

export default Item;
