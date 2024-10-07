import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemInput from './components/ItemInput';
import ManagementInfoInput from './components/ManagementInfoInput';
import ChooseType from './ChooseType';
import { getSelestedApi } from '../api/apiMapping';  // Import the function here
import { POST_SYMBOL, POST_MANAGEMENT_INFO } from '../api/api';  // Import the API URL here
import { POST_SYMBOL_ASSOCIATION, POST_ICON_ASSOCIATION, POST_VIEWING_GROUP_ASSOCIATION, POST_ITEM_SCHEMA_ASSOCIATION, POST_COLOUR_TOKEN_ASSOCIATION, POST_PALETTE_ASSOCIATION, POST_DISPLAY_MODE_ASSOCIATION, POST_MESSAGE_ASSOCIATION, POST_HIGHLIGHT_ASSOCIATION, POST_VALUE_ASSOCIATION } from '../api/api';  // Import the API URL here
import { performValidation } from './validation/ValidateItems';
import axios from 'axios';
import Cookies from 'js-cookie';
import {basicJSONs} from './components/basicJSONs';
import { ItemContext } from '../../../context/ItemContext';
import DynamicItemForm from './components/DynamicItemForm'; // Import the DynamicItemForm component
import DinamicAssociationForm from './components/DinamicAssociationForm'; // Import the DynamicItemForm component

