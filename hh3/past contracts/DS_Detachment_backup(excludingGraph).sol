// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "./SimpleSet.sol";
// import "./DirectedGraph.sol";

// /// @title DS_Detachment – A directed graph with detachment logic (no external library)
// contract DS_Detachment {
//     using DirectedGraph for DirectedGraph.Graph;
//     using SimpleSet for SimpleSet.Set;

//     uint public x;

//     event Detach(uint by);
//     event Detachment(uint256[] args);





//     // ----------------------------------------------------------------------------------------
//     // State Variables

//     SimpleSet.Set graphsIds;
//     mapping(uint256 => DirectedGraph.Graph) graphs;

//     // Agent-specific arguments (Set per address)
//     mapping(address => SimpleSet.Set) agentsArguments;

//     // ----------------------------------------------------------------------------------------
//     // Constructor

//     constructor() {
//         graphsIds.insert(bytes32(uint256(1))); // default graph
//     }

//     // ----------------------------------------------------------------------------------------
//     // Detachment Functions

//     function detach() public {
//         x++;
//         emit Detach(1);
//     }

//     function detachBy(uint by) public {
//         require(by > 0, "detachBy: detachment should be positive");
//         x += by;
//         emit Detach(by);
//     }

//     function dualScaleDetachment(uint256 by) public {
//         require(by > 0, "detachBy: detachment should be positive");
//         x += by * 2;
//         uint256[] memory args = new uint256[](1);
//         args[0] = by * 2;
//         emit Detachment(args);
//     }

//     // ----------------------------------------------------------------------------------------
//     // Argument & Graph Logic

//     function insertArgument(string memory metadata)
//         public
//         returns (uint256 argId)
//     {
//         DirectedGraph.Graph storage graph = graphs[1];
//         argId = graph.insertNode(metadata);

//         SimpleSet.Set storage agentArgs = agentsArguments[msg.sender];
//         agentArgs.insert(bytes32(argId));
//     }

//     function supportArgument(uint256 argId) public {
//         DirectedGraph.Graph storage graph = graphs[1];
//         graph.incrementValue(argId);

//         SimpleSet.Set storage agentArgs = agentsArguments[msg.sender];
//         agentArgs.insert(bytes32(argId));
//     }

//     function insertAttack(
//         uint256 sourceId,
//         uint256 targetId,
//         string memory metadata
//     ) public returns (uint256 edgeId) {
//         DirectedGraph.Graph storage graph = graphs[1];
//         edgeId = graph.insertEdge(sourceId, targetId, metadata);
//     }

//     function getGraph(uint256 graphId)
//         public
//         view
//         returns (
//             uint256[] memory nodes,
//             uint256[] memory edgesSource,
//             uint256[] memory edgesTarget
//         )
//     {
//         DirectedGraph.Graph storage graph = graphs[graphId];
//         uint256 nodesCount = graph.nodesIds.count();
//         uint256 edgesCount = graph.edgesIds.count();

//         nodes = new uint256[](nodesCount);
//         edgesSource = new uint256[](edgesCount);
//         edgesTarget = new uint256[](edgesCount);

//         for (uint256 i = 0; i < nodesCount; i++) {
//             nodes[i] = uint256(graph.nodesIds.keyAtIndex(i));
//         }

//         for (uint256 i = 0; i < edgesCount; i++) {
//             uint256 edgeId = uint256(graph.edgesIds.keyAtIndex(i));
//             DirectedGraph.Edge storage edge = graph.edges[edgeId];
//             edgesSource[i] = edge.source;
//             edgesTarget[i] = edge.target;
//         }
//     }
// }
