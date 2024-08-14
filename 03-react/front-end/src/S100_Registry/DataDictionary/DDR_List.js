import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GET_DDR_ITEM_LIST } from './api';
import { ItemContext } from '../../context/ItemContext';
import { DDR_DETAIL } from '../../Common/PageLinks';

const DDR_FilterList = ({ viewType }) => {
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [enumType, setEnumType] = useState('');
  const [valueType, setValueType] = useState('');
  const [items, setItems] = useState([]);
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { setItemDetails } = useContext(ItemContext);
  const navigate = useNavigate();

  const fetchItems = async (updatedPage = page) => {
    try {
      const regi_uri = sessionStorage.getItem('REGISTRY_URI');
      const response = await axios.get(GET_DDR_ITEM_LIST, {
        params: {
          regi_uri,
          item_type: viewType,
          sort_key: sortKey,
          sort_direction: sortDirection,
          page: updatedPage,
          page_size: pageSize,
          status,
          category,
          search_term: searchTerm,
          enum_type: enumType,
          value_type: valueType,
        },
      });

      setItems(response.data.register_items || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchItems(1);
  };

  const handleSortChange = (key) => {
    const newDirection = sortKey === key && sortDirection === 'ascending' ? 'descending' : 'ascending';
    setSortKey(key);
    setSortDirection(newDirection);
    fetchItems(); // 현재 페이지를 유지하며 정렬 변경
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchItems(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setPage(1);
    fetchItems(1);
  };

  const renderSortArrow = (key) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? '↑' : '↓';
    }
    return '↕';
  };

  useEffect(() => {
    fetchItems();
  }, [viewType, status, category, searchTerm, sortKey, sortDirection, pageSize]);

  const handleDetailClick = (item) => {
    setItemDetails({
      view_item_type: viewType,
      user_serial: sessionStorage.getItem('USER_SERIAL'),
      item_id: item._id.encrypted_data,
      item_iv: item._id.iv,
    });
    navigate(DDR_DETAIL);
  };

  return (
    <div>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {viewType === 'EnumeratedValue' && (
            <div>
              <label>Enum Type:</label>
              <select value={enumType} onChange={(e) => setEnumType(e.target.value)}>
                <option value="">Choose</option>
                <option value="S100_Codelist">S100_Codelist</option>
                <option value="enumeration">enumeration</option>
              </select>
            </div>
          )}
          {viewType === 'SimpleAttribute' && (
            <div>
              <label>Value Type:</label>
              <select value={valueType} onChange={(e) => setValueType(e.target.value)}>
                <option value="">Choose</option>
                <option value="boolean">boolean</option>
                <option value="enumeration">enumeration</option>
                <option value="integer">integer</option>
                <option value="real">real</option>
                <option value="date">date</option>
                <option value="text">text</option>
                <option value="time">time</option>
                <option value="dateTime">dateTime</option>
                <option value="URI">URI</option>
                <option value="URL">URL</option>
                <option value="URN">URN</option>
                <option value="S100_CodeList">S100_CodeList</option>
                <option value="S100_TruncatedDate">S100_TruncatedDate</option>
              </select>
            </div>
          )}
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="processing">Processing</option>
              <option value="valid">Valid</option>
              <option value="superseded">Superseded</option>
              <option value="notValid">Not Valid</option>
              <option value="retired">Retired</option>
              <option value="clarified">Clarified</option>
            </select>
          </div>
          <div>
            <label>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Choose</option>
              <option value="name">Name</option>
              <option value="camelCase">Camel Case</option>
              <option value="definition">Definition</option>
            </select>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div>
        <table
          className="table table-hover table-bordered"
          style={{ tableLayout: 'fixed', width: '85%' }}
        >
          <thead>
            <tr className='table-primary'>
              <th
                scope="col"
                style={{ width: '15%', cursor: 'pointer' }}
                onClick={() => handleSortChange('name')}
              >
                Name {renderSortArrow('name')}
              </th>
              <th
                scope="col"
                style={{ width: '15%', cursor: 'pointer' }}
                onClick={() => handleSortChange('camelCase')}
              >
                Camel Case {renderSortArrow('camelCase')}
              </th>
              <th scope="col" style={{ width: '40%' }}>Definition</th>
              <th scope="col" style={{ width: '11%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No items found</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id.encrypted_data} style={{ cursor: 'pointer' }}>
                  <td
                    onClick={() => handleDetailClick(item)}
                    className="th-inner sortable both"
                    style={{ width: '15%' }}
                  >
                    <div className="single-line-ellipsis">{item.name}</div>
                  </td>
                  <td
                    onClick={() => handleDetailClick(item)}
                    className="th-inner sortable both"
                    style={{ width: '15%' }}
                  >
                    <div className="single-line-ellipsis">{item.camelCase}</div>
                  </td>
                  <td
                    onClick={() => handleDetailClick(item)}
                    className="th-inner sortable both"
                    style={{ width: '40%' }}
                  >
                    <div className="single-line-ellipsis">{item.definition}</div>
                  </td>
                  <td
                    onClick={() => handleDetailClick(item)}
                    className="th-inner sortable both"
                    style={{ width: '11%' }}
                  >
                    <div className="single-line-ellipsis">{item.itemStatus}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
              <button className="page-link" onClick={() => handlePageChange(i + 1)}>
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
  );
};

export default DDR_FilterList;
