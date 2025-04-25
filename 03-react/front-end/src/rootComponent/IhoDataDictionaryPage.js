import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import CheckRole from '../Common/CheckRole';
import IhoDataDictionaryRegister from '../IHO_Registry/IHO_DataDictionary/DataDictionaryRegister';
import IhoDDR_Detail from '../IHO_Registry/IHO_DataDictionary/DDR_Detail';

function DataDictionaryPage() {
  return (
    <div>
      <Outlet /> 
      
      <Routes>
        <Route path="list" element={<CheckRole><IhoDataDictionaryRegister/></CheckRole>} />
        <Route path="detail" element={<CheckRole><IhoDDR_Detail /></CheckRole>} />
      </Routes>
    </div>
  );
}
export default DataDictionaryPage;