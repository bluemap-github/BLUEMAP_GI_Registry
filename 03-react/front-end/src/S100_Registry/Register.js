import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from './api';

const delItemUrl = (idx) => {
  return `http://127.0.0.1:8000/api/v1/registerItem/${idx}/delete/`;
};

function Register() {
  const [itemList, setItemList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedAll, setCheckedAll] = useState(false);

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await axios.get(REGISTER_ITEM_LIST_URL);
        setItemList(response.data.register_items);
      } catch (error) {
        console.error('Error fetching item list:', error);
      }
    };
    fetchItemList();
  }, []); 

  useEffect(() => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    setCheckedAll(checkedCount === itemList.length);
  }, [checkedItems, itemList]);

  const handleCheckboxAll = () => {
    const nextState = !checkedAll;
    const updatedCheckedItems = {};
    itemList.forEach(item => {
      updatedCheckedItems[item.id] = nextState;
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
      await axios.delete(delItemUrl(idx));
      const fetchItemList = async () => {
        try {
          const response = await axios.get(REGISTER_ITEM_LIST_URL);
          setItemList(response.data.register_items);
        } catch (error) {
          console.error('Error fetching item list:', error);
        }
      };
      fetchItemList();

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

  return (
    <div className="container mt-5">
      <div>
        <h1 className='mb-3'>Concept Register</h1>
        <div>
          <div>GET : {REGISTER_ITEM_LIST_URL}</div>
        </div>
        
        <button onClick={deleteAll} className="btn btn-danger mt-3 mb-3" style={{ maxWidth: '130px', width: '100%' }}>select delete</button>
      </div>
      <table className="table table-hover table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col" className='text-center'>
              <input 
                type="checkbox" 
                checked={checkedAll} 
                onChange={handleCheckboxAll}
                style={{transform: "scale(1.5)"}}
              />
            </th>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">camelCase</th>
            <th scope="col">Definition</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
        {itemList.map(item => (
          <tr key={item.id} style={{ cursor: 'pointer' }}>
              <th scope="row" className='text-center' style={{width: '3%'}}>
                <input 
                  type="checkbox" 
                  checked={!!checkedItems[item.id]} 
                  onChange={() => handleCheckboxChange(item.id)}
                  style={{transform: "scale(1.5)"}}
                />
              </th>
              <td onClick={() => window.location=`/detail/${item.id}`} className='text-center' style={{width: '3%'}}>{item.id}</td>
              <td onClick={() => window.location=`/detail/${item.id}`} className='th-inner sortable both' style={{width: '15%'}}>{item.name}</td>
              <td onClick={() => window.location=`/detail/${item.id}`} className='th-inner sortable both' style={{width: '15%'}}>{item.camelCase}</td>
              <td onClick={() => window.location=`/detail/${item.id}`} className='th-inner sortable both' style={{width: '55%'}}>{item.definition}</td>
              <td onClick={() => window.location=`/detail/${item.id}`} className='th-inner sortable both' style={{width: '5%'}}>{item.itemStatus}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default Register;
