import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import CheckRole from '../Common/CheckRole';
import PortrayalRegister from '../S100_Registry/Portrayal/PortrayalRegister';
import PR_Detail from '../S100_Registry/Portrayal/Read/PR_Detail';

function PortrayalPage() {
  return (
    <div>
      <Outlet /> 
      
      <Routes>
        <Route path="list" element={<CheckRole><PortrayalRegister /></CheckRole>} />
        <Route path="detail" element={<CheckRole><PR_Detail /></CheckRole>} />
      </Routes>
    </div>
  );
}
export default PortrayalPage;