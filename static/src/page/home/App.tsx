import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import TestPage from '../../page/TestPage';

const App: React.FC = () => {
  return (
      <div style={{ padding: 20 }}>
        <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/home" element={<Home />} />
        </Routes>
      </div>
  );
};

export default App;