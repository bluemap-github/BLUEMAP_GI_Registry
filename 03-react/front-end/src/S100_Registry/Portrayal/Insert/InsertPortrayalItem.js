import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemInput from './components/ItemInput';
import ManagementInfoInput from './components/ManagementInfoInput';
import ChooseType from './ChooseType';
import { getSelestedApi } from '../api/apiMapping';  // Import the function here
import { POST_SYMBOL, POST_MANAGEMENT_INFO, POST_ALERT_INFO, POST_ALERT} from '../api/api';  // Import the API URL here
import { POST_SYMBOL_ASSOCIATION, POST_ICON_ASSOCIATION, POST_VIEWING_GROUP_ASSOCIATION, POST_ITEM_SCHEMA_ASSOCIATION, POST_COLOUR_TOKEN_ASSOCIATION, POST_PALETTE_ASSOCIATION, POST_DISPLAY_MODE_ASSOCIATION, POST_MESSAGE_ASSOCIATION, POST_HIGHLIGHT_ASSOCIATION, POST_VALUE_ASSOCIATION } from '../api/api';  // Import the API URL here
import { performValidation } from './validation/ValidateItems';
import axios from 'axios';
import Cookies from 'js-cookie';
import {basicJSONs} from './components/basicJSONs';
import { ItemContext } from '../../../context/ItemContext';
import DynamicItemForm from './components/DynamicItemForm'; // Import the DynamicItemForm component
import DynamicAssociationForm from './components/DynamicAssociationForm'; // Import the DynamicItemForm component
import AlertInfoInput from './components/AlertInfoInput'; // Import the DynamicItemForm component

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

