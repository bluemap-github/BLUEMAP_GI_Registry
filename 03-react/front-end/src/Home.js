import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1 className="text-center">Home Page</h1>
      <div>안니옹!!! 여기는 H.O.M.E</div>
      {/* Register 경로로 이동하는 버튼 */}
      <Link to="/register">
        <button className="btn btn-primary">Go to Register</button>
      </Link>
    </div>
  );
}

export default Home;