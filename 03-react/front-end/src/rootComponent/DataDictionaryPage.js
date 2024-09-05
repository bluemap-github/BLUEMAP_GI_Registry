import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import CheckRole from '../Common/CheckRole';
import DataDictionaryRegister from '../S100_Registry/DataDictionary/DataDictionaryRegister';
import DDR_Detail from '../S100_Registry/DataDictionary/DDR_Detail';

function DataDictionaryPage() {
  return (
    <div>
      <Outlet /> 
      
      <Routes>
        <Route path="list" element={<CheckRole><DataDictionaryRegister/></CheckRole>} />
        <Route path="detail" element={<CheckRole><DDR_Detail /></CheckRole>} />
      </Routes>
    </div>
  );
}
export default DataDictionaryPage;