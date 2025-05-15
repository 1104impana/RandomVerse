import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import Paint from './components/Paint.jsx';
import Fortune from './components/Fortune.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paint" element={<Paint />} />
        <Route path="/fortune" element={<Fortune />} />
      </Routes>
    </Router>
  );
}
