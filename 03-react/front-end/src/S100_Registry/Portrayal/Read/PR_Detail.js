import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConceptInformation from './components/ConceptInformation'; // 개념 정보 컴포넌트
import PortrayalDetails from './components/PortrayalDetails'; // 기타 컴포넌트
import ManagementInformation from './components/ManagementInformation';
import DynamicAssociations from './components/DynamicAssociations';

import axios from 'axios';
import Cookies from 'js-cookie';
import {
    GET_SYMBOL_SCHEMA_ONE,
    GET_LINE_STYLE_SCHEMA_ONE,
    GET_AREA_FILL_SCHEMA_ONE,
    GET_PIXMAP_SCHEMA_ONE,
    GET_COLOUR_PROFILE_SCHEMA_ONE,
    GET_SYMBOL_ONE,
    GET_LINE_STYLE_ONE,
    GET_AREA_FILL_ONE,
    GET_PIXMAP_ONE,
    GET_COLOUR_TOKEN_ONE,
    GET_PALETTE_ITEM_ONE,
    GET_COLOUR_PALETTE_ONE,
    GET_DISPLAY_MODE_ONE,
    GET_VIEWING_GROUP_LAYER_ONE,
    GET_DISPLAY_PLANE_ONE,
    GET_VIEWING_GROUP_ONE,
    GET_FONT_ONE,
    GET_CONTEXT_PARAMETER_ONE,
    GET_DRAWING_PRIORITY_ONE,
    GET_ALERT_ONE,
    GET_ALERT_HIGHLIGHT_ONE,
    GET_ALERT_MESSAGE_ONE,
  GET_MANAGEMENT_INFO,
} from '../api/api';
import { ItemContext } from '../../../context/ItemContext';
import {GET_COLOUR_TOKEN_ASSOCIATION_LIST, GET_PALLETE_ASSOCIATION_LIST, GET_DISPLAY_MODE_ASSOCIATION_LIST,
  GET_VIEWING_GROUP_ASSOCIATION_LIST, GET_VIEWING_GROUP_LAYER_ASSOCIATION_LIST, GET_MESSAGE_ASSOCIATION_LIST,
  GET_HIGHLIGHT_ASSOCIATION_LIST, GET_VALUE_ASSOCIATION_LIST, GET_ICON_ASSOCIATION_LIST, GET_SYMBOL_ASSOCIATION_LIST,
  GET_ITEM_SCHEMA_ASSOCIATION_LIST } from '../api/api';

// 스키마 및 비주얼 아이템 관련 API 매핑 객체
const schemaApiTypes = {
    Symbol: GET_SYMBOL_ONE,
    LineStyle: GET_LINE_STYLE_ONE,
    AreaFill: GET_AREA_FILL_ONE,
    Pixmap: GET_PIXMAP_ONE,
    SymbolSchema: GET_SYMBOL_SCHEMA_ONE,
    LineStyleSchema: GET_LINE_STYLE_SCHEMA_ONE,
    AreaFillSchema: GET_AREA_FILL_SCHEMA_ONE,
    PixmapSchema: GET_PIXMAP_SCHEMA_ONE,
    ColourProfileSchema: GET_COLOUR_PROFILE_SCHEMA_ONE,
    ColourToken: GET_COLOUR_TOKEN_ONE,
    PaletteItem: GET_PALETTE_ITEM_ONE,
    ColourPalette: GET_COLOUR_PALETTE_ONE,
    DisplayMode: GET_DISPLAY_MODE_ONE,
    ViewingGroupLayer: GET_VIEWING_GROUP_LAYER_ONE,
    DisplayPlane: GET_DISPLAY_PLANE_ONE,
    ViewingGroup: GET_VIEWING_GROUP_ONE,
    Font: GET_FONT_ONE,
    ContextParameter: GET_CONTEXT_PARAMETER_ONE,
    DrawingPriority: GET_DRAWING_PRIORITY_ONE,
    Alert: GET_ALERT_ONE,
    AlertHighlight: GET_ALERT_HIGHLIGHT_ONE,
    AlertMessage: GET_ALERT_MESSAGE_ONE,
};

const associationList = {
  'Symbol': [ 
    { 
      associationName: 'colourToken',
      api: GET_COLOUR_TOKEN_ASSOCIATION_LIST,
     }, 
    { 
      associationName: 'itemSchema',
      api: GET_ITEM_SCHEMA_ASSOCIATION_LIST } 
  ],
  'LineStyle': [ 
    { 
      associationName: 'colourToken',
      api: GET_COLOUR_TOKEN_ASSOCIATION_LIST }, 
    { 
      associationName: 'symbol',
      api: GET_SYMBOL_ASSOCIATION_LIST }, 
    { 
      associationName: 'itemSchema',
      api: GET_ITEM_SCHEMA_ASSOCIATION_LIST } 
  ],
  'AreaFill': [ 
    { 
      associationName: 'colourToken',
      api: GET_COLOUR_TOKEN_ASSOCIATION_LIST }, 
    { 
      associationName: 'symbol',
      api: GET_SYMBOL_ASSOCIATION_LIST }, 
    { 
      associationName: 'itemSchema',
      api: GET_ITEM_SCHEMA_ASSOCIATION_LIST } 
  ],
  'Pixmap': [ 
    { 
      associationName: 'colourToken',
      api: GET_COLOUR_TOKEN_ASSOCIATION_LIST }, 
    { 
      associationName: 'itemSchema',
      api: GET_ITEM_SCHEMA_ASSOCIATION_LIST } 
  ],
  'ColourToken': [ 
    { 
      associationName: 'value',
      api: GET_VALUE_ASSOCIATION_LIST } 
  ],
  'PaletteItem': [ 
    { 
      associationName: 'palette',
      api: GET_PALLETE_ASSOCIATION_LIST } 
  ],
  'ViewingGroup': [ 
    { 
      associationName: 'viewingGroup',
      api: GET_VIEWING_GROUP_LAYER_ASSOCIATION_LIST } 
  ],
  'ViewingGroupLayer': [ 
    { 
      associationName: 'displayMode',
      api: GET_DISPLAY_MODE_ASSOCIATION_LIST } 
  ],
  'AlertHighlight': [ 
    { 
      associationName: 'msg',
      api: GET_MESSAGE_ASSOCIATION_LIST }, 
    { 
      associationName: 'viewingGroup',
      api: GET_VIEWING_GROUP_ASSOCIATION_LIST } 
  ],
  'AlertMessage': [ 
    { 
      associationName: 'icon',
      api: GET_ICON_ASSOCIATION_LIST } 
  ]
};

