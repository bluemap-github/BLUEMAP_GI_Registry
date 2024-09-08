import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import CheckRole from '../Common/CheckRole';
import PortrayalRegister from '../S100_Registry/Portrayal/PortrayalRegister';

function PortrayalPage() {
  return (
    <div>
      <Outlet /> 
      
      <Routes>
        <Route path="list" element={<CheckRole><PortrayalRegister /></CheckRole>} />
        
      </Routes>
    </div>
  );
}
export default PortrayalPage;