const InsertPortrayalItem = () => {
  const [dynamicFormData, setDynamicFormData] = useState(basicJSONs["Symbol"]);  // State for DynamicItemForm
  const [itemInputData, setItemInputData] = useState(null);      // State for ItemInput
  const [managementInfos, setManagementInfos] = useState([]);    // State for Management Info
  const [selectedApiUrl, setSelectedApiUrl] = useState(POST_SYMBOL);  // Selected API URL
  const [apiType, setApiType] = useState("Symbol");              // Selected API Type
  const regi_uri = Cookies.get('REGISTRY_URI');
  const { setItemDetails } = useContext(ItemContext);
  const navigate = useNavigate();
  const [associationAndAPI, setAssociationAndAPI] = useState([]);

  const associationPostAPI = {
    'symbol': POST_SYMBOL_ASSOCIATION,
    'icon': POST_ICON_ASSOCIATION,
    'viewingGroup': POST_VIEWING_GROUP_ASSOCIATION,
    'itemSchema': POST_ITEM_SCHEMA_ASSOCIATION,
    'colourToken': POST_COLOUR_TOKEN_ASSOCIATION,
    'palette': POST_PALETTE_ASSOCIATION,
    'displayMode': POST_DISPLAY_MODE_ASSOCIATION,
    'msg': POST_MESSAGE_ASSOCIATION,
    'highlight': POST_HIGHLIGHT_ASSOCIATION,
    'value': POST_VALUE_ASSOCIATION,
  }

  // Handler for DynamicItemForm submission
  const handleDynamicFormSubmit = (formData) => { 
    setDynamicFormData(formData); 
    console.log("Form Data Submitted: ", formData);
  };

  // Handler for ItemInput submission
  const handleItemInputSubmit = (formData) => { 
    setItemInputData(formData); 
  };

  // Handler for Management Info submission
  const handleManagementInfoSubmit = (formData) => { 
    setManagementInfos(formData); 
  };

  // Reset all form data when apiType changes
  useEffect(() => {
    setDynamicFormData(null);
    setItemInputData(null);
    setManagementInfos([]);
    setAssociationAndAPI([]);
  }, [apiType]);

  const validationData = {
    Symbol: dynamicFormData,
    LineStyle: dynamicFormData,
    AreaFill: dynamicFormData,
    Pixmap: dynamicFormData,
    SymbolSchema: dynamicFormData,
    LineStyleSchema: dynamicFormData,
    AreaFillSchema: dynamicFormData,
    PixmapSchema: dynamicFormData,
    ColourProfileSchema: dynamicFormData,
    ColourToken: dynamicFormData,
    PaletteItem: dynamicFormData,
    ColourPalette: dynamicFormData,
    DisplayPlane: dynamicFormData,
    DisplayMode: dynamicFormData,
    ViewingGroupLayer: dynamicFormData,
    ViewingGroup: dynamicFormData,
    Font: dynamicFormData,
    ContextParameter: dynamicFormData,
    DrawingPriority: dynamicFormData,
    Alert: dynamicFormData,
    AlertHighlight: dynamicFormData,
    AlertMessage: dynamicFormData,
    ManagementInfo: managementInfos,
  };

  const validationTest = (validateType) => {
    let errorMessages = [];

    // 1. Check if itemInputData and managementInfos (MI) are provided
    if (!itemInputData) {
      errorMessages.push('- Concept Information is required');
    }

    if (!managementInfos || managementInfos.length === 0) {
      errorMessages.push('- Management Information is required.');
    }

    // If there are any missing itemInputData or MI, alert and stop further validation
    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'));
      return;
    }

    // 2. Validate itemInputData as a ConceptItem
    if (!performValidation(itemInputData, 'ConceptItem')) {
      return; // Validation failed, performValidation will handle the alert
    }

    // 3. Validate Management Info (MI)
    for (let i = 0; i < managementInfos.length; i++) {
      if (!performValidation(managementInfos[i], 'ManagementInfo')) {
        return; // Validation failed for MI, performValidation will handle the alert
      }
    }

    // 4. Validate the specific type (visual, schema, colourToken, paletteItem) based on validateType
    const dataToValidate = validationData[validateType];

    if (!dataToValidate || !performValidation(dataToValidate, validateType)) {
      return; // Validation failed for the specific type
    }

    combiningData(validateType);
  };

  const combiningData = (validateType) => {
    const mainData = validationData[validateType] || {}; // Ensure mainData is not null

    const combinedData = {
      ...itemInputData,    // itemInputData 데이터를 병합
      ...mainData,         // main 데이터를 병합
    };

    handleSubmitItem(combinedData);
  };

  const handleSubmitItem = async (combinedData) => {
    console.log('Combined Data:', combinedData, managementInfos);

    // FormData 객체 생성
    const formData = new FormData();

    // combinedData를 FormData로 변환
    Object.keys(combinedData).forEach(key => {
        const value = combinedData[key];
        if (value instanceof File) {
            formData.append(key, value); // 파일 처리
        } else if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value)); // JSON 데이터 처리
        } else {
            formData.append(key, value); // 일반 텍스트 데이터 처리
        }
    });

    // 관리 정보도 추가
    managementInfos.forEach((info, index) => {
        formData.append(`managementInfo[${index}]`, JSON.stringify(info));
    });

    try {
        // 첫 번째 POST 요청
        const itemResponse = await axios.post(
            selectedApiUrl,
            formData,  // FormData로 전송
            {
                params: {
                    regi_uri: regi_uri,
                },
                headers: {
                    'Content-Type': 'multipart/form-data',  // FormData를 전송할 때는 이 헤더 필요
                },
            }
        );

        const itemId = itemResponse.data.encrypted_data;
        const item_iv = itemResponse.data.iv;

        // 관리 정보에 대한 POST 요청들 (for-of로 순차 처리)
        for (const managementInfo of managementInfos) {
            await axios.post(POST_MANAGEMENT_INFO, managementInfo, {
                params: {
                    item_id: itemId,
                    item_iv: item_iv,
                }
            });
        }

        // associationAndAPI에 값이 있는지 확인 후 POST 요청
        if (associationAndAPI.length > 0) {
            for (const association of associationAndAPI) {
                await axios.post(association.api, association.data, {
                    params: {
                        item_id: itemId,
                        item_iv: item_iv,
                    }
                });
            }
        } else {
            console.log('No associations to post');
        }

        // 모든 POST 요청 완료 후 아이템 정보 설정 및 페이지 이동
        setItemDetails({
            item_id: itemId,
            item_iv: item_iv,
            item_type: apiType,
        });

        // 모든 요청 완료 후 navigate 실행
        navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/detail`);

    } catch (error) {
        // 에러 핸들링
        console.error('Error posting data:', error);
        console.log('FormData:', formData); // FormData 확인용
    }
};


  const log = () => { console.log(itemInputData); }
  const dynamicLog = () => { console.log(dynamicFormData); }
  const apiLog = () => { console.log(selectedApiUrl, apiType); }
  const MILog = () => { console.log(managementInfos); }
  const assAPILog = () => { console.log(associationAndAPI); }
  
  const handleAssociation = (updatedData) => { 
      const parsedData = Object.keys(updatedData).reduce((acc, key) => {
          try {
              acc[key] = JSON.parse(updatedData[key]); // JSON 형태면 파싱
          } catch (e) {
              acc[key] = updatedData[key]; // JSON이 아니면 그대로 유지
          }
          return acc;
      }, {});
  
      setAssociationAndAPI(prevState => {
          // 업데이트된 배열을 처리하기 위해 복사
          let updatedState = [...prevState];
  
          Object.keys(parsedData).forEach(key => {
              if (associationPostAPI[key]) {  
                  const existingIndex = updatedState.findIndex(item => item.api === associationPostAPI[key]);
  
                  if (existingIndex !== -1) {
                      // 이미 존재하면 해당 항목을 업데이트
                      updatedState[existingIndex] = {
                          api: associationPostAPI[key], 
                          data: { "child_id": parsedData[key] }
                      };
                  } else {
                      // 존재하지 않으면 새로운 항목을 추가
                      updatedState.push({
                          api: associationPostAPI[key], 
                          data: { "child_id": parsedData[key] }
                      });
                  }
              } else {
                  console.log(`No API found for ${key}`);
              }
          });
  
          return updatedState; // 최종 업데이트된 배열 반환
      });
  };
  
  return (
    <>
      <button onClick={log}>log</button>
      <button onClick={apiLog}>api</button>
      <button onClick={MILog}>MI</button>
      <button onClick={dynamicLog}>dynamic</button>
      <button onClick={assAPILog}>association</button>
      <div>
        <ChooseType getSelestedApi={(type) => getSelestedApi(type, setSelectedApiUrl, setApiType)} /> 
      </div>
      
      <div>
        {/* Render the dynamic form based on the selected apiType */} 
        <DynamicItemForm itemType={apiType} onFormSubmit={handleDynamicFormSubmit} />
      </div>
      <div>
        <DinamicAssociationForm itemType={apiType}  onFormSubmit={handleAssociation}/>
      </div>
      <div>
        {/* Render ItemInput separately */} 
        <ItemInput onFormSubmit={handleItemInputSubmit} apiType={apiType} />
      </div>

      <div>
        <ManagementInfoInput onFormSubmit={handleManagementInfoSubmit} apiType={apiType} />
      </div>

      <div className='text-end'>
          <button className='mt-3 btn btn-sm btn-primary' onClick={() => validationTest(apiType)}>Submit</button>
      </div>
      <div style={{ height: '200px' }}></div>
    </>
  )
}

export default InsertPortrayalItem;
