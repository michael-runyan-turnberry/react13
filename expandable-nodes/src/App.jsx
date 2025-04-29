import React from 'react';
import './App.css'
import GraphFunction from './components/GraphFunction'

function App() {





  return (
    <div >
    <div  style={{ backgroundColor:  'white',height:'100vw'}}  >
      <GraphFunction />
      <div className='container' >

      </div>
      <p style={{textAlign: "center"}}>Service relationships are defined by documentation below.
        Services not included in documentation relationships are predicted according to time and frequency they are called following other services </p>
      <p style={{textAlign: "center"}}>https://chalk.charter.com/display/OIS/COOL</p>

    </div>
    </div>
  );
}

export default App

//