const InsertPortrayalItem = () => {
  const navigate = useNavigate();
  const createViewType = Cookies.get('createViewType');

  useEffect(() => {
    
    if (createViewType) { // createViewType이 존재하면 처리
      
      // API와 관련된 세팅을 업데이트
      getSelestedApi(createViewType, setSelectedApiUrl, setApiType, setPostType);
      setDynamicFormData(basicJSONs[createViewType] || basicJSONs["Symbol"]);
      
      // 쿠키 삭제
      Cookies.remove('createViewType');
    }
  }, [createViewType, navigate]);

  const [dynamicFormData, setDynamicFormData] = useState(basicJSONs["Symbol"]);  // State for DynamicItemForm
  const [selectedApiUrl, setSelectedApiUrl] = useState(POST_SYMBOL);  // Selected API URL
  const [apiType, setApiType] = useState("Symbol");  

  const [postType, setPostType] = useState("formData");  
  const [itemInputData, setItemInputData] = useState(null);      // State for ItemInput
  const [managementInfos, setManagementInfos] = useState([]);    // State for Management Info
  const regi_uri = Cookies.get('REGISTRY_URI');
  const { setItemDetails } = useContext(ItemContext);
  
  const [associationAndAPI, setAssociationAndAPI] = useState([]);



  // Handler for DynamicItemForm submission
  const handleDynamicFormSubmit = (formData) => { 
    setDynamicFormData(formData); 
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
    
    const confirmSubmit = window.confirm("Are you sure you want to submit this Item?");
    if (!confirmSubmit) return; // Exit if the user cancels
    if (validateType === 'Alert') {
      alertMadeInsertItem(combinedData);
    } else {
      handleSubmitItem(combinedData);
    }
  };
  
  const alertMadeInsertItem = async (data) => {
    const AlertInfoIds = {
      routeMonitor: [],
      routePlan: [],
    };
    const routeMonitorData = [...data.routeMonitor];
    const routePlanData = [...data.routePlan];
    
    data.routeMonitor = [];
    data.routePlan = [];
    
    // 병렬 처리를 위한 Promise 배열 생성
    const monitorPromises = routeMonitorData.flatMap((monitorItem, i) =>
      monitorItem.alertInfoList?.map((alertInfo, j) =>
        axios.post(POST_ALERT_INFO, alertInfo, { params: { regi_uri } })
          .then(response => {
            console.log(`Route Monitor AlertInfoList [${i}][${j}] API Response:`, response.data.inserted_id);
            AlertInfoIds.routeMonitor.push(response.data.inserted_id);
          })
          .catch(error => {
            console.error(`Error posting Route Monitor AlertInfoList [${i}][${j}]:`, error);
          })
      ) || []
    );
  
    const planPromises = routePlanData.flatMap((planItem, i) =>
      planItem.alertInfoList?.map((alertInfo, j) =>
        axios.post(POST_ALERT_INFO, alertInfo, { params: { regi_uri } })
          .then(response => {
            console.log(`Route Plan AlertInfoList [${i}][${j}] API Response:`, response.data.inserted_id);
            AlertInfoIds.routePlan.push(response.data.inserted_id);
          })
          .catch(error => {
            console.error(`Error posting Route Plan AlertInfoList [${i}][${j}]:`, error);
          })
      ) || []
    );
  
    // 모든 요청 병렬로 처리
    await Promise.all([...monitorPromises, ...planPromises]);
  
    data.routeMonitor = AlertInfoIds.routeMonitor;
    data.routePlan = AlertInfoIds.routePlan;
  
  
    try {
      const itemResponse = await axios.post(
        POST_ALERT,
        data,
        {
          params: { regi_uri },
        }
      );
      const itemId = itemResponse.data.encrypted_data;
      const item_iv = itemResponse.data.iv;
  
      // 관리 정보에 대한 별도의 POST 요청들 (for-of로 순차 처리)
      for (const managementInfo of managementInfos) {
        await axios.post(POST_MANAGEMENT_INFO, managementInfo, {
          params: { item_id: itemId, item_iv: item_iv }
        });
      }

      // routeMonitorData의 associationAndAPI 부분을 처리
      for (let i = 0; i < AlertInfoIds.routeMonitor.length; i++) {
        const parentId = AlertInfoIds.routeMonitor[i];
        const associationAndAPI = routeMonitorData[i].associationAndAPI || [];
        
        for (let j = 0; j < associationAndAPI.length; j++) {
          const association = associationAndAPI[j];
      
          if (Array.isArray(association.value) && association.value.length === 1 && Object.keys(association.value[0]).length === 0) {
            continue;
          } else {
            const associationData = {
              parent_id: parentId,
              child_id: association.value,
            };
  
            try {
              const associationResponse = await axios.post(association.key, associationData);
              console.log(`Association POST [${i}][${j}] Response:`, associationResponse.data);
            } catch (error) {
              console.error(`Error posting association [${i}][${j}]:`, error);
            }
          }
        }
      }
  
      // routePlanData의 associationAndAPI 부분도 처리
      for (let i = 0; i < AlertInfoIds.routePlan.length; i++) {
        const parentId = AlertInfoIds.routePlan[i];
        const associationAndAPI = routePlanData[i].associationAndAPI || [];
        
        for (let j = 0; j < associationAndAPI.length; j++) {
          const association = associationAndAPI[j];
  
          if (Array.isArray(association.value) && association.value.length === 1 && Object.keys(association.value[0]).length === 0) {
            continue;
          } else {
            const associationData = {
              parent_id: parentId,
              child_id: association.value,
            };
  
            try {
              const associationResponse = await axios.post(association.key, associationData);
              console.log(`Association POST [${i}][${j}] Response:`, associationResponse.data);
            } catch (error) {
              console.error(`Error posting association [${i}][${j}]:`, error);
            }
          }
        }
      }
  
      // 모든 POST 요청 완료 후 아이템 정보 설정 및 페이지 이동
      setItemDetails({ item_id: itemId, item_iv: item_iv, item_type: "Alert" });
      alert('Item created successfully!');
  
      // 페이지 이동
      navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/detail`);
  
    } catch (error) {
      // 에러 핸들링
      console.error('Error posting data:', error);
    }
  };
  

  
  
  
  
  

  const handleSubmitItem = async (combinedData) => {

      let dataToSend;
      let headers = {};
      
      if (postType === 'formData') {
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

          // FormData로 전송할 데이터와 헤더 설정
          dataToSend = formData;
          headers['Content-Type'] = 'multipart/form-data';

      } else if (postType === 'json') {
          // JSON으로 전송할 데이터 설정
          dataToSend = combinedData;

          headers['Content-Type'] = 'application/json'; // JSON 헤더 설정
      }

      try {
          // 첫 번째 POST 요청 (아이템 데이터 전송)
          const itemResponse = await axios.post(
              selectedApiUrl,
              dataToSend,  // postType에 따라 formData 또는 json으로 전송
              {
                  params: {
                      regi_uri: regi_uri,
                  },
                  headers: headers,
              }
          );
          const itemId = itemResponse.data.encrypted_data;
          const item_iv = itemResponse.data.iv;

          // 관리 정보에 대한 별도의 POST 요청들 (for-of로 순차 처리)
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
          alert('Item created successfully!');
          // 모든 요청 완료 후 navigate 실행
          navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/detail`);

      } catch (error) {
          // 에러 핸들링
          console.error('Error posting data:', error);
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
        let updatedState = [...prevState];

        Object.keys(parsedData).forEach(key => {
            if (associationPostAPI[key]) {
                const childIds = Array.isArray(parsedData[key])
                    ? parsedData[key]
                          .filter(entry => entry.encrypted_data && entry.iv)  // 유효한 데이터만 필터링
                          .map(entry => ({ encrypted_data: entry.encrypted_data, iv: entry.iv }))
                    : [{ encrypted_data: parsedData[key].encrypted_data, iv: parsedData[key].iv }];

                // 중복된 child_id를 제거하는 로직
                childIds.forEach(child => {
                    const alreadyExists = updatedState.some(stateItem => 
                        stateItem.api === associationPostAPI[key] && 
                        stateItem.data.child_id.some(existingChild => 
                            existingChild.encrypted_data === child.encrypted_data &&
                            existingChild.iv === child.iv
                        )
                    );
                    
                    if (!alreadyExists) {
                        updatedState.push({
                            api: associationPostAPI[key], 
                            data: { "child_id": [child] }  // 각 child_id에 대해 별도로 POST 요청 생성
                        });
                    }
                });
            } else {
                console.log(`No API found for ${key}`);
            }
        });

        return updatedState; // 최종 업데이트된 배열 반환
    });
  };


  return (
    <>
      <div> 
        <ChooseType initial={apiType} getSelestedApi={(type) => getSelestedApi(type, setSelectedApiUrl, setApiType, setPostType)} /> 
      </div>
    {apiType === 'AlertInfo' ? (
      <div><AlertInfoInput /></div>
    ) : (
      <>
        <div>
          {/* <button onClick={dynamicLog}>dynamicLog</button> */}
          {/* Render the dynamic form based on the selected apiType */} 
          <DynamicItemForm itemType={apiType} onFormSubmit={handleDynamicFormSubmit} />
        </div>
        <div className="item-input-form-bg p-3 mt-4">
          <DynamicAssociationForm itemType={apiType}  onFormSubmit={handleAssociation}/>
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
      </>) }
    </>
  )
}

export default InsertPortrayalItem;
