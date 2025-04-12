// SPDX-License-Identifier: MIT

pragma solidity ^0.5.1;

// pragma experimental ABIEncoderV2; // experimental feature | do not use in live deployments

import "./HitchensUnorderedKeySet.sol";


contract Balancing {
    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;

    struct Node {
        uint256 weight;
        string polarity;
        string ground;
    }

    // maybe the voters should also be recorded in the graph
    struct Graph {
        HitchensUnorderedKeySetLib.Set reasonsIDs;
        mapping(uint256 => Node) reasons;
        string issue;
        string decision;
    }

    HitchensUnorderedKeySetLib.Set graphsIDs;
    mapping(uint256 => Graph) graphs;

    mapping(address => HitchensUnorderedKeySetLib.Set) sourcesReasons;//agentsArguments, sources

    event OutputDecision(Graph graph);// maybe instead output a hash or index for privacy
    // then allow access only to particular agents.


    constructor() public {
        graphsIDs.insert(bytes32(uint256(1)));
        Graph storage graph = graphs[1];
        graph.issue = '0';
    }

    function setIssue(string memory issue)
    	public
    {
    	// TODO change to depend on access rights and can only be called at the start
    	if(true) {
            Graph storage graph = graphs[1];
    	    graph.issue = issue;
    	}
    }
    
    // is this function really needed?
    function compareStrings(string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function voteOnReason
    (
        string memory ground, 
        // string memory issue, 
        string memory polarity, 
        uint256 magnitude
    ) 
        public
        returns (int256 nodeID)
    {
        Graph storage graph = graphs[1];

        nodeID = 0;
        // check that reason is not present yet.
        for (uint256 j = 1; j < graph.reasonsIDs.count() + 1; j++) {
            if (compareStrings(graph.reasons[j].ground, ground) && 
            // compareStrings(graph.reasons[j].issue, issue) && 
                    compareStrings(graph.reasons[j].polarity, polarity)) {
                // conclude reason is already in reasons
                // increase weight by magnitude
                // graph.reasons[j].weight = graph.reasons[j].weight + confidence*reputations[msg.sender];
                graph.reasons[j].weight = graph.reasons[j].weight + magnitude;

                HitchensUnorderedKeySetLib.Set storage source = sources[
                    msg.sender
                ];
                source.insert(bytes32(j));
                nodeID = int256(j);
                break;
            }
        }

        if (nodeID == 0) {// reason is new add reason and set weight
            uint256 reasonID = graph.reasonsIDs.count() + 1;
            graph.reasonsIDs.insert(bytes32(reasonID));
            Reason storage reason = graph.reasons[reasonID];
            // reason.issue = issue;
            reason.ground = ground;
            reason.polarity = polarity;
            reason.weight = magnitude;
            // graph.reasons[reasonID].ground = ground;
            // graph.reasons[reasonID].polarity = polarity;
            // weights[reasonID-1] = confidence*reputations[msg.sender];
            // graph.reasons[reasonID].weight = graph.reasons[reasonID].weight + confidence*reputations[msg.sender];
    
            HitchensUnorderedKeySetLib.Set storage source = sources[
                msg.sender
            ];
            source.insert(bytes32(reasonID));
            nodeID = int256(reasonID);
        }
    }


    // probably there is a function in some library to convert to string
    function convertToString(uint256 value) 
        internal 
        pure 
        returns (string memory) 
    {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }

        return string(buffer);
    }

    function procedureAdditive()
        public
        // view 
        returns (string memory dec)
    {
        Graph storage graph = graphs[1];

        dec = '';
        uint256 magn = 0;
        uint256 pos = 0;
        uint256 ppos = 0;
        uint256 neg = 0;
        uint256 nneg = 0;
        int256 sum = 0;
        uint256 neut = 0;
        string memory cs = '';
        uint256 rs = graph.reasonsIDs.count();   


        for (uint256 i = 0; i < rs; i++){
                // TODO: this for loop can be generalized for n-values with a dictionary.
                // this would clean up the amount of variables hanging around.
            uint256 reasonID = uint256(graph.reasonsIDs.keyAtIndex(i));
            Reason storage reason = graph.reasons[reasonId];
            
            cs = string(abi.encodePacked(cs, " ", i, " ", reason.ground));

            if (compareStrings(reason.polarity, '0')) { 
                neut += uint256(reason.weight);
            }
            else if (compareStrings(reason.polarity, '-')) { 
                neg += uint256(reason.weight);
            }
            else if (compareStrings(reason.polarity, '+')) { 
                pos += uint256(reason.weight);
            }
            else if (compareStrings(reason.polarity, '--')) { 
                nneg += uint256(reason.weight);
            }
            else if (compareStrings(reason.polarity, '++')) { 
                ppos += uint256(reason.weight);
            }
        }  

        sum = int256(pos) + 2*int256(ppos) - (int256(neg) + 2*int256(nneg));
        magn = sum < 0 ? uint256(-sum) : uint256(sum);

        if (!(2*magn > neut)) {
            magn = neut;
            string memory Magn = convertToString(magn);
            dec = string(abi.encodePacked(dec, '(', Magn, ', ', '0', ')'));
        }
        else if (sum > 0 && ppos > pos) {
            magn = ppos;
            string memory Magn = convertToString(magn);
            dec = string(abi.encodePacked(dec, '(', Magn, ', ', '++', ')'));
        }
        else if (sum > 0) {
            magn = pos;
            string memory Magn = convertToString(magn);
            dec = string(abi.encodePacked(dec, '(', Magn, ', ', '+', ')'));
        }
        else if (sum < 0 && nneg > neg) {
            magn = nneg;
            string memory Magn = convertToString(magn);
            dec = string(abi.encodePacked(dec, '(', Magn, ', ', '--', ')'));
        }
        else if (sum < 0) {
            magn = neg;
            string memory Magn = convertToString(magn);
            dec = string(abi.encodePacked(dec, '(', Magn, ', ', '-', ')'));
        }
        else {
            magn = 0;
            string memory Magn = convertToString(magn);
            dec = string(abi.encodePacked(dec, '(', Magn, ', ', '0', ')'));
        }


        graph.decision = dec;
        emit Output(graph);


        return dec;
    }

    // // create function to initialize contract. create access right for admin to set issue and read rights of the discourse.

 


    // function setReputation(uint256 rep, address subject) 
    //     public
    // {
    //     assert(msg.sender!=subject);
    //     reputations[subject] = rep;
    // }

    // function returnWeight(uint256 r) 
    //     public
    //     view
    //     returns (uint256 weight) 
    // {
    //     weight = weights[r];
    // }

    // function changeWeight(uint256 reasonID, uint256 newWeight) 
    //     public
    // {
    //     assert(reasonID != 0);
    //     weights[reasonID] = newWeight;
    // }

    // function getWeights()
    //     public
    //     view
    //     returns (
    //         uint256[] memory
    //     )
    // {
    //     uint256 rs = reasonsIds.count();

    //     uint256[] memory _weights = new uint256[](rs);

    //     for (uint256 i = 0; i < rs; i++) {
    //         _weights[i] = weights[i];
    //     }

    //     return _weights;
    // }

    // function getIssue()
    //     public
    //     view
    //     returns ( string memory)
    // {
    //     return issueTBD;
    // }
    

    // function getReasons()
    //     public
    //     view
    //     returns (
    //         string[] memory ground,
    //         string[] memory issues,
    //         string[] memory polarities
    //     )
    // {
        
    //     uint256 reasonsCount = reasonsIds.count();

    //     ground = new string[](reasonsCount);
    //     issues = new string[](reasonsCount);
    //     polarities = new string[](reasonsCount);

    //     for (uint256 i = 0; i < reasonsIds.count(); i++) {
    //         uint256 reasonId = uint256(reasonsIds.keyAtIndex(i));
    //         Reason storage reason = reasons[reasonId];
    //         ground[i] = reason.ground;
    //         issues[i] = reason.issue;
    //         polarities[i] = reason.polarity;
    //     }
    // }

}
