import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { POST_MANAGEMENT_INFO, POST_REFERENCE_SOURCE, POST_REFERENCE } from '../Concept/api';
import { POST_ENUMERATED_VALUE, POST_SIMPLE_ATTRIBUTE, POST_COMPLEX_ATTRIBUTE, POST_FEATURE, POST_INFORMATION, POST_CONCEPT_ITEM, POST_ATTRIBUTE_CONSTRAINTS } from '../DataDictionary/api.js';
import { POST_CONCEPT_ITEM_IHO, POST_MANAGEMENT_INFO_IHO, POST_REFERENCE_SOURCE_IHO, POST_REFERENCE_IHO, 
POST_SIMPLE_ATTRIBUTE_IHO, POST_COMPLEX_ATTRIBUTE_IHO, POST_ENUMERATED_VALUE_IHO, POST_FEATURE_IHO, POST_INFORMATION_IHO
} from '../DataDictionary/api.js';
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
import { ItemContext } from '../../context/ItemContext';
import { performValidation } from './validation/ValidateItems.js';
import AttributeConstraints from './components/AttributeConstraints.js';
import { getDecryptedItem, setEncryptedItem } from "../../cryptoComponent/storageUtils";
import { useLocation } from 'react-router-dom';

function Item() {
    const [item, setItem] = useState(null);
    const [managementInfos, setManagementInfos] = useState([]); // 관리 정보 입력 창 배열
    const [referenceSource, setReferenceSource] = useState(null);
    const [references, setReferences] = useState([]);
    const [attributeConstraints, setAttributeConstraints] = useState(null);
    const [selectedApiUrl, setSelectedApiUrl] = useState(POST_CONCEPT_ITEM);
    const [apiType, setApiType] = useState('ConceptItem');
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();
    const regi_uri = getDecryptedItem('REGISTRY_URI');
    const location = useLocation();
    
    // const createViewType = Cookies.get('createViewType');
    const createViewType = location.state?.createViewType;
    const isIHO = location.state?.isIHO;
    // console.log('isIHO:', isIHO);
    // console.log('selectedApiUrl:', selectedApiUrl);

    useEffect(() => {
        console.log('>>> useEffect 진입 / isIHO:', isIHO);  // 디버깅용
        if (createViewType) {
            getSelestedApi(createViewType)
        }
        const role = getDecryptedItem('role');
        if (!role || role === 'guest') {
            alert('권한이 없습니다. 접근이 제한됩니다.');
            navigate(`/${regi_uri}`); // 권한이 없으면 메인 페이지로 리디렉션
        }
    }, [navigate]);

    const validationTest = (validateType) => {
        if (!managementInfos || managementInfos.length === 0) {
            alert('Management Info is required.');
            return;
        }
    
        if (
            performValidation(item, validateType) &&
            (attributeConstraints === null || performValidation(attributeConstraints, 'AttributeConstraints')) &&
            managementInfos.every(info => performValidation(info, 'ManagementInfo')) &&
            (referenceSource === null || performValidation(referenceSource, 'ReferenceSource')) &&
            references.every(ref => performValidation(ref, 'Reference'))
        ) {
            const result = window.confirm('Do you want to submit?');
            if (result) {
                handleSubmitItem();
            }
        }
    };

    const handleSubmitItem = async () => {
        try {
            // 메인 아이템 등록 (isIHO 여부에 따라 이미 selectedApiUrl은 설정되어 있음)
            console.log('selectedApiUrl:', selectedApiUrl); // 디버깅용
            const itemResponse = await axios.post(
                selectedApiUrl,
                item,
                {
                    params: {
                        regi_uri: regi_uri,
                    }
                });
    
            const itemId = itemResponse.data.encrypted_data;
            const item_iv = itemResponse.data.iv;
    
            // AttributeConstraints는 공통 처리
            if (attributeConstraints) {
                await axios.post(POST_ATTRIBUTE_CONSTRAINTS, attributeConstraints, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }
    
            // 관리 정보 (ManagementInfo)
            const managementApi = isIHO ? POST_MANAGEMENT_INFO_IHO : POST_MANAGEMENT_INFO;
            for (const managementInfo of managementInfos) {
                await axios.post(managementApi, managementInfo, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }
    
            // 참조 소스 (Reference Source)
            const referenceSourceApi = isIHO ? POST_REFERENCE_SOURCE_IHO : POST_REFERENCE_SOURCE;
            if (referenceSource) {
                await axios.post(referenceSourceApi, referenceSource, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }
    
            // 참조 정보 (References)
            const referenceApi = isIHO ? POST_REFERENCE_IHO : POST_REFERENCE;
            for (const reference of references) {
                if (reference) {
                    await axios.post(referenceApi, reference, {
                        params: {
                            item_id: itemId,
                            item_iv: item_iv,
                        }
                    });
                }
            }
    
            // 완료 후 itemDetails 설정 및 이동
            setItemDetails({
                item_id: itemId,
                item_iv: item_iv
            });
            if (isIHO) {
                navigate(`/${getDecryptedItem('REGISTRY_URI')}/iho-concept/detail`);
            } else {
                navigate(`/${getDecryptedItem('REGISTRY_URI')}/concept/detail`);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    

    const ItemChange = (formData) => { setItem(formData); };
    const MIChange = (formData) => { setManagementInfos(formData); };
    const RSChange = (formData) => { setReferenceSource(formData); };
    const RChange = (formData) => { setReferences(formData); };
    const ACChange = (formData) => { setAttributeConstraints(formData); };

    const getSelestedApi = (type) => {
        if (isIHO) {
            // ✅ IHO용 API 선택
            switch (type) {
                case 'ConceptItem':
                    setSelectedApiUrl(POST_CONCEPT_ITEM_IHO);
                    setApiType('ConceptItem');
                    break;
                case 'EnumeratedValue':
                    setSelectedApiUrl(POST_ENUMERATED_VALUE_IHO); // IHO 전용 없으면 공통 사용
                    setApiType('EnumeratedValue');
                    break;
                case 'SimpleAttribute':
                    setSelectedApiUrl(POST_SIMPLE_ATTRIBUTE_IHO); // IHO 전용 없으면 공통 사용
                    setApiType('SimpleAttribute');
                    break;
                case 'ComplexAttribute':
                    setSelectedApiUrl(POST_COMPLEX_ATTRIBUTE_IHO); // 동일
                    setApiType('ComplexAttribute');
                    break;
                case 'FeatureType':
                    setSelectedApiUrl(POST_FEATURE_IHO); // 동일
                    setApiType('FeatureType');
                    break;
                case 'InformationType':
                    setSelectedApiUrl(POST_INFORMATION_IHO); // 동일
                    setApiType('InformationType');
                    break;
                // 필요 시 IHO Reference Source / Management Info 분기도 추가 가능
                default:
                    break;
            }
        } else {
            // ✅ 일반 API 선택
            switch (type) {
                case 'ConceptItem':
                    setSelectedApiUrl(POST_CONCEPT_ITEM);
                    setApiType('ConceptItem');
                    break;
                case 'EnumeratedValue':
                    setSelectedApiUrl(POST_ENUMERATED_VALUE);
                    setApiType('EnumeratedValue');
                    break;
                case 'SimpleAttribute':
                    setSelectedApiUrl(POST_SIMPLE_ATTRIBUTE);
                    setApiType('SimpleAttribute');
                    break;
                case 'ComplexAttribute':
                    setSelectedApiUrl(POST_COMPLEX_ATTRIBUTE);
                    setApiType('ComplexAttribute');
                    break;
                case 'FeatureType':
                    setSelectedApiUrl(POST_FEATURE);
                    setApiType('FeatureType');
                    break;
                case 'InformationType':
                    setSelectedApiUrl(POST_INFORMATION);
                    setApiType('InformationType');
                    break;
                default:
                    break;
            }
        }
    };
    

    return (
        <div>
            <ChooseType getSelestedApi={getSelestedApi} />

            <div className='mt-1'>
                {apiType === 'ConceptItem' && <ItemInput item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'EnumeratedValue' && <EnumeratedValue item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'SimpleAttribute' && <SimpleAttribute item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'ComplexAttribute' && <ComplexAttribute item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'FeatureType' && <Feature item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'InformationType' && <Information item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {!isIHO && apiType === 'SimpleAttribute' && (
                    <AttributeConstraints onFormSubmit={ACChange} />
                    )}
                <ManagementInfoInput onFormSubmit={MIChange} />
                <ReferenceSourceInput onFormSubmit={RSChange} />
                <ReferenceInput onFormSubmit={RChange} />
            </div>
            <div className='text-end'>
                <button className='mt-3 btn btn-sm btn-primary' onClick={() => validationTest(apiType)}>Submit</button>
            </div>
            <div style={{ height: '200px' }}></div>

        </div>
    );
}

export default Item;
