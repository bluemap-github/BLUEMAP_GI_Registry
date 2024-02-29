import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from './api';


const delItemUrl = (idx) => {
  return `http://127.0.0.1:8000/api/v1/registerItem/${idx}/delete/`;
};

function Register() {
  const [itemList, setItemList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedAll, setCheckedAll] = useState(false);

  const fetchItemList = async () => {
    try {
      const response = await axios.get(REGISTER_ITEM_LIST_URL);
      setItemList(response.data.register_items);
    } catch (error) {
      console.error('Error fetching item list:', error);
    }
  };

  useEffect(() => {
    fetchItemList();
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
      const response = await axios.delete(delItemUrl(idx));
      setItemList(response.data.register_items);
    } catch (error) {
      console.error('Error deleting item list:', error);
    }
  }
  
  const debug = () => { console.log(checkedItems); };
  const deleteAll = () => { 
    for (const key in checkedItems) {
      const value = checkedItems[key];
      console.log(`Key: ${key}, Value: ${value}`);
      if (value) deleteItem(key);
    }
    window.location.href = "/";
  };

  return (
    <div className="container mt-5">
      <div>
        <h1 className='mb-3'>Concept Register</h1>
        <div>
          <div>GET : {REGISTER_ITEM_LIST_URL}</div>
        </div>
        <button onClick={debug}>검사</button>
        <input 
          type="checkbox" 
          checked={checkedAll} 
          onChange={handleCheckboxAll}
          style={{transform: "scale(1.5)"}}
          className='m-3'
        />
        <button onClick={fetchItemList} className="btn btn-secondary mt-3 mb-3" style={{ maxWidth: '100px', width: '100%' }}>get data</button>
        <button onClick={deleteAll} className="btn btn-danger m-3" style={{ maxWidth: '130px', width: '100%' }}>select delete</button>
      </div>
      <div className=" list-group list-group-flush row align-items-center">
        {itemList.map(item => (
          <li key={item.id} className="list-group-item m-1 justify-content-center">
            <div>
              <div className="row align-items-center">
                <div className="col" style={{maxWidth: "10px"}}>
                  <input 
                    type="checkbox" 
                    checked={checkedItems[item.id]} 
                    onChange={() => handleCheckboxChange(item.id)}
                    style={{transform: "scale(1.5)"}}
                  />
                </div>
                <Link className="col" to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                  <div className="col">
                    <h5 className="card-title">{item.id} {item.name}</h5>
                  </div>
                  <div className="col">
                    <p className="card-text">{item.camelCase}</p>
                  </div>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
}

export default Register;
