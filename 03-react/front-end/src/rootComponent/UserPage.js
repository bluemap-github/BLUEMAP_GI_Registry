import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import MyMain from '../User/myPage/myMain';
import CreateRegistry from '../User/myPage/CreateRegistry';

function UserPage() {
  return (
    <div>
      <Outlet /> 
            
      <Routes>
        <Route path="mymain" element={<PrivateRoute><MyMain /></PrivateRoute>} />
        <Route path="create-registry" element={<PrivateRoute><CreateRegistry /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
export default UserPage;