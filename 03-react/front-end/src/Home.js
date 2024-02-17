import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <div>안니옹!!! 여기는 H.O.M.E</div>
      {/* Register 경로로 이동하는 버튼 */}
      <Link to="/register">Go to Register</Link>
    </div>
  );
}

export default Home;