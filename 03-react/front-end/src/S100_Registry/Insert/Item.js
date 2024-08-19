import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
import { performValidation, checkPostList } from './validation/ValidateItems.js';
import AttributeConstraints from './components/AttributeConstraints.js';

function Item() {
    const [item, setItem] = useState(null);
    const [managementInfos, setManagementInfos] = useState([]); // 관리 정보 입력 창 배열
    const [referenceSource, setReferenceSource] = useState(null);
    const [references, setReferences] = useState([]);
    const [attributeContsraints, setAttributeContsraints] = useState(null);
    const [selectedApiUrl, setSelectedApiUrl] = useState(POST_CONCEPT_ITEM);
    const [apiType, setApiType] = useState('ConceptItem');
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();

    const validationTest = (validateType) => {
        if (!managementInfos || managementInfos.length === 0) {
            alert('Management Info is required.');
            return;
        }
    
        if (
            performValidation(item, validateType) &&
            (attributeContsraints === null || performValidation(attributeContsraints, 'AttributeConstraints')) &&
            managementInfos.every(info => performValidation(info, 'ManagementInfo')) &&
            (referenceSource === null || performValidation(referenceSource, 'ReferenceSource')) &&
            references.every(ref => performValidation(ref, 'Reference'))
        ) {
            handleSubmitItem();
        }
    };
    

    const regi_uri = sessionStorage.getItem('REGISTRY_URI');

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

            if (attributeContsraints) {
                await axios.post(POST_ATTRIBUTE_CONSTRAINTS, attributeContsraints, {
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
            navigate(`/${sessionStorage.getItem('REGISTRY_URI')}/concept/detail`);
        } catch (error) {
            console.error('Error posting data:', error);
            console.log(item);
        }
    };

    const ItemChange = (formData) => { setItem(formData); };
    const MIChange = (formData) => { setManagementInfos(formData); };
    const RSChange = (formData) => { setReferenceSource(formData); };
    const RChange = (formData) => { setReferences(formData); };
    const ACChange = (formData) => { setAttributeContsraints(formData); };

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
        <div className="p-5">
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


