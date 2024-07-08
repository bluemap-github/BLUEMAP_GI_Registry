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

const componentDetails = [
  { Component: ItemDetail, state: 'itemList', setState: 'setItemList', api: CONCEPT_ITEM_ONE },
  { Component: ManagementInfoDetail, state: 'MI', setState: 'setMI', api: GET_MANAGEMENT_INFO },
  { Component: ReferenceSourceDetail, state: 'RS', setState: 'setRS', api: GET_REFERENCE_SOURCE },
  { Component: ReferenceDetail, state: 'References', setState: 'setReferences', api: GET_REFERENCE }
];

function Detail() {
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
    setState(prev => ({
      ...prev,
      numModal: int,
      originData: state[componentDetails[int - 1].state]
    }));
  };

  const handleFollowIdx = (int) => setState(prev => ({ ...prev, followIdx: int }));
  const handleKeyIdx = (int) => setState(prev => ({ ...prev, keyIdx: int }));

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
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-5">
      <Base
        itemList={state.originData}
        isOpen={state.isModalOpen}
        onClose={closeModal}
        selectedForm={state.numModal}
        keyIdx={state.keyIdx}
        followIdx={state.followIdx}
      />
      <h1 className='mb-3'>Concept Register</h1>
      <div>
        <div className='mb-3 mt-3'>GET : {CONCEPT_ITEM_ONE}</div>
      </div>
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
        <Link to="/">
          <button className="btn btn-primary" style={{ maxWidth: '150px', width: '100%' }}>Back to list</button>
        </Link>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>
  );
}

export default Detail;
