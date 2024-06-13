import React, { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../../context/ItemContext'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CONCEPT_ITEM_ONE, GET_MANAGEMENT_INFO, GET_REFERENCE_SOURCE, GET_REFERENCE } from '../api';
import ItemDetail from './components/ItemDetail';
import ManagementInfoDetail from './components/ManagementInfoDetail';
import ReferenceSourceDetail from './components/ReferenceSourceDetail';
import ReferenceDetail from './components/ReferenceDetail';
import Base from './modals/Base';


function Detail() {
  const { itemDetails } = useContext(ItemContext); 
  const { item_id, item_iv } = itemDetails;
  const itemParams = {
    item_id: item_id,
    item_iv: item_iv
  };

  const [itemList, setItemList] = useState(null);
  const [originData, setOriginData] = useState(null);
  const [MI, setMI] = useState(null);
  const [RS, setRS] = useState(null);
  const [References, setReferences] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numModal, setModalNumber] = useState(2);
  const [followIdx, setFollowIdx] = useState(1);
  const [keyIdx, setKeyIdx] = useState(0);
  const [loading, setLoading] = useState(true); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateButtonClick = (int) => {
    openModal();
    setModalNumber(int);
    switch (int) {
      case 1:
        setOriginData(itemList);
        break;
      case 2:
        setOriginData(MI);
        break;
      case 3:
        setOriginData(RS);
        break;
      case 4:
        setOriginData(References);
        break;
      // case 5:
      //   setFollowIdx(0);
      //   break;
      // case 6:
      //   setFollowIdx(0);
      //   break;
      // case 7:
      //   setFollowIdx(0);
      //   break;
      default:
        setFollowIdx(1);
    }
  };

  const handleFollowIdx = (int) => {
    setFollowIdx(int);
  };

  const handleKeyIdx = (int) => {
    setKeyIdx(int);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemListResponse, miResponse, rsResponse, referencesResponse] = await Promise.all([
          axios.get(CONCEPT_ITEM_ONE, { params: itemParams }),
          axios.get(GET_MANAGEMENT_INFO, { params: itemParams }),
          axios.get(GET_REFERENCE_SOURCE, { params: itemParams }),
          axios.get(GET_REFERENCE, { params: itemParams })
        ]);

        console.log(itemListResponse.data);
        console.log(miResponse.data);
        console.log(rsResponse.data);
        console.log(referencesResponse.data);
        setItemList(itemListResponse.data);
        setMI(miResponse.data);
        setRS(rsResponse.data);
        setReferences(referencesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [item_id, item_iv]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-5">
      <Base itemList={originData} isOpen={isModalOpen} onClose={closeModal} selectedForm={numModal} keyIdx={keyIdx} followIdx={followIdx}/>  
      <h1 className='mb-3'>Concept Register</h1>
      <div>
        <div className='mb-3 mt-3'>GET : {CONCEPT_ITEM_ONE}</div>
      </div>
      <div className="row">
        <div className="col">
          <ItemDetail itemList={itemList} handleUpdateButtonClick={handleUpdateButtonClick} handleKeyIdx={handleKeyIdx}/>
          <ManagementInfoDetail itemList={MI} handleUpdateButtonClick={handleUpdateButtonClick} handleFollowIdx={handleFollowIdx} handleKeyIdx={handleKeyIdx}/>
          <ReferenceSourceDetail itemList={RS} handleUpdateButtonClick={handleUpdateButtonClick} handleKeyIdx={handleKeyIdx}/>
          <ReferenceDetail itemList={References} handleUpdateButtonClick={handleUpdateButtonClick} handleFollowIdx={handleFollowIdx} handleKeyIdx={handleKeyIdx}/>
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
