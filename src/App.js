import React from 'react';
import Register_form from './components/register_form';
import FabricCanvas from './components/FabricCanvas';

const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <p>Welcome to my React app.</p>
      <Register_form />
      <FabricCanvas />
    </div>
  );
};

export default App;