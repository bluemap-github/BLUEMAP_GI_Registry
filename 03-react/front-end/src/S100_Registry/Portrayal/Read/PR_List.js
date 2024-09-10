import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../context/ItemContext';
import {
  GET_SYMBOL_SCHEMA_LIST, GET_LINE_STYLE_SCHEMA_LIST, GET_AREA_FILL_SCHEMA_LIST, GET_PIXMAP_SCHEMA_LIST, GET_COLOUR_PROFILE_SCHEMA_LIST,
  GET_SYMBOL_LIST, GET_LINE_STYLE_LIST, GET_AREA_FILL_LIST, GET_PIXMAP_LIST,
  GET_COLOUR_TOKEN_LIST, GET_PALETTE_ITEM_LIST, GET_COLOUR_PALETTE_LIST,
  GET_DISPLAY_MODE_LIST, GET_VIEWING_GROUP_LAYER_LIST,
  GET_DISPLAY_PLANE_LIST, GET_VIEWING_GROUP_LIST, GET_FONT_LIST, GET_CONTEXT_PARAMETER_LIST, GET_DRAWING_PRIORITY_LIST, GET_ALERT_LIST, GET_ALERT_HIGHLIGHT_LIST,
  GET_ALERT_MESSAGE_LIST
} from '../api/api';

const schemaApiTypes = {
  'Symbol': GET_SYMBOL_LIST,
  'LineStyle': GET_LINE_STYLE_LIST,
  'AreaFill': GET_AREA_FILL_LIST,
  'Pixmap': GET_PIXMAP_LIST,
  'SymbolSchema': GET_SYMBOL_SCHEMA_LIST,
  'LineStyleSchema': GET_LINE_STYLE_SCHEMA_LIST,
  'AreaFillSchema': GET_AREA_FILL_SCHEMA_LIST,
  'PixmapSchema': GET_PIXMAP_SCHEMA_LIST,
  'ColourProfileSchema': GET_COLOUR_PROFILE_SCHEMA_LIST,
  'ColourToken': GET_COLOUR_TOKEN_LIST,
  'PaletteItem': GET_PALETTE_ITEM_LIST,
  'ColourPalette': GET_COLOUR_PALETTE_LIST,
  'DisplayMode': GET_DISPLAY_MODE_LIST,
  'ViewingGroupLayer': GET_VIEWING_GROUP_LAYER_LIST,
  'DisplayPlane': GET_DISPLAY_PLANE_LIST,
  'ViewingGroup': GET_VIEWING_GROUP_LIST,
  'Font': GET_FONT_LIST,
  'ContextParameter': GET_CONTEXT_PARAMETER_LIST,
  'DrawingPriority': GET_DRAWING_PRIORITY_LIST,
  'Alert': GET_ALERT_LIST,
  'AlertMessage': GET_ALERT_MESSAGE_LIST,
  'AlertHighlight': GET_ALERT_HIGHLIGHT_LIST,
};

const PR_List = ({ viewType }) => {
  const navigate = useNavigate();
  const [schemaList, setSchemaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const regi_uri = Cookies.get('REGISTRY_URI'); 
  const { setItemDetails } = useContext(ItemContext);

  // viewType에 따라 API 엔드포인트를 결정
  const apiEndpoint = schemaApiTypes[viewType];

  useEffect(() => {
    if (!apiEndpoint) return; // apiEndpoint가 없는 경우 바로 리턴

    setLoading(true);  // 로딩 상태 시작
    setError(null);    // 에러 상태 초기화

    axios.get(apiEndpoint, { params: { regi_uri } })
      .then((res) => {
        if (res.data && res.data.data) {
          setSchemaList(res.data.data);  // 데이터 응답 형식에 따라 처리
        } else {
          setSchemaList([]);
        }
      })
      .catch((err) => {
        setError('Failed to load data');
        setSchemaList([]); // 에러 발생 시에도 빈 배열로 설정
      })
      .finally(() => {
        setLoading(false);  // 로딩 상태 종료
      });

  }, [regi_uri, apiEndpoint, viewType]); // viewType도 의존성 배열에 추가

  const handleDetailClick = (item) => {
    setItemDetails({
      item_id: item._id.encrypted_data,
      item_iv: item._id.iv,
      item_type: viewType,
    });
    navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/detail`);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <table className="table table-hover table-bordered">
          <thead>
            <tr className="table-primary">
              <th style={{ width: '15%' }}>Name</th>
              <th style={{ width: '15%' }}>Item Type</th>
              <th style={{ width: '40%' }}>Definition</th>
              <th style={{ width: '10%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {schemaList.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No {viewType} Schemas Found</td>
              </tr>
            ) : (
              schemaList.map((schema) => (
                <tr
                  key={schema._id.encrypted_data}
                  onClick={() => handleDetailClick(schema)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{schema.name}</td>
                  <td>{schema.itemType}</td>
                  <td>{schema.definition}</td>
                  <td>{schema.itemStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PR_List;
