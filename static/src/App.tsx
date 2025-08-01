import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import Home from './views/Home';

const App: React.FC = () => {
  return (
      <div style={{ padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/">
            <Button type="primary">Home</Button>
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
  );
};

export default App;