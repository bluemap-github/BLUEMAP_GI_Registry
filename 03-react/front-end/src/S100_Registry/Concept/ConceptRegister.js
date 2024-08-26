import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';  // js-cookie 라이브러리 임포트
import { ItemContext } from '../../context/ItemContext';
import { CONCEPT_DETAIL } from '../../Common/PageLinks';
import { REGISTER_ITEM_LIST_URL } from './api';
import Toast from '../Toast';

function Register() {
  const [itemList, setItemList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { setItemDetails } = useContext(ItemContext);
  const navigate = useNavigate();

  const fetchItems = async (updatedPage = page) => {
    try {
      const regi_uri = Cookies.get('REGISTRY_URI');  // 쿠키에서 REGISTRY_URI를 가져옴
      const response = await axios.get(REGISTER_ITEM_LIST_URL, {
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

      setItemList(response.data.register_items || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, status, category, sortKey, sortDirection, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchItems(1);
  };

  const handleSortChange = (key) => {
    const newDirection = sortKey === key && sortDirection === 'ascending' ? 'descending' : 'ascending';
    setSortKey(key);
    setSortDirection(newDirection);
    fetchItems(); // Keep the current page when sorting
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
    fetchItems(1); // Reset to page 1 when page size changes
  };

  const handleDetailClick = (item) => {
    setItemDetails({
      item_id: item._id.encrypted_data,
      item_iv: item._id.iv,
    });
    navigate(`/${Cookies.get('REGISTRY_URI')}/concept/detail`);  // 쿠키에서 REGISTRY_URI를 가져옴
  };

  const renderSortArrow = (key) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? '↑' : '↓';
    }
    return '↕'; // Default arrow when not sorted by this key
  };

  return (
    <div className="p-5">
      <div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className='input-group' style={{width: "12%"}}>
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
          <div className='input-group' style={{width: "15%"}}>
            <label className='input-group-text'>Category</label>
            <select className='form-select' value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Choose</option>
              <option value="name">Name</option>
              <option value="camelCase">Camel Case</option>
              <option value="definition">Definition</option>
            </select>
          </div>
          <div className="input-group" style={{width: "20%"}}>
              <input
                className="form-control"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
              />
              <button className="btn btn-outline-secondary" onClick={handleSearch}>Search</button>
            </div>
          </div>
          
      </div>
      <table className="table table-hover table-bordered" style={{ tableLayout: 'fixed', marginTop: '20px' }}>
        <thead>
          <tr className='table-primary'>
            <th style={{ cursor: 'pointer', color: sortKey === 'name' ? 'blue' : 'black' }} onClick={() => handleSortChange('name')}>
              Name {renderSortArrow('name')}
            </th>
            <th style={{ cursor: 'pointer', color: sortKey === 'camelCase' ? 'blue' : 'black' }} onClick={() => handleSortChange('camelCase')}>
              Camel Case {renderSortArrow('camelCase')}
            </th>
            <th>Definition</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {itemList.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No items found</td>
            </tr>
          )}
          {itemList.map((item) => (
            <tr key={item._id.encrypted_data} onClick={() => handleDetailClick(item)} style={{ cursor: 'pointer' }}>
              <td>{item.name}</td>
              <td>{item.camelCase}</td>
              <td>{item.definition}</td>
              <td>{item.itemStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <div style={{ display: 'flex',  alignItems: 'center'}}>
          <div style={{ display: 'flex', alignContent: 'center'}}>
            <select className='form-select form-select-sm' value={pageSize} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <label style={{marginLeft: '10px'}}>rows per page</label>
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
}

export default Register;
