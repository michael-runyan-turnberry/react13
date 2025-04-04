import ForceGraph2D from "react-force-graph-2d";
import React, { useState, useMemo, useCallback } from 'react';
import './App.css'

const FullGraph = ({ graphData }) => {
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
     graphData={graphData}
     ref={handleGraphRef}
     linkDirectionalParticles={2}
     onNodeHover={handleNodeHover}
     backgroundColor="lightgray"
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
 )
 };

 function FullGraphFunction(props){
    return (
      <div>
      <FullGraph graphData={props.graphData} />
      <button onClick={props.toggleBool}>Expandable/Full</button>
      </div>
    )
  }

  export default FullGraphFunction