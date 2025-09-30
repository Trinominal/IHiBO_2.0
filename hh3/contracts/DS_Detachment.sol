// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SimpleSet.sol";

/// @title DS_Detachment – Portfolio Manager Decision System
/// @notice Managers vote on weights, system determines permitted options via dynamic scale
contract DS_Detachment {
    using SimpleSet for SimpleSet.Set;

    // --------------------------
    // Events
    // --------------------------
    event ManagerWeightVote(address indexed manager, uint256 edgeId, uint256 o1, uint256 o2, uint256 contextId, uint256 jw, uint256 rw);
    event OptionAdded(uint256 optionId, string metadata);
    event ReasonAdded(uint256 reasonId, string metadata);
    event EdgeAdded(uint256 edgeId, uint256 reasonId, uint256 optionId, string metadata);
    event DynamicScaleResult(uint256[] permittedOptions, uint256[] unpermittedOptions);

    // --------------------------
    // Core structures
    // --------------------------
    struct Node {
        string metadata;
        bool isOption;      // true if this is a portfolio option, false if it's a reason
        SimpleSet.Set incomingEdges;
        SimpleSet.Set outgoingEdges;
    }

    struct Edge {
        uint256 reasonId;   // source (always a reason)
        uint256 optionId;   // target (always an option)
        string metadata;    // description of why this reason applies to this option
    }

    struct ManagerVote {
        uint256 jw;         // justifying weight
        uint256 rw;         // requiring weight
        bool hasVoted;
    }

    struct AggregatedWeight {
        uint256 totalJW;    // sum of all manager JW votes
        uint256 totalRW;    // sum of all manager RW votes
        uint256 voteCount;  // number of managers who voted
        mapping(address => ManagerVote) managerVotes;
    }

    enum ScaleValue { NEG, ZERO, POS }

    struct DualResult {
        ScaleValue permission;   // compare jw(o1) vs rw(o2)
        ScaleValue commitment;   // compare jw(o2) vs rw(o1)
        uint256 jw_o1;
        uint256 rw_o1;
        uint256 jw_o2;
        uint256 rw_o2;
    }

    // --------------------------
    // State
    // --------------------------
    SimpleSet.Set private nodeIds;
    mapping(uint256 => Node) private nodes;
    
    SimpleSet.Set private edgeIds;
    mapping(uint256 => Edge) private edges;
    
    // Aggregated weights: key = keccak(edgeId, o1, o2, contextId)
    mapping(bytes32 => AggregatedWeight) private weights;
    
    // Registered portfolio managers
    SimpleSet.Set private managers;
    
    uint256 private nextNodeId = 1;
    uint256 private nextEdgeId = 1;

    // --------------------------
    // Manager registration
    // --------------------------
    modifier onlyManager() {
        require(managers.exists(bytes32(uint256(uint160(msg.sender)))), "Only registered managers can vote");
        _;
    }

    function registerManager(address manager) external {
        managers.insert(bytes32(uint256(uint160(manager))));
    }

    function isRegisteredManager(address manager) external view returns (bool) {
        return managers.exists(bytes32(uint256(uint160(manager))));
    }

    // --------------------------
    // Portfolio options and reasons
    // --------------------------
    function addOption(string memory metadata) external returns (uint256 optionId) {
        optionId = nextNodeId++;
        nodeIds.insert(bytes32(optionId));
        Node storage node = nodes[optionId];
        node.metadata = metadata;
        node.isOption = true;
        emit OptionAdded(optionId, metadata);
        return optionId;
    }

    function addReason(string memory metadata) external returns (uint256 reasonId) {
        reasonId = nextNodeId++;
        nodeIds.insert(bytes32(reasonId));
        Node storage node = nodes[reasonId];
        node.metadata = metadata;
        node.isOption = false;
        emit ReasonAdded(reasonId, metadata);
        return reasonId;
    }

    function connectReasonToOption(
        uint256 reasonId, 
        uint256 optionId, 
        string memory metadata
    ) external returns (uint256 edgeId) {
        require(nodeIds.exists(bytes32(reasonId)), "Reason does not exist");
        require(nodeIds.exists(bytes32(optionId)), "Option does not exist");
        require(!nodes[reasonId].isOption, "Source must be a reason");
        require(nodes[optionId].isOption, "Target must be an option");

        edgeId = nextEdgeId++;
        edgeIds.insert(bytes32(edgeId));
        
        Edge storage edge = edges[edgeId];
        edge.reasonId = reasonId;
        edge.optionId = optionId;
        edge.metadata = metadata;

        nodes[reasonId].outgoingEdges.insert(bytes32(edgeId));
        nodes[optionId].incomingEdges.insert(bytes32(edgeId));

        emit EdgeAdded(edgeId, reasonId, optionId, metadata);
        return edgeId;
    }

    // --------------------------
    // Manager voting on weights
    // --------------------------
    function _weightKey(uint256 edgeId, uint256 o1, uint256 o2, uint256 contextId) 
        internal pure returns (bytes32) 
    {
        return keccak256(abi.encodePacked(edgeId, o1, o2, contextId));
    }

    function voteWeight(
        uint256 edgeId,
        uint256 o1,
        uint256 o2,
        uint256 contextId,
        uint256 jw,
        uint256 rw
    ) external onlyManager {
        require(edgeIds.exists(bytes32(edgeId)), "Edge does not exist");
        require(nodes[o1].isOption, "o1 must be an option");
        require(nodes[o2].isOption, "o2 must be an option");
        // todo: consider validating that edgeId connects to o1 or o2
        require(nodes[o1].incomingEdges.exists(bytes32(edgeId)) || nodes[o2].incomingEdges.exists(bytes32(edgeId)), "Edge must connect to o1 or o2");
        // todo: consider validating edgeId connects to a reason node

        bytes32 key = _weightKey(edgeId, o1, o2, contextId);
        AggregatedWeight storage aggWeight = weights[key];
        ManagerVote storage vote = aggWeight.managerVotes[msg.sender];

        // If manager already voted, subtract their old vote first
        if (vote.hasVoted) {
            aggWeight.totalJW -= vote.jw;
            aggWeight.totalRW -= vote.rw;
            aggWeight.voteCount--;
        }

        // Add new vote
        vote.jw = jw;
        vote.rw = rw;
        vote.hasVoted = true;

        aggWeight.totalJW += jw;
        aggWeight.totalRW += rw;
        aggWeight.voteCount++;

        emit ManagerWeightVote(msg.sender, edgeId, o1, o2, contextId, jw, rw);
    }

    function getAggregatedWeight(uint256 edgeId, uint256 o1, uint256 o2, uint256 contextId)
        external view returns (uint256 totalJW, uint256 totalRW, uint256 voteCount)
    {
        bytes32 key = _weightKey(edgeId, o1, o2, contextId);
        AggregatedWeight storage weight = weights[key];
        return (weight.totalJW, weight.totalRW, weight.voteCount);
    }

    function getManagerVote(address manager, uint256 edgeId, uint256 o1, uint256 o2, uint256 contextId)
        external view returns (bool hasVoted, uint256 jw, uint256 rw)
    {
        bytes32 key = _weightKey(edgeId, o1, o2, contextId);
        ManagerVote storage vote = weights[key].managerVotes[manager];
        return (vote.hasVoted, vote.jw, vote.rw);
    }

    // --------------------------
    // Dual Scale Evaluation (between two options)
    // --------------------------
    function compare(uint256 a, uint256 b) internal pure returns (ScaleValue) {
        if (a > b) return ScaleValue.POS;
        if (a < b) return ScaleValue.NEG;
        return ScaleValue.ZERO;
    }

    function evaluateDualScale(
        uint256 o1,
        uint256 o2,
        uint256 contextId
    ) public view returns (DualResult memory result) {
        require(nodes[o1].isOption, "o1 must be an option");
        require(nodes[o2].isOption, "o2 must be an option");

        uint256 jw_o1 = 0;
        uint256 rw_o1 = 0;
        uint256 jw_o2 = 0;
        uint256 rw_o2 = 0;

        // Get all edges (reasons) that target o1
        uint256 edgeCount1 = nodes[o1].incomingEdges.count();
        for (uint256 i = 0; i < edgeCount1; i++) {
            uint256 edgeId = uint256(nodes[o1].incomingEdges.keyAtIndex(i));
            bytes32 key = _weightKey(edgeId, o1, o2, contextId);
            AggregatedWeight storage weight = weights[key];
            if (weight.voteCount > 0) {
                jw_o1 += weight.totalJW;
                rw_o1 += weight.totalRW;
            }
        }

        // Get all edges (reasons) that target o2
        uint256 edgeCount2 = nodes[o2].incomingEdges.count();
        for (uint256 i = 0; i < edgeCount2; i++) {
            uint256 edgeId = uint256(nodes[o2].incomingEdges.keyAtIndex(i));
            bytes32 key = _weightKey(edgeId, o1, o2, contextId);
            AggregatedWeight storage weight = weights[key];
            if (weight.voteCount > 0) {
                jw_o2 += weight.totalJW;
                rw_o2 += weight.totalRW;
            }
        }

        result.jw_o1 = jw_o1;
        result.rw_o1 = rw_o1;
        result.jw_o2 = jw_o2;
        result.rw_o2 = rw_o2;
        result.permission = compare(jw_o1, rw_o2);
        result.commitment = compare(jw_o2, rw_o1);
    }

    function isPermissibleAgainst(uint256 o1, uint256 o2, uint256 contextId)
        public view returns (bool)
    {
        DualResult memory result = evaluateDualScale(o1, o2, contextId);
        return (result.permission == ScaleValue.POS || result.permission == ScaleValue.ZERO);
    }

    // --------------------------
    // Dynamic Scale: Tournament between all options
    // --------------------------
    function getAllOptions() public view returns (uint256[] memory) {
        uint256 nodeCount = nodeIds.count();
        uint256[] memory allOptions = new uint256[](nodeCount);
        uint256 optionCount = 0;

        for (uint256 i = 0; i < nodeCount; i++) {
            uint256 nodeId = uint256(nodeIds.keyAtIndex(i));
            if (nodes[nodeId].isOption) {
                allOptions[optionCount] = nodeId;
                optionCount++;
            }
        }

        // Trim array to actual option count
        assembly {
            mstore(allOptions, optionCount)
        }
        return allOptions;
    }

    function dynamicScale(uint256 contextId) 
        external view returns (uint256[] memory permittedOptions, uint256[] memory unpermittedOptions)
    {
        uint256[] memory allOptions = getAllOptions();
        uint256 optionCount = allOptions.length;
        
        if (optionCount == 0) {
            return (new uint256[](0), new uint256[](0));
        }

        bool[] memory isPermitted = new bool[](optionCount);
        
        // Initialize all as permitted, then eliminate those that lose any comparison
        for (uint256 i = 0; i < optionCount; i++) {
            isPermitted[i] = true;
        }

        // Run pairwise comparisons
        for (uint256 i = 0; i < optionCount; i++) {
            for (uint256 j = i + 1; j < optionCount; j++) {
                uint256 o1 = allOptions[i];
                uint256 o2 = allOptions[j];

                // Check if o1 is permissible against o2
                if (!isPermissibleAgainst(o1, o2, contextId)) {
                    isPermitted[i] = false;
                }

                // Check if o2 is permissible against o1
                if (!isPermissibleAgainst(o2, o1, contextId)) {
                    isPermitted[j] = false;
                }
            }
        }

        // Count permitted and unpermitted options
        uint256 permittedCount = 0;
        uint256 unpermittedCount = 0;
        for (uint256 i = 0; i < optionCount; i++) {
            if (isPermitted[i]) {
                permittedCount++;
            } else {
                unpermittedCount++;
            }
        }

        // Fill result arrays
        permittedOptions = new uint256[](permittedCount);
        unpermittedOptions = new uint256[](unpermittedCount);
        
        uint256 permIndex = 0;
        uint256 unpermIndex = 0;
        
        for (uint256 i = 0; i < optionCount; i++) {
            if (isPermitted[i]) {
                permittedOptions[permIndex++] = allOptions[i];
            } else {
                unpermittedOptions[unpermIndex++] = allOptions[i];
            }
        }
    }

    // --------------------------
    // View functions
    // --------------------------
    function getNode(uint256 nodeId) external view returns (string memory metadata, bool isOption) {
        require(nodeIds.exists(bytes32(nodeId)), "Node does not exist");
        Node storage node = nodes[nodeId];
        return (node.metadata, node.isOption);
    }

    function getEdge(uint256 edgeId) external view returns (uint256 reasonId, uint256 optionId, string memory metadata) {
        require(edgeIds.exists(bytes32(edgeId)), "Edge does not exist");
        Edge storage edge = edges[edgeId];
        return (edge.reasonId, edge.optionId, edge.metadata);
    }

    function getOptionsForReason(uint256 reasonId) external view returns (uint256[] memory) {
        require(nodeIds.exists(bytes32(reasonId)), "Reason does not exist");
        require(!nodes[reasonId].isOption, "Node must be a reason");
        
        uint256 edgeCount = nodes[reasonId].outgoingEdges.count();
        uint256[] memory options = new uint256[](edgeCount);
        
        for (uint256 i = 0; i < edgeCount; i++) {
            uint256 edgeId = uint256(nodes[reasonId].outgoingEdges.keyAtIndex(i));
            options[i] = edges[edgeId].optionId;
        }
        
        return options;
    }

    function getReasonsForOption(uint256 optionId) external view returns (uint256[] memory) {
        require(nodeIds.exists(bytes32(optionId)), "Option does not exist");
        require(nodes[optionId].isOption, "Node must be an option");
        
        uint256 edgeCount = nodes[optionId].incomingEdges.count();
        uint256[] memory reasons = new uint256[](edgeCount);
        
        for (uint256 i = 0; i < edgeCount; i++) {
            uint256 edgeId = uint256(nodes[optionId].incomingEdges.keyAtIndex(i));
            reasons[i] = edges[edgeId].reasonId;
        }
        
        return reasons;
    }
}