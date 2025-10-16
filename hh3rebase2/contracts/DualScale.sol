// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

// import "./DirectedGraph.sol";
// import "./EnumerableMap.sol";
import "./SimpleSet.sol";

contract DualScale {
    // using DirectedGraph for DirectedGraph.Graph;
    using SimpleSet for SimpleSet.Set;
    // using EMap for EMap.LabelMap;

    struct Reason {
        string ground;
        string option;
    }

    struct Weight {
        uint justifying;
        uint requiring;
    }

    // Aggregated weights: key = keccak(reasonId, option1, option2, contextId) 
    // not sure if contextId is necessary, but it might be useful for future extensions
    // we can use it as agentID since they each have their own context.
    mapping(bytes32 => Weight) private weightingFunction;

    SimpleSet.Set reasonIDs;
    mapping(uint256 => Reason) reasons; // reasonId = keccak(ground, option

    SimpleSet.Set optionIDs;
    mapping(uint256 => string) options;

    SimpleSet.Set agents; // each graph is a context
    mapping(address => uint) private agentIDs; // agentID is a contextID; each agent has their own context

    event Output(int256[] args);

    constructor() public {
        optionIDs.insert(bytes32(uint256(1)));
        options[1] = 'do Nothing';
    }

    // get justifying and requiring weights for a given reason, option1, option2, and agent
    // TODO test if function works as intended
    function getAgentReasonWeight(
        uint256 memory reason,
        string memory option1,
        string memory option2,
        address agent
    ) public view returns (uint justifying, uint requiring) {
        require(reasonIDs.exists(bytes32(reason)), "Reason does not exist");
        require(optionIDs.exists(keccak256(abi.encodePacked(option1))), "Option1 does not exist");
        require(optionIDs.exists(keccak256(abi.encodePacked(option2))), "Option2 does not exist");
        require(agents.exists(keccak256(abi.encodePacked(agent))), "Agent does not exist");

        uint contextId = agentIDs[agent];
        bytes32 key = keccak256(abi.encodePacked(reason, option1, option2, contextId));

        Weight storage weight = weightingFunction[key];
        justifying = weight.justifying;
        requiring = weight.requiring;
    }

    // get all the weights for a given agent in a given comparison of option1 and option2
    // TODO 
    function getAgentWeights(
        string memory option1,
        string memory option2,
        address agent
    ) public view returns (uint justifying, uint requiring) {
        require(optionIDs.exists(keccak256(abi.encodePacked(option1))), "Option1 does not exist");
        require(optionIDs.exists(keccak256(abi.encodePacked(option2))), "Option2 does not exist");
        require(agents.exists(keccak256(abi.encodePacked(agent))), "Agent does not exist");

        uint contextId = agentIDs[agent];
        justifying = 0;
        requiring = 0;

        // iterate through all reasons
        // this is inefficient, but we don't have a list of reasons stored anywhere.
        // in practice, we would need to store a list of reasons to make this efficient.
        // or we can use events to log reasons and then process them off-chain.
        for (uint256 j = 0; j < 1000; j++) { // arbitrary limit to avoid infinite loop
            bytes32 reasonId = bytes32(j);
            bytes32 key = keccak256(abi.encodePacked(reasonId, option1, option2, contextId));
            Weight storage weight = weightingFunction[key];
            justifying += weight.justifying;
            requiring += weight.requiring;
        }
    }

    // get the aggregated weights for each reason in a given comparison of option1 and option2
    // TODO 
    function getAggregatedWeights(
        string memory option1,
        string memory option2
    ) public view returns (uint justifying, uint requiring) {
        require(optionIDs.exists(keccak256(abi.encodePacked(option1))), "Option1 does not exist");
        require(optionIDs.exists(keccak256(abi.encodePacked(option2))), "Option2 does not exist");

        justifying = 0;
        requiring = 0;

        // iterate through all reasons
        // this is inefficient, but we don't have a list of reasons stored anywhere.
        // in practice, we would need to store a list of reasons to make this efficient.
        // or we can use events to log reasons and then process them off-chain.
        for (uint256 j = 0; j < 1000; j++) { // arbitrary limit to avoid infinite loop
            bytes32 reasonId = bytes32(j);
            bytes32 key = keccak256(abi.encodePacked(reasonId, option1, option2));
            Weight storage weight = weightingFunction[key];
            justifying += weight.justifying;
            requiring += weight.requiring;
        }
    }

    // record the vote on a reason by an agent
    // TODO
    function voteOnReason(
        string memory ground,
        string memory option1,
        string memory option2,
        uint memory justifying,
        uint memory requiring
    ) public {
        require(optionIDs.exists(keccak256(abi.encodePacked(option))), "Option does not exist");

        if (!agents.exists(keccak256(abi.encodePacked(msg.sender)))) {
            agents.insert(keccak256(abi.encodePacked(msg.sender)));
            agentIDs[msg.sender] = agents.count(); // assign a new contextID to the new agent
        }
        uint contextId = agentIDs[msg.sender];

        bytes32 reasonId = keccak256(abi.encodePacked(ground));
        bytes32 key = keccak256(abi.encodePacked(reasonId, option, contextId));

        Weight storage weight = weightingFunction[key];
        if (weight.justifying == 0 && weight.requiring == 0) {
            // new entry
            if (compareStrings(polarity, "justifying")) {
                weight.justifying = 1;
                weight.requiring = 0;
            } else if (compareStrings(polarity, "requiring")) {
                weight.justifying = 0;
                weight.requiring = 1;
            }
        } else {
            // existing entry
            if (compareStrings(polarity, "justifying")) {
                weight.justifying += 1;
            } else if (compareStrings(polarity, "requiring")) {
                weight.requiring += 1;
            }
        }
    }

    // compare two options and return the deontic status based on the aggregated weights
    // TODO
    function BalanceScale(string memory option1, string memory option2)
        public
        view
        returns (int256 permissionScaleBalance, int256 requirementScaleBalance)
    {
        require(optionIDs.exists(keccak256(abi.encodePacked(option1))), "Option1 does not exist");
        require(optionIDs.exists(keccak256(abi.encodePacked(option2))), "Option2 does not exist");

        permissionScaleBalance = 0;
        requirementScaleBalance = 0;
        for (uint256 i = 0; i < agents.count(); i++) {
            uint contextId = i + 1; // contextID starts from 1
            // iterate through all reasons

            for (uint256 j = 0; j < reasons.count(); j++) { // arbitrary limit to avoid infinite loop
                uint readsonID = j + 1; // reasonID starts from 1
                bytes32 key1 = keccak256(abi.encodePacked(reasonID, option1, option2, contextId));

                Weight storage weight = weightingFunction[key1];

                permissionScaleBalance += int256(weight.justifying);
                requirementScaleBalance -= int256(weight.requiring);
            }
        }
        permissionScaleBalance = sgn(permissionScaleBalance);
        requirementScaleBalance = sgn(requirementScaleBalance);
    }

    // dynamically scale all options and return the non-dominated options
    // TODO
    function dynamicScale()
        public
        returns (int256[] memory args)
    {
        // This function compares all options pairwise and then determines which options never "loose"
        uint256 optionsCount = optionIDs.count();

        uint256[] memory args = new uint256[](optionsCount);
        for (uint256 i = 0; i < optionsCount; i++) {
            for (uint256 j = 0; j < optionsCount; j++) {
                if (i != j) {
                    (int256 p, int256 r) = BalanceScale(
                        options[uint256(optionIDs.keyAtIndex(i))],
                        options[uint256(optionIDs.keyAtIndex(j))]
                    );
                    // if option i is dominated by option j, we can mark it as dominated
                    if (p < 0) {
                        args[i] = -1; // dominated
                        break;
                    } else if (args[i] != -1) {
                        args[i] = uint256(optionIDs.keyAtIndex(i)); // non-dominated
                    }
                    if (r < 0) {
                        args[j] = -1; // dominated
                        break;
                    } else if (args[j] != -1) {
                        args[j] = uint256(optionIDs.keyAtIndex(j)); // non-dominated
                    }
                }
            }
        }

        emit Output(args);
    }

    // function insertArgument(string memory metadata)
    //     public
    //     returns (uint256 argId)
    // {
    //     DirectedGraph.Graph storage graph = graphs[1];
    //     argId = graph.insertNode(metadata);

    //     SimpleSet.Set storage agentArgs = agentsArguments[
    //         msg.sender
    //     ];
    //     agentArgs.insert(bytes32(argId));
    // }

    // function supportArgument(uint256 argId) public {
    //     DirectedGraph.Graph storage graph = graphs[1];
    //     graph.incrementValue(argId);

    //     SimpleSet.Set storage agentArgs = agentsArguments[
    //         msg.sender
    //     ];
    //     agentArgs.insert(bytes32(argId));
    // }

    // function insertAttack(
    //     uint256 sourceId,
    //     uint256 targetId,
    //     string memory metadata
    // ) public returns (uint256 edgeId) {
    //     DirectedGraph.Graph storage graph = graphs[1];
    //     edgeId = graph.insertEdge(sourceId, targetId, metadata);
    // }

    // function pafReductionToAfPr1() public returns (uint256 graphId) {
    //     graphId = graphsIds.count() + 1;
    //     graphsIds.insert(bytes32(graphId));

    //     DirectedGraph.Graph storage paf = graphs[1];
    //     DirectedGraph.Graph storage af = graphs[graphId];

    //     for (uint256 j = 0; j < paf.nodesIds.count(); j++) {
    //         af.insertNodeWithId(j+1);
    //     }

    //     for (uint256 i = 0; i < paf.edgesIds.count(); i++) {
    //         uint256 edgeId = uint256(paf.edgesIds.keyAtIndex(i));
    //         DirectedGraph.Edge storage edge = paf.edges[edgeId];

    //         DirectedGraph.Node storage s = paf.nodes[edge.source];
    //         DirectedGraph.Node storage t = paf.nodes[edge.target];
    //         bool notBpreferredToA = !(t.value > s.value);
        
    //         if (notBpreferredToA) {
    //             //insert to af
    //             af.insertEdge(edge.source, edge.target, "");
    //         }

    //         // if (notBpreferredToA) { // [Vincent: all args should be ported over.
    //         //     //insert to af
    //         //     if (!af.nodesIds.exists(bytes32(edge.source))) {
    //         //         af.insertNodeWithId(edge.source);
    //         //     }
    //         //     if (!af.nodesIds.exists(bytes32(edge.target))) {
    //         //         af.insertNodeWithId(edge.target);
    //         //     }
    //         //     af.insertEdge(edge.source, edge.target, "");
    //         // }
    //     }
    // }



    // function getGraph(uint256 graphId)
    //     public
    //     view
    //     returns (
    //         uint256[] memory nodes,
    //         uint256[] memory edgesSource,
    //         uint256[] memory edgesTarget
    //     )
    // {
    //     DirectedGraph.Graph storage graph = graphs[graphId];
    //     uint256 nodesCount = graph.nodesIds.count();
    //     uint256 edgesCount = graph.edgesIds.count();

    //     nodes = new uint256[](nodesCount);
    //     edgesSource = new uint256[](edgesCount);
    //     edgesTarget = new uint256[](edgesCount);

    //     for (uint256 i = 0; i < graph.nodesIds.count(); i++) {
    //         nodes[i] = uint256(graph.nodesIds.keyAtIndex(i));
    //     }

    //     for (uint256 i = 0; i < graph.edgesIds.count(); i++) {
    //         uint256 edgeId = uint256(graph.edgesIds.keyAtIndex(i));
    //         DirectedGraph.Edge storage edge = graph.edges[edgeId];
    //         edgesSource[i] = edge.source;
    //         edgesTarget[i] = edge.target;
    //     }
    // }

    // function enumeratingPreferredExtensions(uint256 graphId)
    //     public
    //     returns (uint256[] memory args)
    // {
    //     DirectedGraph.Graph storage graph = graphs[graphId];
    //     SimpleSet.Set storage ext = prefExtensions[
    //         prefExtensionsNum
    //     ];
    //     EMap.LabelMap storage lab = labs[labsNum];
    //     for (uint256 i = 0; i < graph.nodesIds.count(); i++) {
    //         lab.set(uint256(graph.nodesIds.keyAtIndex(i)), EMap.Label.BLANK);
    //     }
    //     _findPreferredExtensions(labsNum++, prefExtensionsNum++, graphId);

    //     args = new uint256[](ext.count());
    //     for (uint256 i = 0; i < ext.count(); i++) {
    //         args[i] = uint256(ext.keyAtIndex(i));
    //     }

    //     emit Output(args);
    // }


}
