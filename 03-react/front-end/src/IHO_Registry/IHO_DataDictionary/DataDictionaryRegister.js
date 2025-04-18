import React, { useState, useContext } from 'react';
import DDR_List from './DDR_List';
import DDR_Choose from './DDR_Choose';
import { ItemContext } from '../../context/ItemContext';

function DataDictionaryRegister() {
  const { itemDetails } = useContext(ItemContext);
  const [viewType, setViewType] = useState("EnumeratedValue");
  const [filteredItems, setFilteredItems] = useState([]); // 필터링된 데이터를 저장할 상태

  const clickHandler = (num) => {
    setViewType(num);
  }

  const onSearch = (searchResult) => {
    // 검색 결과를 저장
    setFilteredItems(searchResult.register_items || []);
  }

  return (
    <div>
      <div>
        <DDR_Choose clickHandler={clickHandler} viewType={viewType} />
      </div>
      <div>
        <DDR_List viewType={viewType}/> 
      </div>
    </div>
  );
}

export default DataDictionaryRegister;
