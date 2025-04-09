import ForceGraph2D from "react-force-graph-2d";
import React, { useState, useMemo, useCallback } from 'react';
import './App.css'


const ExpandableGraph = ({ graphData,fullGraph }) => {
    console.log(graphData)
    // Tooltip
    const [hoveredNode, setHoveredNode] = useState(null);
  
    const handleNodeHover = useCallback(
      (node) => {
        setHoveredNode(node || null);
      },
      [setHoveredNode]
    );
  
    const renderTooltip = useCallback(() => {
      if (!hoveredNode) return null;
  
      return (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            zIndex: 1,
            left: '50%',
            top: '90%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <p>{hoveredNode.name}</p>
          <p>Success Rate: {hoveredNode.success}% </p>
          <p>Call Count: {hoveredNode.rec_count} (24 hr period)</p>
          <p>Avg Exec Time: {hoveredNode.exec_time} ms</p>
        </div>
      );
    }, [hoveredNode]);
    
    // Changing link distance
    const handleGraphRef = (graph) => {
      if (graph) {
        graph.d3Force('link')
          .distance(70); // Example: Constant distance of 100
        
        graph.d3Force('charge')
          .strength(-50) // Example: Reduced charge strength
          .distanceMax(500); // Example: Limit charge distance
      }
    };
    
    //Expandable
    const rootId = 0;
    
    const nodesById = useMemo(() => {
      const nodesByIdLocal = Object.fromEntries(graphData.nodes.map(node => [node.id, node]));
      console.log('nodeslocal',nodesByIdLocal)
      console.log('graph Data',graphData)
      // link parent/children
      graphData.nodes.forEach(node => {
        node.collapsed = node.id !== rootId;
        node.childLinks = [];
      });
      graphData.links.forEach((link,index) => nodesByIdLocal[link.source]?.childLinks.push(link));
      return nodesByIdLocal;
    }, [graphData]);
  
    const getPrunedTree = useCallback(() => {
      const visibleNodes = [];
      const visibleLinks = [];
      (function traverseTree(node = nodesById[rootId]) {
        visibleNodes.push(node);
        if (node.collapsed) return;
        visibleLinks.push(...node.childLinks);
        node.childLinks
          .map(link => ((typeof link.target) === 'object') ? link.target : nodesById[link.target]) // get child node
          .forEach(traverseTree);
      })();
  
      return { nodes: visibleNodes, links: visibleLinks };
    }, [nodesById]);
  
    const [prunedTree, setPrunedTree] = useState(getPrunedTree());
  
  
    const handleNodeClick = useCallback(node => {
      node.collapsed = !node.collapsed; // toggle collapse state
      setPrunedTree(getPrunedTree())
    }, []);
  
    
    
  
    if (fullGraph == "True") {
      return (
        <div style={{ position: 'relative' }}>
        <ForceGraph2D
          graphData={graphData}
          ref={handleGraphRef}
          linkDirectionalParticles={2}
          backgroundColor="lightgray"
          nodeColor={node => node.id === 0 ? "lightblue" : !node.childLinks.length ? 'green' : node.collapsed ? 'yellow' : 'yellow'}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          nodeCanvasObjectMode={() => "after"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black"; //node.color;
            if (node.isClusterNode) {
              ctx.fillText(label, node.x, node.y);
            } else {
              ctx.fillText(label, node.x + 20, node.y);
            }
          }}
          
        />
        {renderTooltip()}
          </div>
        );
    }

    return (
    <div style={{ position: 'relative' }}>
    <ForceGraph2D
      graphData={prunedTree}
      ref={handleGraphRef}
      linkDirectionalParticles={2}
      backgroundColor="lightgray"
      nodeColor={node => node.id === 0 ? "lightblue" : !node.childLinks.length ? 'green' : node.collapsed ? 'red' : 'yellow'}
      onNodeClick={handleNodeClick}
      onNodeHover={handleNodeHover}
      nodeCanvasObjectMode={() => "after"}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black"; //node.color;
        if (node.isClusterNode) {
          ctx.fillText(label, node.x, node.y);
        } else {
          ctx.fillText(label, node.x + 20, node.y);
        }
      }}
      
    />
    {renderTooltip()}
      </div>
    );
  };
  
import SubmitOrderData from './data/submitOrder.json'
import CancelOrderData from './data/cancelOrder.json'
import cancelTransferOrderData from './data/cancelTransferOrder.json'
import disconnectAccount_V2Data from './data/disconnectAccount_V2.json'

let GraphDataMap = new Map();
GraphDataMap.set("submitOrder",SubmitOrderData)
GraphDataMap.set("cancelOrder", CancelOrderData)
GraphDataMap.set("cancelTransferOrder", cancelTransferOrderData)
GraphDataMap.set("disconnectAccount_V2", disconnectAccount_V2Data)


  function GraphFunction(props) {
    const [showA, setShowA] = useState(true);


    const toggleComponent = () => {
      setShowA(!showA);
    };
    const ExpandedGraph = () => {
      return (<ExpandableGraph graphData={GraphDataMap.get(props.GraphData)} fullGraph={"False"}/>)
    };
    const FullGraph = () => {
      return (<ExpandableGraph graphData={GraphDataMap.get(props.GraphData)} fullGraph={"True"}/>)
    };
    
    return (
      <div>
        
        {showA ?  <ExpandedGraph /> : <FullGraph />}
        <button onClick={toggleComponent}>
          {showA ? 'Expand All' : 'Collapse'}
        </button>
      </div>
    );
  }


  export default GraphFunction;