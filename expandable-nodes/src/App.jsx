import React, { useState, useMemo, useCallback } from 'react';
import './App.css'
import ForceGraph3D from 'react-force-graph-3d';
import ForceGraph2D from "react-force-graph-2d";
import DropDown from './components/DropDown'
import GraphFunction from './components/GraphFunction'

import SubmitOrderData from './data/submitOrder.json'
import CancelOrderData from './data/cancelOrder.json'
import cancelTransferOrderData from './data/cancelTransferOrder.json'
import disconnectAccount_V2Data from './data/disconnectAccount_V2.json'

let GraphDataMap = new Map();
GraphDataMap.set("submitOrder",SubmitOrderData)
GraphDataMap.set("cancelOrder", CancelOrderData)
GraphDataMap.set("cancelTransferOrder", cancelTransferOrderData)
GraphDataMap.set("disconnectAccount_V2", disconnectAccount_V2Data)

function App() {
  const [message, setMessage] = useState('disconnectAccount_V2');
  const [GraphData, setGraphData] = useState(GraphDataMap.get(message));

  const updateMessage = (newMessage) => {
    setMessage(newMessage);
    setGraphData(GraphDataMap.get(newMessage))
  };
  
  
  return (
    <div>
      <GraphFunction GraphData={message} />  
      <h1>{message}</h1>
      <DropDown updateMessage={updateMessage} />
    </div>
  );
}

export default App

// 