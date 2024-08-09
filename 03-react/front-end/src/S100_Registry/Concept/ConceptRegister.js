import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DEL_ITEM_URL } from './api';
import Toast from '../Toast';
import { ItemContext } from '../../context/ItemContext';
import SearchConcept from './GetItem/SearchConcept.js';
import { CONCEPT_DETAIL } from '../../Common/PageLinks';

function Register() {
  const [itemList, setItemList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedAll, setCheckedAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' }); // Initial sort config
  const { setItemDetails } = useContext(ItemContext);
  const navigate = useNavigate();
  const USER_SERIAL = sessionStorage.getItem('USER_SERIAL');

  // Callback to update the item list when search results are obtained
  const handleSearchResults = (results) => {
    setItemList(results);
  };

  const handleCheckboxAll = () => {
    const nextState = !checkedAll;
    const updatedCheckedItems = {};
    itemList.forEach(item => {
      updatedCheckedItems[item._id.encrypted_data] = nextState;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const handleCheckboxChange = (itemId) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const deleteItem = async (idx) => {
    try {
      await axios.delete(DEL_ITEM_URL(idx));
      // Fetch new list after deletion
      setItemList(prevItems => prevItems.filter(item => item._id.encrypted_data !== idx));
      deleteToast();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const deleteAll = async () => {
    try {
      for (const key in checkedItems) {
        const value = checkedItems[key];
        if (value) await deleteItem(key);
      }
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const [toast, setToast] = useState(false);
  const deleteToast = () => {
    setToast(true);
  };

  const handleDetailClick = (item) => {
    setItemDetails({
      item_id: item._id.encrypted_data,
      item_iv: item._id.iv,
    });
    setTimeout(() => {
      navigate(CONCEPT_DETAIL);
    }, 100);
  };

  const sortItems = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...itemList];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [itemList, sortConfig]);

  return (
    <div className="p-5">
      {toast && <Toast setToast={setToast} text="Item is Deleted." />}
      <div>
        <SearchConcept onSearchResults={handleSearchResults} />
      </div>
      <table className="table table-hover table-bordered table-striped" style={{ tableLayout: 'fixed', width: '85%' }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '15%', cursor: 'pointer' }}>
              Name
              <span
                style={{
                  marginLeft: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'blue' : 'grey',
                }}
                onClick={() => sortItems('name', 'ascending')}
              >
                ↑
              </span>
              <span
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'blue' : 'grey',
                }}
                onClick={() => sortItems('name', 'descending')}
              >
                ↓
              </span>
            </th>
            <th scope="col" style={{ width: '15%', cursor: 'pointer' }}>
              <div className='single-line-ellipsis'>
                Camel Case
                <span
                  style={{
                    marginLeft: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: sortConfig.key === 'camelCase' && sortConfig.direction === 'ascending' ? 'blue' : 'grey',
                  }}
                  onClick={() => sortItems('camelCase', 'ascending')}
                >
                  ↑
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: sortConfig.key === 'camelCase' && sortConfig.direction === 'descending' ? 'blue' : 'grey',
                  }}
                  onClick={() => sortItems('camelCase', 'descending')}
                >
                  ↓
                </span>
              </div>
            </th>
            <th scope="col" style={{ width: '45%' }}>Definition</th>
            <th scope="col" style={{ width: '11%' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No items found</td>
            </tr>
          )}
          {sortedItems.map((item) => (
            <tr key={item._id.encrypted_data} style={{ cursor: 'pointer' }}>
              <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '15%' }}>
                <div className='single-line-ellipsis'>{item.name}</div>
              </td>
              <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '15%' }}>
                <div className='single-line-ellipsis'>{item.camelCase}</div>
              </td>
              <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '45%' }}>
                <div className='single-line-ellipsis'>{item.definition}</div>
              </td>
              <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '11%' }}>
                <div className='single-line-ellipsis'>{item.itemStatus}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ height: '200px' }}></div>
    </div>
  );
}

export default Register;
