import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import RegiHome from './S100_Registry/Home';
import ConceptDetail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import SideBar from './S100_Registry/Sidebar';
import './App.css';
import DataDictionaryRegister from './S100_Registry/DataDictionary/DataDictionaryRegister';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';
import DDR_Detail from './S100_Registry/DataDictionary/DDR_Detail';
import Introduce from './User/signIn/introduce';
import SignUp from './User/signUp/signUp';
import SignIn from './User/signIn/signIn';
import MyMain from './User/myPage/myMain';
import PrivateRoute from './PrivateRoute';
import Navbar from './Common/Navbar';
import MySidebar from './Common/MySidebar';
import GetUserInfo from './Common/GetUserInfo';
import CreateRegistry from './User/myPage/CreateRegistry';
import ErrorPage from './Common/ErrorPage';
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname.startsWith('/user');
  const hideAll = location.pathname === '/' || location.pathname === '/user/signin' || location.pathname === '/user/signup';

  return (
    <div>
      {hideAll ? null : (
        <div className='navBar-rest'>
          <GetUserInfo>
            <Navbar />
          </GetUserInfo>
        </div>
      )}
      <div className="app-container">
        {hideAll ? null : (
          <>
            {!hideSidebar && <SideBar />}
            {hideSidebar && <MySidebar />}
            <div className='side-rest-wide'></div>
          </>
        )}
        
        <Routes>
          <Route path="/" element={<Introduce />} />
          <Route path="/user/signin" element={<SignIn />} />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/user/mymain" element={<PrivateRoute><MyMain /></PrivateRoute>} />
          <Route path="/user/create-registry" element={<PrivateRoute><CreateRegistry /></PrivateRoute>} />

          <Route path="/error" element={<ErrorPage />} />
          <Route path="/concept/:register_id" element={<ConceptRegister />} />
          <Route path="/concept/detail" element={<ConceptDetail />} />
          <Route path="/concept/create/:register_id" element={<InsertItem />} />
          <Route path='/dataDictionary/:register_id' element={<DataDictionaryRegister/>} />
          <Route path="/dataDictionary" element={<DDR_Detail />} />
          <Route path='/portrayal/:register_id' element={<PortrayalRegister />} />
        </Routes>
      </div>
    </div>
  );
}


export default App;
