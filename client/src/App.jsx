import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
//import Individual from './pages/Individual';
import Business from './pages/Business';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="business" element={<Business />} />
    <Route path="about" element={<About />} />
  </Routes>
);

export default App;
