// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SimpleSet.sol";

/// @title DS_Detachment – Directed graph + contrastive detachment (faithful to theory)
/// @notice Weights are contrastive: w(edgeId, o1, o2, contextId) = (jw, rw)
contract DS_Detachment {
    using SimpleSet for SimpleSet.Set;

    // --------------------------
    // Events
    // --------------------------
    event WeightSet(uint256 edgeId, uint256 o1, uint256 o2, uint256 contextId, uint256 jw, uint256 rw);
    event BatchWeightSet(uint256 count);
    event NodeInserted(uint256 nodeId, string metadata);
    event EdgeInserted(uint256 edgeId, uint256 sourceId, uint256 targetId, string metadata);

    // --------------------------
    // Graph types
    // --------------------------
    struct Node {
        SimpleSet.Set edgesIn;
        SimpleSet.Set edgesOut;
        uint256 value;      // optional counter you already had
        string metadata;
    }

    struct Edge {
        uint256 source;
        uint256 target;
        string metadata;    // free-form; reasons/grounds can be encoded here if you like
    }

    struct Graph {
        SimpleSet.Set nodesIds;
        mapping(uint256 => Node) nodes;
        SimpleSet.Set edgesIds;
        mapping(uint256 => Edge) edges;
    }

    // --------------------------
    // Detachment types
    // --------------------------
    enum ScaleValue { NEG, ZERO, POS } // order-sensitive comparator outcome

    struct Weight { uint256 jw; uint256 rw; bool exists; }

    // Contrastive weights: key = keccak(edgeId, o1, o2, contextId)
    mapping(bytes32 => Weight) private weights;

    // --------------------------
    // State: graphs & agent args (unchanged from your base)
    // --------------------------
    SimpleSet.Set private graphsIds;
    mapping(uint256 => Graph) private graphs;
    mapping(address => SimpleSet.Set) private agentsArguments;

    constructor() {
        graphsIds.insert(bytes32(uint256(1))); // default graph id = 1
    }

    // --------------------------
    // Graph logic (mostly your original)
    // --------------------------
    function insertNode(Graph storage g, string memory metadata)
        internal
        returns (uint256 nodeId)
    {
        nodeId = g.nodesIds.count() + 1;
        g.nodesIds.insert(bytes32(nodeId));
        Node storage node_ = g.nodes[nodeId];
        node_.metadata = metadata;
        node_.value++;
        emit NodeInserted(nodeId, metadata);
    }

    function insertNodeWithId(Graph storage g, uint256 nodeId) internal {
        require(!g.nodesIds.exists(bytes32(nodeId)), "Node already exists.");
        g.nodesIds.insert(bytes32(nodeId));
        emit NodeInserted(nodeId, "");
    }

    function incrementValue(Graph storage g, uint256 nodeId) internal {
        require(g.nodesIds.exists(bytes32(nodeId)), "Unknown nodeId.");
        g.nodes[nodeId].value++;
    }

    function insertEdge(
        Graph storage g,
        uint256 sourceId,
        uint256 targetId,
        string memory metadata
    ) internal returns (uint256 edgeId) {
        require(g.nodesIds.exists(bytes32(sourceId)), "Unknown sourceId.");
        require(g.nodesIds.exists(bytes32(targetId)), "Unknown targetId.");

        edgeId = cantorPairing(sourceId, targetId);
        // allow overwrite of metadata for same logical pair; but ensure we track it once
        if (!g.edgesIds.exists(bytes32(edgeId))) {
            g.edgesIds.insert(bytes32(edgeId));
            g.nodes[sourceId].edgesOut.insert(bytes32(edgeId));
            g.nodes[targetId].edgesIn.insert(bytes32(edgeId));
        }
        Edge storage e = g.edges[edgeId];
        e.source = sourceId;
        e.target = targetId;
        e.metadata = metadata;

        emit EdgeInserted(edgeId, sourceId, targetId, metadata);
    }

    // works only for a and b between 0 to 2^16 -1 (as in your note)
    function cantorPairing(uint256 a, uint256 b)
        internal
        pure
        returns (uint256)
    {
        return ((a + b) * (a + b + 1)) / 2 + a;
    }

    // --------------------------
    // Public API you already had (Argument & Graph helpers)
    // --------------------------
    function insertArgument(string memory metadata) public returns (uint256 argId) {
        Graph storage graph = graphs[1];
        argId = insertNode(graph, metadata);
        agentsArguments[msg.sender].insert(bytes32(argId));
    }

    function supportArgument(uint256 argId) public {
        Graph storage graph = graphs[1];
        incrementValue(graph, argId);
        agentsArguments[msg.sender].insert(bytes32(argId));
    }

    function insertAttack(
        uint256 sourceId,
        uint256 targetId,
        string memory metadata
    ) public returns (uint256 edgeId) {
        Graph storage graph = graphs[1];
        edgeId = insertEdge(graph, sourceId, targetId, metadata);
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
        Graph storage graph = graphs[graphId];
        uint256 nodesCount = graph.nodesIds.count();
        uint256 edgesCount = graph.edgesIds.count();

        nodes = new uint256[](nodesCount);
        edgesSource = new uint256[](edgesCount);
        edgesTarget = new uint256[](edgesCount);

        for (uint256 i = 0; i < nodesCount; i++) {
            nodes[i] = uint256(graph.nodesIds.keyAtIndex(i));
        }
        for (uint256 i = 0; i < edgesCount; i++) {
            uint256 edgeId = uint256(graph.edgesIds.keyAtIndex(i));
            Edge storage e = graph.edges[edgeId];
            edgesSource[i] = e.source;
            edgesTarget[i] = e.target;
        }
    }

    // --------------------------
    // Contrastive weights: set/get
    // --------------------------
    function _wKey(uint256 edgeId, uint256 o1, uint256 o2, uint256 contextId) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(edgeId, o1, o2, contextId));
    }

    /// @notice Set contrastive weight for a single (edge, o1, o2, context)
    function setWeight(
        uint256 edgeId,
        uint256 o1,
        uint256 o2,
        uint256 contextId,
        uint256 jw,
        uint256 rw
    ) public {
        bytes32 k = _wKey(edgeId, o1, o2, contextId);
        weights[k] = Weight(jw, rw, true);
        emit WeightSet(edgeId, o1, o2, contextId, jw, rw);
    }

    /// @notice Batch-set weights. Arrays must be equal length.
    function setWeightsBatch(
        uint256[] calldata edgeIds,
        uint256[] calldata o1s,
        uint256[] calldata o2s,
        uint256[] calldata contextIds,
        uint256[] calldata jws,
        uint256[] calldata rws
    ) external {
        uint256 n = edgeIds.length;
        require(
            o1s.length == n && o2s.length == n && contextIds.length == n && jws.length == n && rws.length == n,
            "Array length mismatch"
        );
        for (uint256 i = 0; i < n; i++) {
            bytes32 k = _wKey(edgeIds[i], o1s[i], o2s[i], contextIds[i]);
            weights[k] = Weight(jws[i], rws[i], true);
        }
        emit BatchWeightSet(n);
    }

    /// @notice Read a contrastive weight; returns (exists, jw, rw).
    function getWeight(
        uint256 edgeId,
        uint256 o1,
        uint256 o2,
        uint256 contextId
    ) public view returns (bool exists, uint256 jw, uint256 rw) {
        Weight storage w = weights[_wKey(edgeId, o1, o2, contextId)];
        return (w.exists, w.jw, w.rw);
    }

    // --------------------------
    // Evaluation helpers
    // --------------------------
    struct Totals {
        uint256 jw_o1; uint256 rw_o1;
        uint256 jw_o2; uint256 rw_o2;
        uint256 maxJW_o1; uint256 maxRW_o1;
        uint256 maxJW_o2; uint256 maxRW_o2;
        uint256 considered_o1; // #edges applied to o1
        uint256 considered_o2; // #edges applied to o2
    }

    /// @dev If RR is empty, use union of inbound edges to o1 and o2 in given graph.
    function _defaultRR(Graph storage g, uint256 o1, uint256 o2) internal view returns (uint256[] memory rr) {
        uint256 n1 = g.nodes[o1].edgesIn.count();
        uint256 n2 = g.nodes[o2].edgesIn.count();
        // worst-case union size = n1 + n2; duplicates (same edgeId) are unlikely because targets differ, but be safe
        rr = new uint256[](n1 + n2);
        uint256 k;
        for (uint256 i = 0; i < n1; i++) { rr[k++] = uint256(g.nodes[o1].edgesIn.keyAtIndex(i)); }
        for (uint256 j = 0; j < n2; j++) { rr[k++] = uint256(g.nodes[o2].edgesIn.keyAtIndex(j)); }
        // trim trailing zeros if any (not strictly necessary)
        assembly { mstore(rr, k) }
    }

    function _accumulateDual(
        Graph storage g,
        uint256 o1,
        uint256 o2,
        uint256 contextId,
        uint256[] memory RR
    ) internal view returns (Totals memory t) {
        // If RR empty, compute default relevant reasons (inbound to o1 or o2)
        if (RR.length == 0) { RR = _defaultRR(g, o1, o2); }

        for (uint256 i = 0; i < RR.length; i++) {
            uint256 edgeId = RR[i];
            if (!g.edgesIds.exists(bytes32(edgeId))) continue;
            Edge storage e = g.edges[edgeId];

            // only weights for edges that actually target o1 or o2 matter in this comparison
            if (e.target == o1) {
                Weight storage w1 = weights[_wKey(edgeId, o1, o2, contextId)];
                if (!w1.exists) continue; // if not provided, the reason is irrelevant under this comparison/context
                t.jw_o1 += w1.jw;
                t.rw_o1 += w1.rw;
                if (w1.jw > t.maxJW_o1) t.maxJW_o1 = w1.jw;
                if (w1.rw > t.maxRW_o1) t.maxRW_o1 = w1.rw;
                t.considered_o1++;
            } else if (e.target == o2) {
                Weight storage w2 = weights[_wKey(edgeId, o1, o2, contextId)];
                if (!w2.exists) continue;
                t.jw_o2 += w2.jw;
                t.rw_o2 += w2.rw;
                if (w2.jw > t.maxJW_o2) t.maxJW_o2 = w2.jw;
                if (w2.rw > t.maxRW_o2) t.maxRW_o2 = w2.rw;
                t.considered_o2++;
            }
        }
    }

    // --------------------------
    // Dual-scale (contrastive)
    // --------------------------
    struct DualResult {
        ScaleValue permission;   // compare jw(o1) vs rw(o2)
        ScaleValue commitment;   // compare jw(o2) vs rw(o1)
        Totals totals;
    }

    function compare(uint256 a, uint256 b) internal pure returns (ScaleValue v) {
        if (a > b) return ScaleValue.POS;
        if (a < b) return ScaleValue.NEG;
        return ScaleValue.ZERO;
    }

    /// @notice Dual-scale evaluation under contrastive weights.
    /// @param graphId Graph to use (e.g., 1)
    /// @param o1 First option
    /// @param o2 Second option
    /// @param contextId Context identifier c
    /// @param RR Relevant reasons (edgeIds). If empty, uses all inbound reasons to o1 and o2.
    function evaluateDualScale(
        uint256 graphId,
        uint256 o1,
        uint256 o2,
        uint256 contextId,
        uint256[] memory RR
    ) public view returns (DualResult memory r) {
        Graph storage g = graphs[graphId];
        Totals memory t = _accumulateDual(g, o1, o2, contextId, RR);

        // Permission for o1 vs o2 compares jw(o1) to rw(o2)
        ScaleValue perm = compare(t.jw_o1, t.rw_o2);
        // Commitment compares jw(o2) to rw(o1)
        ScaleValue comm = compare(t.jw_o2, t.rw_o1);

        r = DualResult({ permission: perm, commitment: comm, totals: t });
    }

    /// @notice Convenience booleans: permissibility / obligation for o1.
    function isPermissible(uint256 graphId, uint256 o1, uint256 o2, uint256 contextId, uint256[] memory RR)
        external view returns (bool)
    {
        DualResult memory r = evaluateDualScale(graphId, o1, o2, contextId, RR);
        return (r.permission == ScaleValue.POS || r.permission == ScaleValue.ZERO);
    }

    /// @notice o1 is obligatory iff permissible and jw(o2) > rw(o1)
    /// (i.e., commitment scale tips positive toward o2 against o1’s requirements)
    function isObligatory(uint256 graphId, uint256 o1, uint256 o2, uint256 contextId, uint256[] memory RR)
        external view returns (bool)
    {
        DualResult memory r = evaluateDualScale(graphId, o1, o2, contextId, RR);
        bool permissible = (r.permission == ScaleValue.POS || r.permission == ScaleValue.ZERO);
        bool commitmentPos = (r.commitment == ScaleValue.POS);
        return permissible && commitmentPos;
    }

    // --------------------------
    // Single-scale / Uniform / Maximum (evaluation *modes*)
    // --------------------------
    // Single-scale: treat each reason’s requiring weight == its justifying weight under the same contrastive lookup.
    function evaluateSingleScale(
        uint256 graphId,
        uint256 o1,
        uint256 o2,
        uint256 contextId,
        uint256[] memory RR
    ) external view returns (DualResult memory r) {
        Graph storage g = graphs[graphId];
        Totals memory t;

        if (RR.length == 0) { RR = _defaultRR(g, o1, o2); }
        for (uint256 i = 0; i < RR.length; i++) {
            uint256 edgeId = RR[i];
            if (!g.edgesIds.exists(bytes32(edgeId))) continue;
            Edge storage e = g.edges[edgeId];
            Weight storage w = weights[_wKey(edgeId, o1, o2, contextId)];
            if (!w.exists) continue;

            if (e.target == o1) {
                // rw := jw
                t.jw_o1 += w.jw;
                t.rw_o1 += w.jw;
                if (w.jw > t.maxJW_o1) t.maxJW_o1 = w.jw;
                if (w.jw > t.maxRW_o1) t.maxRW_o1 = w.jw;
                t.considered_o1++;
            } else if (e.target == o2) {
                t.jw_o2 += w.jw;
                t.rw_o2 += w.jw;
                if (w.jw > t.maxJW_o2) t.maxJW_o2 = w.jw;
                if (w.jw > t.maxRW_o2) t.maxRW_o2 = w.jw;
                t.considered_o2++;
            }
        }

        r.permission = compare(t.jw_o1, t.rw_o2);
        r.commitment = compare(t.jw_o2, t.rw_o1);
        r.totals = t;
    }

    // Uniform: treat every relevant reason as weight 1 for both jw and rw
    function evaluateUniform(
        uint256 graphId,
        uint256 o1,
        uint256 o2,
        uint256 /*contextId ignored*/,
        uint256[] memory RR
    ) external view returns (DualResult memory r) {
        Graph storage g = graphs[graphId];
        Totals memory t;

        if (RR.length == 0) { RR = _defaultRR(g, o1, o2); }
        for (uint256 i = 0; i < RR.length; i++) {
            uint256 edgeId = RR[i];
            if (!g.edgesIds.exists(bytes32(edgeId))) continue;
            Edge storage e = g.edges[edgeId];

            if (e.target == o1) {
                t.jw_o1 += 1;
                t.rw_o1 += 1;
                if (t.maxJW_o1 < 1) t.maxJW_o1 = 1;
                if (t.maxRW_o1 < 1) t.maxRW_o1 = 1;
                t.considered_o1++;
            } else if (e.target == o2) {
                t.jw_o2 += 1;
                t.rw_o2 += 1;
                if (t.maxJW_o2 < 1) t.maxJW_o2 = 1;
                if (t.maxRW_o2 < 1) t.maxRW_o2 = 1;
                t.considered_o2++;
            }
        }

        r.permission = compare(t.jw_o1, t.rw_o2);
        r.commitment = compare(t.jw_o2, t.rw_o1);
        r.totals = t;
    }

    // Maximum: ignore sums; use the single strongest (jw, rw) on each side
    function evaluateMaximum(
        uint256 graphId,
        uint256 o1,
        uint256 o2,
        uint256 contextId,
        uint256[] memory RR
    ) external view returns (DualResult memory r) {
        Graph storage g = graphs[graphId];
        Totals memory t;

        if (RR.length == 0) { RR = _defaultRR(g, o1, o2); }
        for (uint256 i = 0; i < RR.length; i++) {
            uint256 edgeId = RR[i];
            if (!g.edgesIds.exists(bytes32(edgeId))) continue;
            Edge storage e = g.edges[edgeId];
            Weight storage w = weights[_wKey(edgeId, o1, o2, contextId)];
            if (!w.exists) continue;

            if (e.target == o1) {
                if (w.jw > t.maxJW_o1) t.maxJW_o1 = w.jw;
                if (w.rw > t.maxRW_o1) t.maxRW_o1 = w.rw;
                t.considered_o1++;
            } else if (e.target == o2) {
                if (w.jw > t.maxJW_o2) t.maxJW_o2 = w.jw;
                if (w.rw > t.maxRW_o2) t.maxRW_o2 = w.rw;
                t.considered_o2++;
            }
        }

        // Here "permission" uses max jw(o1) vs max rw(o2), and "commitment" uses max jw(o2) vs max rw(o1)
        r.permission = compare(t.maxJW_o1, t.maxRW_o2);
        r.commitment = compare(t.maxJW_o2, t.maxRW_o1);
        r.totals = t;
    }
}
