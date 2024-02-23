import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from './api';

function Register() {
  // setItemList 함수가 샐행될때마다 itemList가 업데이트 됨
  const [itemList, setItemList] = useState([]);

  // fetchItemList : api를 요청하는 비동기 함수
  const fetchItemList = async () => {
    try {
      const response = await axios.get(REGISTER_ITEM_LIST_URL);
      setItemList(response.data.register_items);
    } catch (error) {
      console.error('Error fetching item list:', error);
    }
  };

  // useEffect : React의 내장함수 - 컴포넌트가 렌더링 될때마다 fetchItemList() 함수를 실행함
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
        {/* get data 버튼을 누르면 fetchItemList 함수가 실행됨 - api를 새로 받아오는 작업*/}
        <button onClick={fetchItemList} className="btn btn-secondary mt-3 mb-3" style={{ maxWidth: '100px', width: '100%' }}>get data</button>
      </div>
      <div className="row align-items-center">
          {itemList.map(item => (
            <li key={item.id} className="card m-1 justify-content-center">
              {/* 리스트들을 보여주고 각각 id에 해당하는 detail 페이지로 가도록 하고 있음 */}
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