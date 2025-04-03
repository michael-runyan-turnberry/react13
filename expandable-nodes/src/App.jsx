import React, { useState, useMemo, useCallback } from 'react';
import './App.css'
import ForceGraph3D from 'react-force-graph-3d';
import ForceGraph2D from "react-force-graph-2d";
import myData from './submitOrder.json'
import FullGraphFunction from './components/FullGraphFunction';

function genRandomTree(N = 300, reverse = false) {
 
  const node_graph = {nodes: [...Array(N).keys()].map(i => ({ id: i })),
  links: [...Array(N).keys()]
.filter(id => id)
.map(id => ({
  [reverse ? 'target' : 'source']: id,
  [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
}))}
console.log(node_graph)
  return node_graph;
}

// const GraphData = {
//   nodes: [
//     { id: "0",
//       name: "getBillerIdBySoloId",
//       val: 5,
//       success: "98",
//       rec_count: "78090",
//       exec_time: "234"
//      }, // Root node
//     {
//       id: "1",
//       isClusterNode: true,
//       name: "CancelOrder",
//       val: 5
//     },
//     {
//       id: "2",
//       name: "cancelOrderForExistingCustomer",
//       val: 5
//     },
//     {
//       id: "3",
//       name: "getEnterpriseErrorCodesByBillerCode",
//       val: 5
//     },
//     {
//       id: "4",
//       isClusterNode: true,
//       name: "getOperatorAndSalesId",
//       val: 5
//     },

//   ],
//   links: [
//     { source: "0", target: "1" },
//     { source: "0", target: "4" },
//     { source: "1", target: "2" },
//     { source: "1", target: "3" },
//   ]
// };

const GraphData = myData


const ExpandableGraph = ({ graphData }) => {
  const rootId = 0;
  
  const nodesById = useMemo(() => {
    const nodesById = Object.fromEntries(graphData.nodes.map(node => [node.id, node]));

    // link parent/children
    graphData.nodes.forEach(node => {
      node.collapsed = node.id !== rootId;
      node.childLinks = [];
    });
    graphData.links.forEach(link => nodesById[link.source].childLinks.push(link));
    return nodesById;
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
        <p>Transaction Count: {hoveredNode.rec_count} (15min avg)</p>
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

  return (
  <div style={{ position: 'relative' }}>
  <ForceGraph2D
    graphData={prunedTree}
    ref={handleGraphRef}
    linkDirectionalParticles={2}
    backgroundColor="lightgray"
    nodeColor={node => !node.childLinks.length ? 'green' : node.collapsed ? 'red' : 'yellow'}
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



function App() {
  const [myBool, setmyBool] = useState(true);

  function toggleBool() {
    setmyBool(!myBool)
  }

  return (
    myBool ? <ExpandableGraphFunction toggleBool={toggleBool} /> : <FullGraphFunction toggleBool={toggleBool} graphData={GraphData} /> 
  );
}

function ExpandableGraphFunction(props){
  return (
    <div>
      <ExpandableGraph graphData={GraphData} />
      <button onClick={props.toggleBool}>Expandable/Full</button>
      <p>Blue Indicates terminal node, Red expandable node, Tan expanded node</p>
    </div>
  )
}



export default App
