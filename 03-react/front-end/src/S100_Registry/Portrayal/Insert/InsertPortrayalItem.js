import React, { useState, useContext, useEffect } from 'react';
import ItemInput from './components/ItemInput';
import ManagementInfoInput from './components/ManagementInfoInput';
import ChooseType from './ChooseType';
import { getSelestedApi } from '../api/apiMapping';  // Import the function here
import { POST_SYMBOL, POST_MANAGEMENT_INFO } from '../api/api';  // Import the API URL here
import { POST_SYMBOL_ASSOCIATION, POST_ICON_ASSOCIATION, POST_VIEWING_GROUP_ASSOCIATION, POST_ITEM_SCHEMA_ASSOCIATION, POST_COLOUR_TOKEN_ASSOCIATION, POST_PALETTE_ASSOCIATION, POST_DISPLAY_MODE_ASSOCIATION, POST_MESSAGE_ASSOCIATION, POST_HIGHLIGHT_ASSOCIATION, POST_VALUE_ASSOCIATION } from '../api/api';  // Import the API URL here
import { performValidation } from './validation/ValidateItems';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../context/ItemContext';
import DynamicItemForm from './components/DynamicItemForm'; // Import the DynamicItemForm component
import DinamicAssociationForm from './components/DinamicAssociationForm'; // Import the DynamicItemForm component

const InsertPortrayalItem = () => {
  const [dynamicFormData, setDynamicFormData] = useState(null);  // State for DynamicItemForm
  const [itemInputData, setItemInputData] = useState(null);      // State for ItemInput
  const [managementInfos, setManagementInfos] = useState([]);    // State for Management Info
  const [selectedApiUrl, setSelectedApiUrl] = useState(POST_SYMBOL);  // Selected API URL
  const [apiType, setApiType] = useState("Symbol");              // Selected API Type
  const regi_uri = Cookies.get('REGISTRY_URI');
  const { setItemDetails } = useContext(ItemContext);

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
    try {
      const itemResponse = await axios.post(
        selectedApiUrl,
        combinedData,
        {
          params: {
            regi_uri: regi_uri, // regi_uri 변수 확인 필요
          }
        }
      );

      const itemId = itemResponse.data.encrypted_data;
      const item_iv = itemResponse.data.iv;

      for (const managementInfo of managementInfos) {
        await axios.post(POST_MANAGEMENT_INFO, managementInfo, {
          params: {
            item_id: itemId,
            item_iv: item_iv,
          }
        });
      }

      // Set item details or navigate
      setItemDetails({
        item_id: itemId,
        item_iv: item_iv
      });

      // navigate(`/${Cookies.get('REGISTRY_URI')}/concept/detail`); // Uncomment if using navigation

    } catch (error) {
      console.error('Error posting data:', error);
      console.log('Combined Data:', combinedData);
    }
  };


  const log = () => { console.log(itemInputData); }
  const dynamicLog = () => { console.log(dynamicFormData); }
  const apiLog = () => { console.log(selectedApiUrl, apiType); }
  const MILog = () => { console.log(managementInfos); }
  
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
  const handleAssociation = (updatedData) => { 
    const parsedData = Object.keys(updatedData).reduce((acc, key) => {
        try {
            acc[key] = JSON.parse(updatedData[key]); // JSON 형태면 파싱
        } catch (e) {
            acc[key] = updatedData[key]; // JSON이 아니면 그대로 유지
        }
        return acc;
    }, {});

    console.log('Parsed Data:', parsedData);
  };

  return (
    <>
      <button onClick={log}>log</button>
      <button onClick={apiLog}>api</button>
      <button onClick={MILog}>MI</button>
      <button onClick={dynamicLog}>dynamic</button>
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
