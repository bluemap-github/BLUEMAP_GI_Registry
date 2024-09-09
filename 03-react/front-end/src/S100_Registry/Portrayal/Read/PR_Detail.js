import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConceptInformation from './components/ConceptInformation'; // 개념 정보 컴포넌트
import PortrayalDetails from './components/PortrayalDetails'; // 기타 컴포넌트
import ManagementInformation from './components/ManagementInformation';

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
  GET_MANAGEMENT_INFO
} from '../api/api';
import { ItemContext } from '../../../context/ItemContext';

// 스키마 및 비주얼 아이템 관련 API 매핑 객체
const schemaApiTypes = {
    'Symbol': GET_SYMBOL_ONE,
    'LineStyle': GET_LINE_STYLE_ONE,
    'AreaFill': GET_AREA_FILL_ONE,
    'Pixmap': GET_PIXMAP_ONE,
    'SymbolSchema': GET_SYMBOL_SCHEMA_ONE,
    'LineStyleSchema': GET_LINE_STYLE_SCHEMA_ONE,
    'AreaFillSchema': GET_AREA_FILL_SCHEMA_ONE,
    'PixmapSchema': GET_PIXMAP_SCHEMA_ONE,
    'ColourProfileSchema': GET_COLOUR_PROFILE_SCHEMA_ONE,
    'ColourToken': GET_COLOUR_TOKEN_ONE,
    'PaletteItem': GET_PALETTE_ITEM_ONE,
    'ColourPalette': GET_COLOUR_PALETTE_ONE
};


const PR_Detail = () => {
    const navigate = useNavigate();
    const { itemDetails } = useContext(ItemContext);
    const { item_id, item_iv, item_type } = itemDetails; // item_type에 따라 API를 변경
    const [data, setData] = useState(null); // 데이터를 관리할 상태
    const [managementInfo, setManagementInfo] = useState(null);

    const regi_uri = Cookies.get('REGISTRY_URI');
        const moveToList = () => {
            navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/list`);
        };

    useEffect(() => {
        const apiEndpoint = schemaApiTypes[item_type]; // 해당 item_type에 맞는 API 선택
        if (!apiEndpoint) {
            console.error(`Unknown item type: ${item_type}`);
        return;
        }

        axios.get(apiEndpoint, {
            params: {
                regi_uri,
                item_id,
                item_iv,
            },
        })
        .then((res) => {
            if (res.data) {
                setData(res.data.data); // 데이터 설정
            } else {
                setData(null); // 데이터가 없을 경우 null
            }
        })
        .catch((err) => {
            console.error(err);
            setData(null); // 에러 발생 시 null
        });

        axios.get(GET_MANAGEMENT_INFO, {
            params: {
                item_id,
                item_iv,
            }
        })
        .then((res) => {
            if (res.data) {
                setManagementInfo(res.data); // 데이터 설정
            } else {
                setManagementInfo(null); // 데이터가 없을 경우 null
            }
        })
        .catch((err) => {
            console.error(err);
            setManagementInfo(null); // 에러 발생 시 null
        });

    }, [item_id, item_iv, item_type, regi_uri]);

  // 스키마 및 비주얼 아이템 타입에 따라 렌더링
  return (
    <div>
        {data ? <PortrayalDetails items={data} itemType={item_type} /> : <div>Loading...</div>}
        {data ? <ConceptInformation items={data} /> : <div>Loading...</div>}
        {data ? <ManagementInformation items={managementInfo.management_infos} /> : <div>Loading...</div>}
      
        <div>
            <button onClick={moveToList} className="btn btn-primary" style={{ maxWidth: '150px', width: '100%' }}>Back to list</button>
        </div>
        <div style={{ height: '200px' }}></div>
    </div>
  );
};

export default PR_Detail;
