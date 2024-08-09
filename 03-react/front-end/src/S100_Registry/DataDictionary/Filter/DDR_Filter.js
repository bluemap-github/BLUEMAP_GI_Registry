import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_DDR_ITEM_LIST } from '../api';

const DDR_Filter = ({ data, onSearch }) => {
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [enumType, setEnumType] = useState('');
  const [valueType, setValueType] = useState('');

  const fetchItems = async (params) => {
    // API 요청을 수행하여 데이터를 가져옴
    try {
      const USER_SERIAL = sessionStorage.getItem('USER_SERIAL');
      const regi_uri = sessionStorage.getItem('REGISTRY_URI');
      const response = await axios.get(GET_DDR_ITEM_LIST, {
        params: {
          regi_uri: regi_uri,
          item_type: data, // viewType에 해당
          ...params, // 추가적인 파라미터 전달 (status, category, search_term, enumType, valueType)
        },
      });

      // 가져온 데이터를 상위 컴포넌트로 전달
      onSearch(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    // 검색 버튼 클릭 시 데이터 요청
    const searchParams = { status, category, search_term: searchTerm };
    if (data === 'EnumeratedValue') {
      searchParams.enum_type = enumType;
    }
    if (data === 'SimpleAttribute') {
      searchParams.value_type = valueType;
    }
    await fetchItems(searchParams);
  };

  useEffect(() => {
    // data가 변경될 때마다 상태 초기화 및 데이터 요청
    setStatus('');
    setCategory('');
    setSearchTerm('');
    setEnumType('');
    setValueType('');
    fetchItems({});
  }, [data]);

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {data === 'EnumeratedValue' && (
          <div>
            <label>Enum Type:</label>
            <select value={enumType} onChange={(e) => setEnumType(e.target.value)}>
              <option value="">Choose</option>
              <option value="S100_Codelist">S100_Codelist</option>
              <option value="enumeration">enumeration</option>
            </select>
          </div>
        )}
        {data === 'SimpleAttribute' && (
          <div>
            <label>Value Type:</label>
            <select value={valueType} onChange={(e) => setValueType(e.target.value)}>
              <option value="">Choose</option>
              <option value="boolean">boolean</option>
              <option value="enumeration">enumeration</option>
              <option value="integer">integer</option>
              <option value="real">real</option>
              <option value="date">date</option>
              <option value="text">text</option>
              <option value="time">time</option>
              <option value="dateTime">dateTime</option>
              <option value="URI">URI</option>
              <option value="URL">URL</option>
              <option value="URN">URN</option>
              <option value="S100_CodeList">S100_CodeList</option>
              <option value="S100_TruncatedDate">S100_TruncatedDate</option>
            </select>
          </div>
        )}
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="processing">Processing</option>
            <option value="valid">Valid</option>
            <option value="superseded">Superseded</option>
            <option value="notValid">Not Valid</option>
            <option value="retired">Retired</option>
            <option value="clarified">Clarified</option>
          </select>
        </div>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Choose</option>
            <option value="name">Name</option>
            <option value="camelCase">Camel Case</option>
            <option value="definition">Definition</option>
          </select>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default DDR_Filter;
