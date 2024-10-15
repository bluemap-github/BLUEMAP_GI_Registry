import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { POST_MANAGEMENT_INFO, POST_REFERENCE_SOURCE, POST_REFERENCE } from '../Concept/api';
import { POST_ENUMERATED_VALUE, POST_SIMPLE_ATTRIBUTE, POST_COMPLEX_ATTRIBUTE, POST_FEATURE, POST_INFORMATION, POST_CONCEPT_ITEM, POST_ATTRIBUTE_CONSTRAINTS } from '../DataDictionary/api.js';
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

function Item() {
    const createViewType = Cookies.get('createViewType');
    const [item, setItem] = useState(null);
    const [managementInfos, setManagementInfos] = useState([]); // 관리 정보 입력 창 배열
    const [referenceSource, setReferenceSource] = useState(null);
    const [references, setReferences] = useState([]);
    const [attributeConstraints, setAttributeConstraints] = useState(null);
    const [selectedApiUrl, setSelectedApiUrl] = useState(POST_CONCEPT_ITEM);
    const [apiType, setApiType] = useState('ConceptItem');
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();
    const regi_uri = Cookies.get('REGISTRY_URI');

    useEffect(() => {
        if (createViewType) {
            setSelectedApiUrl(createViewType)
        }
        const role = Cookies.get('role');
        // if (!role || role === 'guest') {
        //     alert('권한이 없습니다. 접근이 제한됩니다.');
        //     navigate(`/${regi_uri}`); // 권한이 없으면 메인 페이지로 리디렉션
        // }
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
            handleSubmitItem();
        }
    };

    const handleSubmitItem = async () => {
        try {
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

            if (attributeConstraints) {
                await axios.post(POST_ATTRIBUTE_CONSTRAINTS, attributeConstraints, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }

            for (const managementInfo of managementInfos) {
                await axios.post(POST_MANAGEMENT_INFO, managementInfo, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }

            if (referenceSource) {
                await axios.post(POST_REFERENCE_SOURCE, referenceSource, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }

            for (const reference of references) {
                if (reference) {
                    await axios.post(POST_REFERENCE, reference, {
                        params: {
                            item_id: itemId,
                            item_iv: item_iv,
                        }
                    });
                }
            }
            setItemDetails({
                item_id: itemId,
                item_iv: item_iv
            });
            navigate(`/${Cookies.get('REGISTRY_URI')}/concept/detail`);
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
        <div>
            <ChooseType getSelestedApi={getSelestedApi} />

            <div className='mt-1'>
                {apiType === 'ConceptItem' && <ItemInput item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'EnumeratedValue' && <EnumeratedValue item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'SimpleAttribute' && <SimpleAttribute item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'ComplexAttribute' && <ComplexAttribute item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'Feature' && <Feature item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'Information' && <Information item={item} onFormSubmit={ItemChange} selectedApiUrl={selectedApiUrl} />}
                {apiType === 'SimpleAttribute' && <AttributeConstraints onFormSubmit={ACChange} />}
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
