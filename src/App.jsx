import React, { useState } from 'react';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
import HollowCircle from './HollowCircle';
import './App.css';

const App = () => {
  const [hsva, setHsva] = useState({
    h: 214.1176470588235,
    s: 100,
    v: 100,
    a: 1,
  });
  const [color, setColor] = useState(hsvaToHex(hsva));
  return (
    <div className="App" style={{ background: `${color}` }}>
      <HollowCircle
        color={hsva}
        onChange={(color) => {
          setHsva({ ...hsva, ...color.hsva });
          setColor(color.hex);
        }}
      />
    </div>
  );
};

export default App;
