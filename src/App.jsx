import React, { useState } from 'react';
import HollowCircle from './HollowCircle';
import './App.css';

const App = () => {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  const [color, setColor] = useState();

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
