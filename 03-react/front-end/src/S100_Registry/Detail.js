import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ITEM_DETAIL_URL } from './api';

function MyComponent() {
  const { id } = useParams();

  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    fetchItemList();
  }, []);

  const fetchItemList = async () => {
    try {
      const response = await axios.get(`${ITEM_DETAIL_URL}${id}/`);
      setItemList(response.data);

    } catch (error) {
      console.error('Error fetching item list:', error);
    }
  };

  return (
    <div>
        <p>URL Parameter: {id}</p>
        <div>{ITEM_DETAIL_URL}{id}/</div>
        <div>{JSON.stringify(itemList)}</div>
        <div className="row justify-content-center">
        <Link to="/register">
            <button className="btn btn-primary" style={{ maxWidth: '200px', width: '100%' }}>back</button>
        </Link>
    </div>
    </div>
    
  );
}

export default MyComponent;