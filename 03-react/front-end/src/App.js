import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import RegiHome from './S100_Registry/RegiHome';
import InsertItem from './S100_Registry/Insert/Item';
import SideBar from './S100_Registry/Sidebar';
import './App.css';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';
import SignUp from './User/signUp/signUp';
import SignIn from './User/signIn/signIn';
import Navbar from './Common/Navbar';
import MySidebar from './Common/MySidebar';
import GetUserInfo from './Common/GetUserInfo';
import ErrorPage from './Common/ErrorPage';
import InnerNav from './Common/InnerNav';
import InnerMyNav from './Common/InnerMyNav';
import Browsing from './Common/Browsing/Browsing';
import EnterRegi from './Common/EnterRegi';
import IsLogined from './Common/IsLogined';
import IsOwnRegi from './Common/IsOwnRegi';
import RegiNavBar from './Common/RegiNavBar';
import PortrayalPage from './rootComponent/PortrayalPage';
import ConceptPage from './rootComponent/ConceptPage';
import DataDictionaryPage from './rootComponent/DataDictionaryPage';
import UserPage from './rootComponent/UserPage';
import InsertPortrayalItem from './S100_Registry/Portrayal/Insert/InsertPortrayalItem';
import './SettingRegistry.css'; 



function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2024 BLUEMAP Inc. All rights reserved.</p>
        <p>v0.0.4</p>
      </div>
    </footer>
  );
};


function AppContent() {
  return (
    <div>
      <Routes>
        <Route path="user/*" element={<UserSection />} />
        <Route path=":id/*" element={<RegistrySection />} />
        <Route path="main/*" element={<Others />} /> {/* main/* 경로로 Others 처리 */}
        <Route path="/" element={<IsLogined><SignIn /></IsLogined>} />
        <Route path="user/signin" element={<IsLogined><SignIn /></IsLogined>} />
        <Route path="user/signup" element={<IsLogined><SignUp /></IsLogined>} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} /> {/* 올바르지 않은 경로를 처리 */}
      </Routes>
      <Footer />
    </div>
  );
}




function Others() {
  return (
    <>
      <div className='nav-bar-top'>
        <GetUserInfo><Navbar /></GetUserInfo>
      </div>
      <div className="container">
        <div style={{maxWidth: '1800px', minWidth: '1440px'}}>
          <Routes>
            <Route path="browsing" element={<Browsing />} />
            {/* 필요한 경우 여기에 더 많은 하위 라우트 추가 가능 */}
          </Routes>
        </div>
      </div>

      
    </>
  );
}




function RegistrySection() {
  return (
    <>
      <div className='nav-bar-top'>
        <GetUserInfo><RegiNavBar /></GetUserInfo>
      </div>
      <div className="container"> {/* Flexbox로 컨테이너 지정 */}
        <SideBar /> {/* 사이드바 스타일 적용 */}
        <div className="content"> {/* 메인 콘텐츠 스타일 적용 */}
          <InnerNav />
          <div className='p-5 pt-3' style={{maxWidth: '1800px', minWidth: '1200px'}}>
            <Routes>
              <Route path="/" element={<EnterRegi><RegiHome /></EnterRegi>} />
              <Route path="concept/*" element={<ConceptPage />} />
              <Route path="dataDictionary/*" element={<DataDictionaryPage />} />
              <Route path="portrayal/*" element={<PortrayalPage />} />
              <Route path="create" element={<IsOwnRegi><InsertItem /></IsOwnRegi>} />
              <Route path="create-portrayal" element={<IsOwnRegi><InsertPortrayalItem /></IsOwnRegi>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}


function UserSection() {
  return (
    <>
      <div className='nav-bar-top'>
        <GetUserInfo><Navbar /></GetUserInfo>
      </div>
      <div className="container"> {/* Flexbox로 컨테이너 지정 */}
        <GetUserInfo><MySidebar className="sidebar" /></GetUserInfo> {/* 사이드바 스타일 적용 */}
        <div className="content"> {/* 메인 콘텐츠 스타일 적용 */}
          <GetUserInfo><InnerMyNav/></GetUserInfo>
          <div className='p-5 pt-3' style={{maxWidth: '1800px', minWidth: '1200px'}}>
            <Routes>
              <Route path="/*" element={<UserPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
