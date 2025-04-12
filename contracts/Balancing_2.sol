// SPDX-License-Identifier: MIT

pragma solidity ^0.5.1;

// pragma experimental ABIEncoderV2; // experimental feature | do not use in live deployments

import "./HitchensUnorderedKeySet.sol";


contract Balancing {
    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;

    struct Reason {
        uint256 weight;
        string polarity;
        string ground;
    }

    struct Weighing {
        HitchensUnorderedKeySetLib.Set reasonsIDs;
        mapping(uint256 => Reason) reasons;
        string option;
        string output;
    }

    HitchensUnorderedKeySetLib.Set weighingIDs;
    mapping(uint256 => Weighing) weighings;

    mapping(address => HitchensUnorderedKeySetLib.Set) sourcesReasons;//agentsArguments, sources

    event OutputDecision(Weighing weighing);// maybe instead output a hash or index for privacy
    // then allow access only to particular agents.


    constructor() public {
        weighingsIDs.insert(bytes32(uint256(1)));
        Weighing storage weighing = weighings[1];
        weighing.option = '0';
    }

    function setOption(string memory option)
    	public
    {
    	// TODO change to depend on access rights and can only be called at the start
    	if(true) {
            Weighing storage weighing = weighings[1];
    	    weighing.option = option;
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
        uint256 confidence
    ) 
        public
        returns (int256 re)
    {
        Weighing storage weighing = weighings[1];

        re = 0;
        // check that reason is not known yet.
        for (uint256 j = 1; j < weighing.reasonsIDs.count() + 1; j++) {
            uint256 reasonID = uint256(reasonsIDs.keyAtIndex(j));
            if (compareStrings(weighing.reasons[reasonID].ground, ground) && 
            // compareStrings(graph.reasons[j].issue, issue) && 
            compareStrings(weighing.reasons[reasonID].polarity, polarity)) {
                // conclude reason is already in reasons
                // increase weight by magnitude
                weighing.reasons[reasonID].weight = weighing.reasons[reasonID].weight + confidence*reputations[msg.sender];//maybe this should be magnitude instead of conf*rep

                HitchensUnorderedKeySetLib.Set storage source = sources[ msg.sender];
                source.insert(bytes32(reasonID));
                re = int256(reasonID);
                break;
            }
        }

        if (re == 0) {// reason is new add reason and set weight to 1
            uint256 reasonID = weighing.reasonsIDs.count() + 1;
            weighing.reasonsIDs.insert(bytes32(reasonID));
            Reason storage reason = weighing.reasons[reasonID];
            // reason.ground = ground;
            weighing.reasons[reasonID].ground = ground;
            // reason.option = option;
            // reason.polarity = polarity;
            weighing.reasons[reasonID].polarity = polarity;
            // weights[reasonID-1] = confidence*reputations[msg.sender];
            weighing.reasons[reasonID].weight = weighing.reasons[reasonID].weight + confidence*reputations[msg.sender];// maybe this should be magnitude instead of conf*rep
    
            HitchensUnorderedKeySetLib.Set storage source = sources[ msg.sender];
            source.insert(bytes32(reasonID));
            re = int256(reasonID);
        }
    }


    // probably this can be done in a nicer way maybe via a library
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
        Weighing storage weighing = weighings[1];

        dec = '';
        uint256 magn = 0;
        uint256 pos = 0;
        uint256 ppos = 0;
        uint256 neg = 0;
        uint256 nneg = 0;
        int256 sum = 0;
        uint256 neut = 0;
        string memory cs = '';
        uint256 rs = weighing.reasonsIDs.count();   


        for (uint256 i = 0; i < rs; i++){
                
            uint256 reasonID = uint256(weighing.reasonsIDs.keyAtIndex(i));
            Reason storage reason = weighing.reasons[reasonID];//not sure if this works
            
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


        weighing.decision = dec;
        emit Output(weighing);


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
    //         string[] memory justifications,
    //         string[] memory issues,
    //         string[] memory polarities
    //     )
    // {
        
    //     uint256 reasonsCount = reasonsIds.count();

    //     justifications = new string[](reasonsCount);
    //     issues = new string[](reasonsCount);
    //     polarities = new string[](reasonsCount);

    //     for (uint256 i = 0; i < reasonsIds.count(); i++) {
    //         uint256 reasonId = uint256(reasonsIds.keyAtIndex(i));
    //         Reason storage reason = reasons[reasonId];
    //         justifications[i] = reason.justification;
    //         issues[i] = reason.issue;
    //         polarities[i] = reason.polarity;
    //     }
    // }

}