const associationKeys = [
  'Symbol',
  'LineStyle',
  'AreaFill',
  'Pixmap',
  'ColourToken',
  'PaletteItem',
  'ViewingGroup',
  'ViewingGroupLayer',
  'AlertHighlight',
  'AlertMessage'
];

const PR_Detail = () => {
  const navigate = useNavigate();
  const { itemDetails } = useContext(ItemContext);
  const { item_id, item_iv, item_type } = itemDetails; // item_type에 따라 API를 변경
  const [data, setData] = useState(null); // 데이터를 관리할 상태
  const [managementInfo, setManagementInfo] = useState(null);
  const [associations, setAssociations] = useState(null);

  const regi_uri = Cookies.get('REGISTRY_URI');
  
  const moveToList = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/list`);
  };
  console.log(item_id, item_iv);
  useEffect(() => {
    const apiEndpoint = schemaApiTypes[item_type]; // Select the API based on item_type
    if (!apiEndpoint) {
      console.error(`Unknown item type: ${item_type}`);
      return;
    }
  
    // Fetch data and management info
    const fetchAllData = () => {
      return Promise.all([
        axios.get(apiEndpoint, {
          params: {
            regi_uri,
            item_id,
            item_iv,
          },
        }),
        axios.get(GET_MANAGEMENT_INFO, {
          params: {
            item_id,
            item_iv,
          },
        }),
      ])
        .then(([apiResponse, managementResponse]) => {
          // Handle first request
          if (apiResponse.data.data) {
            setData(apiResponse.data.data);
          } else {
            setData(null);
          }
  
          // Handle second request
          if (managementResponse.data) {
            setManagementInfo(managementResponse.data);
          } else {
            setManagementInfo(null);
          }
        })
        .catch((err) => {
          console.error(err);
          setData(null);
          setManagementInfo(null);
        });
    };
  
    // Check if the item_type has associations in the list
    const fetchAssociations = () => {
      const associations = associationList[item_type];
      if (!associations) {
        return Promise.resolve([]); // Return an empty array if no associations
      }
  
      // Fetch each association's API
      const associationRequests = associations.map((association) =>
        axios
          .get(association.api, {
            params: {
              item_id,
              item_iv,
            },
          })
          .then((response) => {
            return { associationName: association.associationName, data: response.data };
          })
          .catch((error) => {
            console.error(`Error fetching association ${association.associationName}:`, error);
            return null;
          })
      );
  
      return Promise.all(associationRequests); // Return a promise that resolves when all association requests are done
    };
  
    // Trigger both the main data fetching and associations fetching
    Promise.all([fetchAllData(), fetchAssociations()])
      .then(([mainData, associationData]) => {
        const formattedAssociations = associationData
          .filter(item => item && item.data && item.data.data) // Ensure the item has valid data
          .map(item => {
            return item.data.data.map(association => ({
              associationName: item.associationName, // associationName from the fetched data
              itemType: association.item_type,
              child_id: association.child_id.encrypted_data,
              child_iv: association.child_id.iv,
              xml_id: association.xmlID,
            }));
          })
          .flat(); // Flatten the nested arrays into a single array
  
        setAssociations(formattedAssociations); 
      })
      .catch((error) => {
        console.error("Error fetching all data:", error);
      });
  }, [item_id, item_iv, item_type, regi_uri]);
  
  const assoLogs = () => {
    console.log(associations);
  };
  
  // 스키마 및 비주얼 아이템 타입에 따라 렌더링
  return (
    <div>
      {data ? <PortrayalDetails items={data} itemType={item_type} /> : <div>Loading...</div>}
      {associationKeys.includes(item_type) ? (
          <DynamicAssociations associationItems={associations} UpdateAssoType={item_type} itemID={item_id} itemIV={item_iv}/>
        ) : null}
      {data ? <ConceptInformation items={data} /> : <div>Loading...</div>}
      {managementInfo ? <ManagementInformation 
                      items={managementInfo.management_infos} 
                      item_id={item_id}
                      item_iv={item_iv}
                      /> : <div>Loading...</div>}
      
      <div>
        <button onClick={moveToList} className="btn btn-primary" style={{ maxWidth: '150px', width: '100%' }}>Back to list</button>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>
  );
};

export default PR_Detail;
