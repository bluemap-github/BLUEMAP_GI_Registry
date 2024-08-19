import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import RegiHome from './S100_Registry/RegiHome';
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

import Navbar from './Common/Navbar';
import MySidebar from './Common/MySidebar';
import GetUserInfo from './Common/GetUserInfo';
import CreateRegistry from './User/myPage/CreateRegistry';
import ErrorPage from './Common/ErrorPage';
import InnerNav from './Common/InnerNav';
import InnerMyNav from './Common/InnerMyNav';

import Browsing from './Common/Browsing/Browsing';

import PrivateRoute from './PrivateRoute';
import EnterRegi from './Common/EnterRegi';
import {ENTER_REGI,BROWSING,  INTRO, SIGN_IN, SIGN_UP, MY_MAIN, CREATE_REGI, ACCESS, ERROR, RERI_HOME, CONCEPT_LIST, CONCEPT_DETAIL, CREATE_ITEM, DDR_LIST, DDR_DETAIL, PORTAYAL_LIST} from './Common/PageLinks';
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
  const hideAll = location.pathname === '/' || 
                location.pathname === '/user/signin' || 
                location.pathname === '/user/signup' || 
                location.pathname === '/browsing';

  return (
    <div>
      <div className='navBar-rest'><GetUserInfo><Navbar /></GetUserInfo></div>
      <div className="app-container">
        {hideAll ? null : (
          <>
            {!hideSidebar && <SideBar />}
            {hideSidebar && <GetUserInfo><MySidebar /></GetUserInfo>}
            <div className='side-rest-wide'></div>
          </>
        )}
        <div style={{ width: '90%'}}>
          {hideAll ? null : (
            <>
              {!hideSidebar && 
                <InnerNav/>
              }
              {hideSidebar && 
                <GetUserInfo><InnerMyNav/></GetUserInfo>
              }
            </>
          )}
          <Routes>
            <Route path={INTRO} element={<SignIn />} />
            <Route path={SIGN_IN} element={<SignIn />} />
            <Route path={SIGN_UP} element={<SignUp />} />
            <Route path={MY_MAIN} element={<PrivateRoute><MyMain /></PrivateRoute>} />
            <Route path={CREATE_REGI} element={<PrivateRoute><CreateRegistry /></PrivateRoute>} />
            
            
            <Route path=":id" element={<EnterRegi><RegiHome /></EnterRegi>} />
            <Route path={`/${sessionStorage.getItem('REGISTRY_URI')}/concept/list`} element={<ConceptRegister />} />
            <Route path={`/${sessionStorage.getItem('REGISTRY_URI')}/concept/detail`} element={<ConceptDetail />} />
            <Route path={`/${sessionStorage.getItem('REGISTRY_URI')}/create`} element={<PrivateRoute><InsertItem /></PrivateRoute>} />
            <Route path={`/${sessionStorage.getItem('REGISTRY_URI')}/dataDictionary/list`} element={<DataDictionaryRegister/>} />
            <Route path={`/${sessionStorage.getItem('REGISTRY_URI')}/dataDictionary/detail`} element={<DDR_Detail />} />
            <Route path={`/${sessionStorage.getItem('REGISTRY_URI')}/portrayal/list`} element={<PortrayalRegister />} />

            <Route path="/browsing" element={<Browsing />}/>

            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </div>
        </div>
    </div>
  );
}



export default App;
