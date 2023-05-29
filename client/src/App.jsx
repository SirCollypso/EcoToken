import React from "react";
import { Routes, Route } from 'react-router-dom';

import About from './pages/About';
import Individual from './pages/Individual';
import Business from './pages/Business';

const App = () => (
  <Routes>
    <Route path="/" element={<Individual />} />
    <Route path="business" element={<Business />} />
    <Route path="about" element={<About />} />
  </Routes>
);

export default App;
