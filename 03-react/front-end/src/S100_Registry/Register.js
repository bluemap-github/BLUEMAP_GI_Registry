import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from './api';

function Register() {
  const [itemList, setItemList] = useState([]);

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
  }, []);

  

  return (
    <div className="container mt-5">
      <div>
      <h1 className='mb-3'>Concept Register</h1>
        <div>
          <div>GET : {REGISTER_ITEM_LIST_URL}</div>
        </div>
        <button onClick={fetchItemList} className="btn btn-secondary mt-3 mb-3" style={{ maxWidth: '100px', width: '100%' }}>get data</button>
      </div>
      <div className="row align-items-center">
          {itemList.map(item => (
            <li key={item.id} className="card m-1 justify-content-center">
              <Link to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h5 className="card-title">{item.id} {item.name}</h5>
                    </div>
                    <div className="col">
                      <p className="card-text">{item.camelCase}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </div>
    </div>
  );
}

export default Register;