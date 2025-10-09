
//   // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "./SimpleSet.sol";
// // import "./DirectedGraph.sol";

// /// @title DS_Detachment – A directed graph with detachment logic (no external library)
// contract DS_Detachment {
//     // using DirectedGraph for DirectedGraph.Graph;
//     using SimpleSet for SimpleSet.Set;

//     uint public x;

//     event Detach(uint by);
//     event Detachment(uint256[] args);


//     struct Node {
//         SimpleSet.Set edgesIn;
//         SimpleSet.Set edgesOut;
//         uint256 value;
//         string metadata;
//     }

//     struct Edge {
//         uint256 source;
//         uint256 target;
//         uint256 justifyingWeight; // contribution toward permissibility
//         uint256 requiringWeight;  // contribution toward obligation
//         string metadata;
//     }

//     struct Graph {
//         SimpleSet.Set nodesIds;
//         mapping(uint256 => Node) nodes;
//         SimpleSet.Set edgesIds;
//         mapping(uint256 => Edge) edges;
//     }


//     // ----------------------------------------------------------------------------------------
//     // Directed Graph Logic

//     function insertNode(Graph storage g, string memory metadata)
//         internal
//         returns (uint256 nodeId)
//     {
//         nodeId = g.nodesIds.count() + 1;
//         g.nodesIds.insert(bytes32(nodeId));

//         Node storage node = g.nodes[nodeId];
//         node.metadata = metadata;
//         node.value++;
//     }
	
//     // Node added and checked that another node with the same id is not in the graph yet the content is however not regarded. If the argument expresses 												the same idea ^^ then the argument should already be considered part of the graph.
//     function insertNodeWithId(Graph storage g, uint256 nodeId) internal {
//         require(!g.nodesIds.exists(bytes32(nodeId)), "Node already exists.");
//         g.nodesIds.insert(bytes32(nodeId));
//     }

//     function incrementValue(Graph storage g, uint256 nodeId) internal {
//         require(g.nodesIds.exists(bytes32(nodeId)), "Unknown nodeId.");
//         Node storage node = g.nodes[nodeId];
//         node.value++;
//     }

//     function insertEdge(
//         Graph storage g,
//         uint256 sourceId,
//         uint256 targetId,
//         uint256 jw,
//         uint256 rw,
//         string memory metadata
//     ) internal returns (uint256 edgeId) {
//         require(g.nodesIds.exists(bytes32(sourceId)), "Unknown sourceId.");
//         require(g.nodesIds.exists(bytes32(targetId)), "Unknown targetId.");

//         edgeId = cantorPairing(sourceId, targetId);
//         g.edgesIds.insert(bytes32(edgeId));

//         Edge storage edge = g.edges[edgeId];
//         edge.source = sourceId;
//         edge.target = targetId;
//         edge.justifyingWeight = jw;
//         edge.requiringWeight = rw;
//         edge.metadata = metadata;

//         g.nodes[sourceId].edgesOut.insert(bytes32(edgeId));
//         g.nodes[targetId].edgesIn.insert(bytes32(edgeId));
//     }


//     // works only for a and b between 0 to 2^16 -1, TODO
//     function cantorPairing(uint256 a, uint256 b)
//         internal
//         pure
//         returns (uint256)
//     {
//         return ((a + b) * (a + b + 1)) / 2 + a;
//     }



//     // ----------------------------------------------------------------------------------------
//     // State Variables

//     SimpleSet.Set graphsIds;
//     mapping(uint256 => Graph) graphs;

//     // Agent-specific arguments (Set per address)
//     mapping(address => SimpleSet.Set) agentsArguments;

//     // ----------------------------------------------------------------------------------------
//     // Constructor

//     constructor() {
//         graphsIds.insert(bytes32(uint256(1))); // default graph
//     }

//     // ----------------------------------------------------------------------------------------
//     // Detachment Functions

//     enum ScaleValue { NEG, ZERO, POS }


//     function detach() public {
//         x++;
//         emit Detach(1);
//     }

//     function detachBy(uint by) public {
//         require(by > 0, "detachBy: detachment should be positive");
//         x += by;
//         emit Detach(by);
//     }

//     function dualScaleDetachment(
//         Graph storage g,
//         uint256 o1,
//         uint256 o2
//     ) internal view returns (ScaleValue v1, ScaleValue v2) {
//         uint256 sumJW_o1 = 0;
//         uint256 sumRW_o1 = 0;
//         uint256 sumJW_o2 = 0;
//         uint256 sumRW_o2 = 0;

//         // collect reasons for o1
//         for (uint256 i = 0; i < g.nodes[o1].edgesIn.count(); i++) {
//             Edge storage e = g.edges[uint256(g.nodes[o1].edgesIn.keyAtIndex(i))];
//             sumJW_o1 += e.justifyingWeight;
//             sumRW_o1 += e.requiringWeight;
//         }
//         // collect reasons for o2
//         for (uint256 i = 0; i < g.nodes[o2].edgesIn.count(); i++) {
//             Edge storage e = g.edges[uint256(g.nodes[o2].edgesIn.keyAtIndex(i))];
//             sumJW_o2 += e.justifyingWeight;
//             sumRW_o2 += e.requiringWeight;
//         }

//         // Permission scale: jw(o1) vs rw(o2)
//         if (sumJW_o1 > sumRW_o2) v1 = ScaleValue.POS;
//         else if (sumJW_o1 < sumRW_o2) v1 = ScaleValue.NEG;
//         else v1 = ScaleValue.ZERO;

//         // Commitment scale: jw(o2) vs rw(o1)
//         if (sumJW_o2 > sumRW_o1) v2 = ScaleValue.POS;
//         else if (sumJW_o2 < sumRW_o1) v2 = ScaleValue.NEG;
//         else v2 = ScaleValue.ZERO;
//     }


//     // ----------------------------------------------------------------------------------------
//     // Argument & Graph Logic

//     function insertArgument(string memory metadata)
//         public
//         returns (uint256 argId)
//     {
//         Graph storage graph = graphs[1];
//         argId = insertNode(graph, metadata);

//         SimpleSet.Set storage agentArgs = agentsArguments[msg.sender];
//         agentArgs.insert(bytes32(argId));
//     }

//     function supportArgument(uint256 argId) public {
//         Graph storage graph = graphs[1];
//         incrementValue(graph, argId);

//         SimpleSet.Set storage agentArgs = agentsArguments[msg.sender];
//         agentArgs.insert(bytes32(argId));
//     }

//     function insertAttack(
//         uint256 sourceId,
//         uint256 targetId,
//         string memory metadata
//     ) public returns (uint256 edgeId) {
//         Graph storage graph = graphs[1];
//         edgeId = insertEdge(graph, sourceId, targetId, 1, 1, metadata);
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
//         Graph storage graph = graphs[graphId];
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
//             Edge storage edge = graph.edges[edgeId];
//             edgesSource[i] = edge.source;
//             edgesTarget[i] = edge.target;
//         }
//     }
// }
