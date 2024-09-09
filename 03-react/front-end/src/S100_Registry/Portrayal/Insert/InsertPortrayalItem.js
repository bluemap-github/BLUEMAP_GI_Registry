import React, { useState, useContext, useEffect } from 'react';
import ItemInput from './components/ItemInput';
import VisualItemInput from './components/VisualItemInput';
import ItemSchemaInput from './components/ItemSchemaInput';
import ColourTokenInput from './components/ColourTokenInput';
import ColourPaletteInput from './components/ColourPaletteInput';
import PaletteItemInput from './components/PaletteItemInput';
import ManagementInfoInput from './components/ManagementInfoInput';
import ChooseType from './ChooseType';
import { getSelestedApi } from '../api/apiMapping';  // Import the function here
import {POST_SYMBOL, POST_MANAGEMENT_INFO} from '../api/api';  // Import the API URL here
import { performValidation } from './validation/ValidateItems';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../context/ItemContext';

const InsertPortrayalItem = () => {
  const [item, setItem] = useState(null);
  const [visual, setVisual] = useState(null);
  const [schema, setSchema] = useState(null);
  const [colourToken, setColourToken] = useState(null);
  const [paletteItem, setPaletteItem] = useState(null);
  const [colourPalette, setColourPalette] = useState(null);
  const [selectedApiUrl, setSelectedApiUrl] = useState(POST_SYMBOL);
  const [managementInfos, setManagementInfos] = useState([]);
  const [apiType, setApiType] = useState("Symbol");
  const regi_uri = Cookies.get('REGISTRY_URI');
  const { setItemDetails } = useContext(ItemContext);

  const ItemChange = (formData) => { setItem(formData); };
  const VisualChange = (formData) => { setVisual(formData); };
  const SchemaChange = (formData) => { setSchema(formData); };
  const ColourTokenChange = (formData) => { setColourToken(formData); };
  const PaletteItemChange = (formData) => { setPaletteItem(formData); };
  const ColourPaletteChange = (formData) => { setColourPalette(formData); };
  const MIChange = (formData) => { setManagementInfos(formData); };

  // Reset all data when apiType changes
  useEffect(() => {
    setItem(null);
    setVisual(null);
    setSchema(null);
    setColourToken(null);
    setPaletteItem(null);
    setManagementInfos([]);
  }, [apiType]);

  const validationData = {
    Symbol: visual,
    LineStyle: visual,
    AreaFill: visual,
    Pixmap: visual,
    SymbolSchema: schema,
    LineStyleSchema: schema,
    AreaFillSchema: schema,
    PixmapSchema: schema,
    ColourProfileSchema: schema,
    ColourToken: colourToken,
    PaletteItem: paletteItem,
    ColourPalette: colourPalette,
  };
  
  const validationTest = (validateType) => {
    console.log('Validation Test:', item, managementInfos, validationData[validateType], selectedApiUrl);
    let errorMessages = [];
  
    // 1. Check if item and managementInfos (MI) are provided
    if (!item) {
      errorMessages.push('- Concept Information is required');
    }
  
    if (!managementInfos || managementInfos.length === 0) {
      errorMessages.push('- Management Information is required.');
    }
  
    // If there are any missing item or MI, alert and stop further validation
    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'));
      return;
    }
  
    // 2. Validate item as a ConceptItem
    if (!performValidation(item, 'ConceptItem')) {
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
    console.log('Combining Data:', item, validationData[validateType]);
    const mainData = validationData[validateType] || {}; // Ensure mainData is not null
  
    const combinedData = {
      ...item,    // item 데이터를 병합
      ...mainData, // main 데이터를 병합
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
  
  const log = () => { console.log(item); }
  const visualLog = () => { console.log(visual); }
  const apiLog = () => { console.log(selectedApiUrl, apiType); }
  const schemaLog = () => { console.log(schema); }
  const colourTokenLog = () => { console.log(colourToken); }
  const paletteItemLog = () => { console.log(paletteItem); }
  const MILog = () => { console.log(managementInfos); }
  
  return (
    <>
      <button onClick={log}>log</button>
      <button onClick={visualLog}>visual</button>
      <button onClick={apiLog}>api</button>
      <button onClick={schemaLog}>schema</button>
      <button onClick={colourTokenLog}>colourToken</button>
      <button onClick={paletteItemLog}>paletteItem</button>
      <button onClick={MILog}>MI</button>
      <div>
        <ChooseType getSelestedApi={(type) => getSelestedApi(type, setSelectedApiUrl, setApiType)} /> 
      </div>
      <div>
        {(apiType === 'Symbol' || apiType === 'LineStyle' || apiType === 'AreaFill' || apiType === 'Pixmap') && <VisualItemInput onFormSubmit={VisualChange} apiType={apiType}/>}
        {(apiType === 'SymbolSchema' || apiType === 'LineStyleSchema' || apiType === 'AreaFillSchema' || apiType === 'PixmapSchema' || apiType === 'ColourProfileSchema') && <ItemSchemaInput onFormSubmit={SchemaChange} apiType={apiType}/>}
        {(apiType === 'ColourToken') && <ColourTokenInput onFormSubmit={ColourTokenChange} apiType={apiType}/>}
        {(apiType === 'PaletteItem') && <PaletteItemInput onFormSubmit={PaletteItemChange} apiType={apiType}/>}
        {(apiType === 'ColourPalette') && <ColourPaletteInput onFormSubmit={ColourPaletteChange} apiType={apiType}/>}
      </div>

      <div>
        <ItemInput onFormSubmit={ItemChange} apiType={apiType}/>
      </div>

      <div>
        <ManagementInfoInput onFormSubmit={MIChange} apiType={apiType}/>
      </div>
      <div className='text-end'>
          <button className='mt-3 btn btn-sm btn-primary' onClick={() => validationTest(apiType)}>Submit</button>
      </div>
      <div style={{ height: '200px' }}></div>
    </>
  )
}

export default InsertPortrayalItem;
