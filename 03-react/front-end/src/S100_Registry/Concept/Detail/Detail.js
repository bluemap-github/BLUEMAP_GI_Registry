import React, { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../../context/ItemContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import { CONCEPT_ITEM_ONE, GET_MANAGEMENT_INFO, GET_REFERENCE_SOURCE, GET_REFERENCE } from '../api';
import ItemDetail from './components/ItemDetail';
import ManagementInfoDetail from './components/ManagementInfoDetail';
import ReferenceSourceDetail from './components/ReferenceSourceDetail';
import ReferenceDetail from './components/ReferenceDetail';
import Base from './modals/Base';
import FullScreenLoadingSpinner from '../../../Common/FullScreenLoadingSpinner';

const componentDetails = [
  { Component: ItemDetail, state: 'itemList', setState: 'setItemList', api: CONCEPT_ITEM_ONE },
  { Component: ManagementInfoDetail, state: 'MI', setState: 'setMI', api: GET_MANAGEMENT_INFO },
  { Component: ReferenceSourceDetail, state: 'RS', setState: 'setRS', api: GET_REFERENCE_SOURCE },
  { Component: ReferenceDetail, state: 'References', setState: 'setReferences', api: GET_REFERENCE }
];

function Detail() {
  const navigate = useNavigate();
  const { itemDetails } = useContext(ItemContext);
  const { item_id, item_iv } = itemDetails;
  const itemParams = { item_id, item_iv };

  const [state, setState] = useState({
    itemList: null,
    MI: null,
    RS: null,
    References: null,
    originData: null,
    isModalOpen: false,
    numModal: 2,
    followIdx: 1,
    keyIdx: 0,
    loading: true
  });

  const openModal = () => setState(prev => ({ ...prev, isModalOpen: true }));
  const closeModal = () => setState(prev => ({ ...prev, isModalOpen: false }));
  
  const handleUpdateButtonClick = (int) => {
    openModal();
  
    const newState = { numModal: int };
  
    if (int < 5) {
      newState.originData = state[componentDetails[int - 1].state];
    }
  
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const handleFollowIdx = (int) => setState(prev => ({ ...prev, followIdx: int }));
  const handleKeyIdx = (int) => setState(prev => ({ ...prev, keyIdx: int }));

  const moveToList = () => {
    navigate(`/${Cookies.get('REGISTRY_URI')}/concept/list`); // Cookies에서 REGISTRY_URI를 가져옴
  };
    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          componentDetails.map(detail => axios.get(detail.api, { params: itemParams }))
        );

        const newState = responses.reduce((acc, response, index) => {
          acc[componentDetails[index].state] = response.data;
          return acc;
        }, {});

        setState(prev => ({ ...prev, ...newState, loading: false }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [item_id, item_iv]);

  if (state.loading) {
    return <FullScreenLoadingSpinner />;
  }

  return (
    <div>
      <Base
        itemList={state.originData}
        isOpen={state.isModalOpen}
        onClose={closeModal}
        selectedForm={state.numModal}
        keyIdx={state.keyIdx}
        followIdx={state.followIdx}
      />
      <div className="row">
        <div className="col">
          {componentDetails.map((detail, index) => {
            const Component = detail.Component;
            return (
              <Component
                key={index}
                itemList={state[detail.state]}
                handleUpdateButtonClick={handleUpdateButtonClick}
                handleKeyIdx={handleKeyIdx}
                handleFollowIdx={handleFollowIdx}
              />
            );
          })}
        </div>
      </div>
      <div>
        <button onClick={moveToList} className="btn btn-primary" style={{ maxWidth: '150px', width: '100%' }}>Back to list</button>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>
  );
}

export default Detail;
