import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from './api';

function Register() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    fetchItemList();
  }, []);

  const fetchItemList = async () => {
    try {
      const response = await axios.get(REGISTER_ITEM_LIST_URL);
      setItemList(response.data.register_items);
    } catch (error) {
      console.error('Error fetching item list:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Register Page</h1>
      <div>
        <div className="row justify-content-center">
          <button className="btn btn-primary" onClick={fetchItemList} style={{ maxWidth: '200px', width: '100%' }}>get data</button>
        </div>
        <div>
          <h2>Item List:</h2>
          <ul className="list-group">
            {itemList.map(item => (
              <Link to={`/detail/${item.id}`}>
                <li className="list-group-item card mb-3" key={item.id}>
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{JSON.stringify(item)}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;