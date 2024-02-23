import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ITEM_DETAIL_URL } from './api';

function Detail() {
  // 동적 라우팅 변수 - 내장함수 useParams 사용
  const { id } = useParams();

  // // setItemList 함수가 샐행될때마다 itemList가 업데이트 됨
  const [itemList, setItemList] = useState(null);

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
        <h1 className='mb-3'>Concept Register</h1>
        <div>
          <div className='mb-3 mt-3'>GET : {ITEM_DETAIL_URL}{id}/</div>
        </div>
        <div className="row">
          <div className="col">
            <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
              <h4>Concept Details</h4>
              <div>Name : {itemList.item.name}</div>
              <div>Alias : {JSON.stringify(itemList.item.alias)}</div>
              <div>CamelCase : {itemList.item.camelCase}</div>
              <div>Definition : {itemList.item.definition}</div>
            </div>
            <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
              <h4>Management Details</h4>
              {itemList.management_infos.map((info, idx) => (
                <li key={info.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                  <h5>info {idx+1}</h5>
                  <div>Proposal Type : {info.proposalType}</div>
                  <div>Submitting Org : {info.submittingOrganisation}</div>
                  <div>Proposed Change : {info.proposedChange}</div>
                  <div>Date Proposed : {info.dateProposed}</div>
                  <div>Date Accepted : {info.dateAmended}</div>
                </li>
              ))}
            </div>
            <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
              <h4>Reference Sources</h4>
              {itemList.reference_sources.map((source, idx) => (
                  <li key={source.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                    <h5>source {idx+1}</h5>
                    <div>Source Document : {source.sourceDocument}</div>
                    <div>Similarity : {source.similarity}</div>
                  </li>
                ))}
            </div>
            <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
              <h4>References</h4>
              {itemList.references.map((ref, idx) => (
                <li key={ref.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                  <h5>refrence {idx+1}</h5>
                  <div>Source Document : {ref.sourceDocument}</div>
                </li>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Link to="/">
              <button className="btn btn-primary" style={{ maxWidth: '150px', width: '100%' }}>Back to list</button>
          </Link>
        </div>
    </div>
  );
}

export default Detail;
