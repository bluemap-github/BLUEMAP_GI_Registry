import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from './api';
import Toast from './Toast';

const delItemUrl = (idx) => {
  return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${idx}/delete/`;
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
          deleteToast();
        } catch (error) {
          console.error('Error fetching item list:', error);
        }
      };
      await fetchItemList();
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

  return (
    <div className="container p-5">
      {toast && <Toast setToast={setToast} text="Item is Deleted." />}
      {/* <button  onClick={deleteToast}>넹</button> */}
      {/* <div style={{height: '70px'}}></div> */}
      <div>
        <div style={{display: "flex"}}>
          <h1 className='mb-3'>Concept Register</h1>
          <button onClick={() => window.location='/concept/create'}>add</button>
        </div>
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
        {itemList.map((item, index) => (
          <tr key={item.id} style={{ cursor: 'pointer' }}>
              <th scope="row" className='text-center' style={{width: '3%'}}>
                <input 
                  type="checkbox" 
                  checked={checkedItems[item.id]} 
                  onChange={() => handleCheckboxChange(item.id)}
                  style={{transform: "scale(1.5)"}}
                />
              </th>
              <td onClick={() => window.location=`/concept/detail/${item.id}`} className='text-center' style={{width: '3%'}}>{index+1}</td>
              <td onClick={() => window.location=`/concept/detail/${item.id}`} className='th-inner sortable both' style={{width: '15%'}}>{item.name}</td>
              <td onClick={() => window.location=`/concept/detail/${item.id}`} className='th-inner sortable both' style={{width: '15%'}}>{item.camelCase}</td>
              <td onClick={() => window.location=`/concept/detail/${item.id}`} className='th-inner sortable both' style={{width: '40%'}}>{item.definition}</td>
              <td onClick={() => window.location=`/concept/detail/${item.id}`} className='th-inner sortable both' style={{width: '9%'}}>{item.itemStatus}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <div style={{height: '200px'}}></div>
    </div>
  );
}

export default Register;
