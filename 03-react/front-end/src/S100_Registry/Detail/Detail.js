import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ITEM_DETAIL_URL } from '../api';
import ItemDetail from './components/ItemDetail'
import ManagementInfoDetail from './components/ManagementInfoDetail'
import ReferenceSourceDetail from './components/ReferenceSourceDetail'
import ReferenceDetail from './components/ReferenceDetail'
import Base from './modals/Base'

function Detail() {
  // 동적 라우팅 변수 - 내장함수 useParams 사용
  const { id } = useParams();

  // // setItemList 함수가 샐행될때마다 itemList가 업데이트 됨
  const [itemList, setItemList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numModal, setModalNumber] = useState(2);
  const [followIdx, setFollowIdx] = useState(1);
  const [keyIdx, setKeyIdx] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateButtonClick = (int) => {
    openModal();
    setModalNumber(int);
  };

  const handleFollowIdx = (int) => {
    setFollowIdx(int);
  }
  const handleKeyIdx = (int) => {
    setKeyIdx(int)
  }

  useEffect(() => {
    // fetchItemList 함수를 useEffect 안으로 넣어서 컴포넌트가 렌더링될때마다 호출하도록 함 - id 값을 먼저 받아와야 하기 때문
    const fetchItemList = async () => {
      try {
        const response = await axios.get(`${ITEM_DETAIL_URL}${id}/`);
        setItemList(response.data);
      } catch (error) {
        console.error('Error fetching item list:', error);
      }
    };

    fetchItemList();
  }, [id]);
  

  // 로딩 
  if (!itemList) {
    return <div>Loading...</div>; 
  }

  else return (
    <div className="container mt-5">
      <div style={{height: '70px'}}></div>
      <Base itemList={itemList} isOpen={isModalOpen} onClose={closeModal} selectedForm={numModal} keyIdx={keyIdx} followIdx={followIdx}/>  {/* selectedForm 숫자 바꾸는 로직 추가하면 됨 */}
      <h1 className='mb-3'>GI Register</h1>
      <div>
        <div className='mb-3 mt-3'>GET : {ITEM_DETAIL_URL}{id}/</div>
      </div>
      <div className="row">
        <div className="col">
          <ItemDetail itemList={itemList} handleUpdateButtonClick={handleUpdateButtonClick} handleKeyIdx={handleKeyIdx}/>
          <ManagementInfoDetail itemList={itemList} handleUpdateButtonClick={handleUpdateButtonClick} handleFollowIdx={handleFollowIdx} handleKeyIdx={handleKeyIdx}/>
          <ReferenceSourceDetail itemList={itemList} handleUpdateButtonClick={handleUpdateButtonClick} handleKeyIdx={handleKeyIdx}/>
          <ReferenceDetail itemList={itemList} handleUpdateButtonClick={handleUpdateButtonClick} handleFollowIdx={handleFollowIdx} handleKeyIdx={handleKeyIdx}/>
        </div>
      </div>
      <div>
        <Link to="/">
            <button className="btn btn-primary" style={{ maxWidth: '150px', width: '100%' }}>Back to list</button>
        </Link>
      </div>
      <div style={{height: '200px'}}></div>
    </div>
  );
}

export default Detail;
