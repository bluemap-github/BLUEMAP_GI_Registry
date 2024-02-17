import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Register() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/itemList/');
        setItemList(response.data);
      } catch (error) {
        console.error('Error fetching item list:', error);
      }
    };

    fetchItemList();
  }, []);

  return (
    <div>
      <div>안니옹!!!</div>
      <h1>Register Page</h1>
      <h2>Item List:</h2>
      <ul>
        {itemList.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Register;
