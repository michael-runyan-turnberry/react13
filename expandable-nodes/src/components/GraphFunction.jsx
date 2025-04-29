import ForceGraph2D from "react-force-graph-2d";
import React, { useState, useMemo, useCallback } from 'react';
import './Component.css'
import TimeSelectDropDown from './DropDownTimeSelect'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DropDown from './DropDown'
import TransactionInputs from './TransactionInput'
import Table from './Table'


const ExpandableGraph = ({ graphData,fullGraph,timeSelect }) => {
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

    let success;
    let rec_count;
    let exec_time;

    //Selecting which stats to display
    switch(timeSelect) {
      case '15':
      success = hoveredNode.success15
      rec_count = hoveredNode.rec_count15
      exec_time = hoveredNode.exec_time15
      break;
      case '60':
      success =hoveredNode.success60
      rec_count = hoveredNode.rec_count60
      exec_time = hoveredNode.exec_time60
      break;
      case '1440' :
      success =hoveredNode.success1440
      rec_count = hoveredNode.rec_count1440
      exec_time = hoveredNode.exec_time1440
      break;
      default:
        success = 'N/A'
    }
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
          <p style={{textAlign: "center"}}>{hoveredNode.name}</p>
          <p style={{textAlign: "center"}}>Success Rate: {success}% </p>
          <p style={{textAlign: "center"}}>Call Count: {rec_count} </p>
          <p style={{textAlign: "center"}}>Avg Exec Time: {exec_time} ms</p>
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
      // link parent/children
      graphData.nodes.forEach(node => {
        node.collapsed = node.id !== rootId;
        node.childLinks = [];
      });
      graphData.links.forEach((link) => nodesByIdLocal[link.source]?.childLinks.push(link));
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



    // // Show list of dependant services
    // function get_children(node) {
    //   const result = [];

    //   function traverse(node) {
    //     if (node.childLinks.length !== 0){
    //       for (let key in node.childLinks){
    //         let child = node.childLinks[key]
    //         result.push(child.target.name)
    //         traverse(child.target)
    //       }
    //     }


    //       }
    //   traverse(node);
    //   return result;
    // }
    const [list, setList] = useState()

    function get_upstream(search_node_name,nodes){
      const result = []
      //let count = 0;
      let found = false;
      function search_node(search_node_name,node){


        // if (node.childLinks.length === 0){
        //   for (let i = 0; i < count; i++) {
        //     console.log(result)
        //     result.pop();
        //    }
        //   count = 0
        // }
        for (let key in node.childLinks){
          let child = node.childLinks[key]
          if (child.target.name === search_node_name){
            result.push(child.source.name)
            found = true;
            return result
          } else {
            search_node(search_node_name,child.target)
            if (found === true){
              result.push(child.source.name)
              return};
            //count += 1

          }

        }
      }
      search_node(search_node_name,nodes[0]);
      const uniqueResult = [...new Set(result)]
      return uniqueResult;
    }

    const handleNodeClickExpanded = useCallback(node => {
        setList(get_upstream(node.name,graphData.nodes))

    }, []);




    if (fullGraph == "True") {
      return (

          <div style={{ display: 'flex',width:'100vw' }}>
            <div style={{ position: 'relative', width:'85vw'}}>
            <ForceGraph2D
              height={570}
              graphData={graphData}
              ref={handleGraphRef}
              linkDirectionalParticles={2}
              backgroundColor='linear-gradient(to right, #A0AEC0, #CBD5E0)'
              nodeColor={node => timeSelect === "15" ? node.node_color15 : timeSelect === "60" ? node.node_color60 : timeSelect === "1440" ? node.node_color1440 : 'grey'}
              onNodeClick={handleNodeClickExpanded}
              onNodeHover={handleNodeHover}
              nodeCanvasObjectMode={() => "after"}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `bold ${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                if (node.isClusterNode) {
                  ctx.fillText(label, node.x, node.y);
                } else {
                  ctx.fillText(label, node.x + 20, node.y);
                }
              }}

            />
            {renderTooltip()}
            </div>
        <div style={{zIndex: '1', maxHeight: '70px',width:'15vw'}}><Table dependantServices={list}/></div>

        </div>


        );
    }

    return (
    <div style={{ position: 'relative' }}>
    <ForceGraph2D
      height={570}
      graphData={prunedTree}
      ref={handleGraphRef}
      linkDirectionalParticles={2}
      backgroundColor= 'linear-gradient(to right, #A0AEC0, #CBD5E0)'
      nodeColor={node => timeSelect === "15" ? node.node_color15 : timeSelect === "60" ? node.node_color60 : timeSelect === "1440" ? node.node_color1440 : 'grey'}
      onNodeClick={handleNodeClick}
      onNodeHover={handleNodeHover}
      nodeCanvasObjectMode={() => "after"}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        ctx.font = `bold ${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
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
// After demo, need to pull in Transaction data with a fetch call to nifi


import SubmitOrder_V2Data from './data/SubmitOrder_V2.json'
import cancelOrderCOS_V2Data from './data/cancelOrderCOS_V2.json'
// import cancelTransferOrderData from './data/cancelTransferOrder.json'
import disconnectAccount_V2Data from './data/disconnectAccount_V2.json'
import submitTCSROOrder_V2Data from './data/submitTCSROOrder_V2.json'
import updateScheduleWindow_V2Data from './data/updateScheduleWindow_V2.json'
import TransactionData from './data/32df37ae-dfa4-3130-82c9-6158fdd2880f.json'
import TransactionData1 from './data/f07c1eef-8f97-30a0-9b19-0303f8cef757.json'
import TransactionData2 from './data/b922d469-28ea-3438-8ce8-ab9e64ed7861.json'


let GraphDataMap = new Map();
GraphDataMap.set("SubmitOrder_V2",SubmitOrder_V2Data)
GraphDataMap.set("cancelOrderCOS_V2", cancelOrderCOS_V2Data)
// GraphDataMap.set("cancelTransferOrder", cancelTransferOrderData)
GraphDataMap.set("disconnectAccount_V2", disconnectAccount_V2Data)
GraphDataMap.set("submitTCSROOrder_V2", submitTCSROOrder_V2Data)
GraphDataMap.set("updateScheduleWindow_V2", updateScheduleWindow_V2Data)
GraphDataMap.set("32df37ae-dfa4-3130-82c9-6158fdd2880f", TransactionData)
GraphDataMap.set("f07c1eef-8f97-30a0-9b19-0303f8cef757", TransactionData1)
GraphDataMap.set("b922d469-28ea-3438-8ce8-ab9e64ed7861", TransactionData2)

  function GraphFunction() {
    const [showA, setShowA] = useState(true);

    const [serviceName, setServiceName] = useState('cancelOrderCOS_V2');
    const updateServiceName = (newMessage) => {
      console.log(newMessage)
      setServiceName(newMessage);
      };

    const [transactionId, setTransactionId] = useState('Enter Transaction Id');
    const updateTransactionid = (newTransactionId) => {
      setTransactionId(newTransactionId);
      if (newTransactionId === '32df37ae-dfa4-3130-82c9-6158fdd2880f'){setServiceName("32df37ae-dfa4-3130-82c9-6158fdd2880f");}
      if (newTransactionId === 'f07c1eef-8f97-30a0-9b19-0303f8cef757'){setServiceName("f07c1eef-8f97-30a0-9b19-0303f8cef757");}
      if (newTransactionId === 'b922d469-28ea-3438-8ce8-ab9e64ed7861'){setServiceName("b922d469-28ea-3438-8ce8-ab9e64ed7861");}
    };

    const [timeSelect, setTimeSelect] = useState('15');
    const updateTimeSelect = (newTime) => {
        setTimeSelect(newTime);
      };
    const toggleComponent = () => {
      setShowA(!showA);
    };
    const ExpandedGraph = () => {
      return (<ExpandableGraph graphData={JSON.parse(JSON.stringify(GraphDataMap.get(serviceName)))} fullGraph={"False"} timeSelect={timeSelect}/>)
    };
    const FullGraph = () => {
      return (<ExpandableGraph graphData={JSON.parse(JSON.stringify(GraphDataMap.get(serviceName)))} fullGraph={"True"} timeSelect={timeSelect}/>)
    };

    return (
      <div>
        {showA ?  <ExpandedGraph />: <FullGraph />}
        <h1 style={{textAlign: "center"}}>{serviceName}</h1>

        <p></p>
        <div style={{ display: 'flex', gap: '16px',justifyContent: 'center' }}>
        <button onClick={toggleComponent}> {showA ? 'Expand All' : 'Collapse'}</button>
        <DropDown updateMessage={updateServiceName} />
        <TimeSelectDropDown updateTime={updateTimeSelect}/>
        <TransactionInputs setTransactionId={updateTransactionid} />
        </div>


      </div>
    );
  }


  export default GraphFunction;