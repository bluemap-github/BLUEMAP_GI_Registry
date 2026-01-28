import React from 'react';
import { Route, Routes, Outlet, useLocation  } from 'react-router-dom';
import CheckRole from '../Common/CheckRole';
import ConceptDetail from '../S100_Registry/Concept/Detail/Detail';
import ConceptRegister from '../S100_Registry/Concept/ConceptRegister';

function ConceptPage() {
  const location = useLocation();
  console.log("현재 접속 주소:", location.pathname); // 예: "/concept/list" 또는 "/concept/detail"

  return (
    <div>
      <Outlet /> {/* 중첩된 라우트가 이곳에 렌더링됩니다 */}
      
      <Routes>
        <Route path="list" element={<CheckRole><ConceptRegister /></CheckRole>} />
        <Route path="detail" element={<CheckRole><ConceptDetail /></CheckRole>} />
      </Routes>
    </div>
  );
}

export default ConceptPage;
