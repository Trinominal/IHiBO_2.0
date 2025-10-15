// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

// import "./DirectedGraph.sol";
// import "./EnumerableMap.sol";
import "./SimpleSet.sol";

contract DualScale {
    // using DirectedGraph for DirectedGraph.Graph;
    using SimpleSet for SimpleSet.Set;
    // using EMap for EMap.LabelMap;

    

    SimpleSet.Set graphsIds;
    mapping(uint256 => DirectedGraph.Graph) graphs;

    // Arguments Sets
    mapping(address => SimpleSet.Set) agentsArguments;

    uint256 labsNum;
    mapping(uint256 => EMap.LabelMap) labs;
    uint256 prefExtensionsNum;
    mapping(uint256 => SimpleSet.Set) prefExtensions;

    event Output(uint256[] args);

    constructor() public {
        graphsIds.insert(bytes32(uint256(1)));
    }

    function insertArgument(string memory metadata)
        public
        returns (uint256 argId)
    {
        DirectedGraph.Graph storage graph = graphs[1];
        argId = graph.insertNode(metadata);

        SimpleSet.Set storage agentArgs = agentsArguments[
            msg.sender
        ];
        agentArgs.insert(bytes32(argId));
    }

    function supportArgument(uint256 argId) public {
        DirectedGraph.Graph storage graph = graphs[1];
        graph.incrementValue(argId);

        SimpleSet.Set storage agentArgs = agentsArguments[
            msg.sender
        ];
        agentArgs.insert(bytes32(argId));
    }

    function insertAttack(
        uint256 sourceId,
        uint256 targetId,
        string memory metadata
    ) public returns (uint256 edgeId) {
        DirectedGraph.Graph storage graph = graphs[1];
        edgeId = graph.insertEdge(sourceId, targetId, metadata);
    }

    function pafReductionToAfPr1() public returns (uint256 graphId) {
        graphId = graphsIds.count() + 1;
        graphsIds.insert(bytes32(graphId));

        DirectedGraph.Graph storage paf = graphs[1];
        DirectedGraph.Graph storage af = graphs[graphId];

        for (uint256 j = 0; j < paf.nodesIds.count(); j++) {
            af.insertNodeWithId(j+1);
        }

        for (uint256 i = 0; i < paf.edgesIds.count(); i++) {
            uint256 edgeId = uint256(paf.edgesIds.keyAtIndex(i));
            DirectedGraph.Edge storage edge = paf.edges[edgeId];

            DirectedGraph.Node storage s = paf.nodes[edge.source];
            DirectedGraph.Node storage t = paf.nodes[edge.target];
            bool notBpreferredToA = !(t.value > s.value);
        
            if (notBpreferredToA) {
                //insert to af
                af.insertEdge(edge.source, edge.target, "");
            }

            // if (notBpreferredToA) { // [Vincent: all args should be ported over.
            //     //insert to af
            //     if (!af.nodesIds.exists(bytes32(edge.source))) {
            //         af.insertNodeWithId(edge.source);
            //     }
            //     if (!af.nodesIds.exists(bytes32(edge.target))) {
            //         af.insertNodeWithId(edge.target);
            //     }
            //     af.insertEdge(edge.source, edge.target, "");
            // }
        }
    }

    function getGraph(uint256 graphId)
        public
        view
        returns (
            uint256[] memory nodes,
            uint256[] memory edgesSource,
            uint256[] memory edgesTarget
        )
    {
        DirectedGraph.Graph storage graph = graphs[graphId];
        uint256 nodesCount = graph.nodesIds.count();
        uint256 edgesCount = graph.edgesIds.count();

        nodes = new uint256[](nodesCount);
        edgesSource = new uint256[](edgesCount);
        edgesTarget = new uint256[](edgesCount);

        for (uint256 i = 0; i < graph.nodesIds.count(); i++) {
            nodes[i] = uint256(graph.nodesIds.keyAtIndex(i));
        }

        for (uint256 i = 0; i < graph.edgesIds.count(); i++) {
            uint256 edgeId = uint256(graph.edgesIds.keyAtIndex(i));
            DirectedGraph.Edge storage edge = graph.edges[edgeId];
            edgesSource[i] = edge.source;
            edgesTarget[i] = edge.target;
        }
    }

    function enumeratingPreferredExtensions(uint256 graphId)
        public
        returns (uint256[] memory args)
    {
        DirectedGraph.Graph storage graph = graphs[graphId];
        SimpleSet.Set storage ext = prefExtensions[
            prefExtensionsNum
        ];
        EMap.LabelMap storage lab = labs[labsNum];
        for (uint256 i = 0; i < graph.nodesIds.count(); i++) {
            lab.set(uint256(graph.nodesIds.keyAtIndex(i)), EMap.Label.BLANK);
        }
        _findPreferredExtensions(labsNum++, prefExtensionsNum++, graphId);

        args = new uint256[](ext.count());
        for (uint256 i = 0; i < ext.count(); i++) {
            args[i] = uint256(ext.keyAtIndex(i));
        }

        emit Output(args);
    }


}
