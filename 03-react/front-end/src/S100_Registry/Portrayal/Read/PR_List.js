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
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const regi_uri = Cookies.get('REGISTRY_URI'); 
  const { setItemDetails } = useContext(ItemContext);

  // viewType에 따라 API 엔드포인트를 결정
  const apiEndpoint = schemaApiTypes[viewType];

  const fetchSchemas = async (updatedPage = page) => {
    if (!apiEndpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(apiEndpoint, {
        params: {
          regi_uri,
          search_term: searchTerm,
          status,
          category,
          sort_key: sortKey,
          sort_direction: sortDirection,
          page: updatedPage,
          page_size: pageSize,
        },
      });

      setSchemaList(response.data.data || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      setError('Failed to load data');
      setSchemaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // viewType이 바뀔 때마다 fetchSchemas 호출
    fetchSchemas();
  }, [viewType, searchTerm, status, category, sortKey, sortDirection, pageSize, page]); // viewType 추가

  const handleDetailClick = (item) => {
    setItemDetails({
      item_id: item._id.encrypted_data,
      item_iv: item._id.iv,
      item_type: viewType,
    });
    navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/detail`);
  };

  const handleSearch = () => {
    setPage(1);
    fetchSchemas(1);
  };

  const handleSortChange = (key) => {
    const newDirection = sortKey === key && sortDirection === 'ascending' ? 'descending' : 'ascending';
    setSortKey(key);
    setSortDirection(newDirection);
    fetchSchemas();
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchSchemas(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setPage(1);
    fetchSchemas(1);
  };

  const renderSortArrow = (key) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className='input-group' style={{width: "25%"}}>
            <label className='input-group-text'>Status</label>
            <select className='form-select' value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="processing">Processing</option>
              <option value="valid">Valid</option>
              <option value="superseded">Superseded</option>
              <option value="notValid">Not Valid</option>
              <option value="retired">Retired</option>
              <option value="clarified">Clarified</option>
            </select>
          </div>
          <div className='input-group' style={{width: "30%"}}>
            <label className='input-group-text'>Category</label>
            <select className='form-select' value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Choose</option>
              <option value="name">Name</option>
              <option value="camelCase">Camel Case</option>
              <option value="definition">Definition</option>
            </select>
          </div>
          <div className="input-group" style={{ width: '30%' }}>
            <input
              className="form-control"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <table className="table table-hover table-bordered" style={{ marginTop: '20px' }}>
          <thead>
            <tr className="table-primary">
              <th style={{ width: '15%', cursor: 'pointer' }} onClick={() => handleSortChange('name')}>
                Name {renderSortArrow('name')}
              </th>
              <th style={{ width: '15%' }}>Item Type</th>
              <th style={{ width: '40%' }}>Definition</th>
              <th style={{ width: '10%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {schemaList.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No Items found</td>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignContent: 'center' }}>
            <select className="form-select form-select-sm" value={pageSize} onChange={handlePageSizeChange}>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <label style={{ marginLeft: '10px' }}>rows per page</label>
        </div>

        <nav aria-label="Page navigation" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <ul className="pagination">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)} disabled={page === i + 1}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PR_List;
