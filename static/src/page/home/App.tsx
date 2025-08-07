import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TestHome from '../test/TestHome';
import TestPage from '../test/TestPage';
import Home from '../Home';

const App: React.FC = () => {
  return (
      <div style={{ padding: 20 }}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/testPage" element={<TestPage />} />
            <Route path="/home" element={<TestHome />} />
        </Routes>
      </div>
  );
};

export default App;