// SPDX-License-Identifier: MIT
// npx hardhat test .\test\balancing_2.ts

pragma solidity ^0.8.28;

//pragma solidity ^0.5.1;

//pragma experimental ABIEncoderV2; // experimental feature | do not use in live deployments

//import "./HitchensUnorderedKeySet.sol";

// The contract is used in 1 particular context this means that we do not need to make the code be able to switch contexts since it is just that particular instance. 
// For a different context a new instance is instantiated.
contract Balancing {
    //using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;

    struct Reason {
        string ground;
        string[2] choice;
        uint256[2] weights;
    }

    struct Context {
        Reason[] reasons;
        string[] options; // this should be extended to a set of options, but for now it is just one option.
        bool[] outputs; // the output is at the moment --,-,0,+,++ but this does not align with the theory of detachment systems.
    }

    struct Source {
        //HitchensUnorderedKeySetLib.Set reasons; // this is the set of reasons that the source has voted on
        mapping(uint256 => bool) reasons; // this is the set of reasons that the source has voted on
        uint256 reputation;
    }


    // if I get rid of hitchensUnordereKeySet i can go to a newer version of solidity
    //HitchensUnorderedKeySetLib.Set contextIDs;
    mapping(uint256 => Context) contexts;

    //mapping(address => HitchensUnorderedKeySetLib.Set) sourcesReasons;//agentsArguments, sources
    // mapping(address => Reason) sourcesArguments; // agentsArguments, sources

    //mapping(address => HitchensUnorderedKeySetLib.Set) sources;
    mapping(address => Source) sources;
    // mapping(address => uint256) reputations;

    // event OutputDecision(string option, string output); // TODO needs to be revised
    event Receipt(Context context); // Maybe this works, just try contexts[1]. How is the "receipt" saved?
    // maybe instead output a hash or index for privacy
    // then allow access only to particular agents.

    constructor() public {
        // contextIDs.insert(bytes32(uint256(1)));
        Context storage context = contexts[1];
        context.options[0] = '0';
    }

// -------------- auxiliary functions -----------------------------------------------------
    
    // is this function really needed?
    function compareStrings
    (
        string memory a, 
        string memory b
    ) 
        public 
        view 
        returns (bool) 
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }


    // probably there is a function in some library to convert to string
    function convertToString(uint256 value) // this function converts an int to str
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

    
// -------------------- interaction functions -----------------------------------------

    function setOption(string memory option, uint256 optionID)
    	public
    {
    	// TODO change to depend on access rights and can only be called at the start
    	if(true) {
            Context storage context = contexts[1];
    	    context.options[optionID] = option;
    	}
    }

    function setIssue
    (
        string[] options
    )
        public
        // returns ()
    {
        Context storage context = contexts[1];

        context.options = options;
    }

    function setReputation(uint256 rep, address subject) 
        public
    {
        assert(msg.sender!=subject);
        reputations[subject] = rep;
    }

    function returnWeight(uint256 reasonID) 
        public
        view
        returns (uint256 jweight, uint256 rweight) 
    {
        Context storage context = contexts[1];

        jweight = context.reasons[reasonID][0];
        rweight = context.reasons[reasonID][1];
    }

    function changeWeight(uint256 reasonID, uint256 newjWeight, uint256 newrWeight) 
        public
    {
        assert(reasonID != 0);

        Context storage context = contexts[1];

        context.reasons[reasonID][0] = newjWeight;
        context.reasons[reasonID][1] = newrWeight;
    }

// --- add restritions on getters ---
    function getWeights()
        public
        view
        returns (
            uint256[] memory jweights,
            uint256[] memory rweights
        )
    {
        Context storage context = contexts[1];
        uint256 rs = context.reasons.len;

        uint256[][] memory weights = new uint256[2][](rs);
        
        for (uint256 i = 0; i < rs; i++) {
            weights[i] = context.reasons[i].weights;
        }

    }

    function getIssue()
        public
        view
        returns ( 
            string[] memory options
        )
    {
        Context storage context = contexts[1];

        options = context.options;

    }
    
    function getReasons()
        public
        view
        returns (
            string[] memory grounds,
            string[] memory options,
            string[] memory aoptions,
            uint256[] memory jweights,
            uint256[] memory rweights
        )
    {
        Context storage context = contexts[1];
        uint256 reasonsCount = context.reasonIDs.count();

        grounds = new string[](reasonsCount);
        options = new string[](reasonsCount);
        aoptions = new string[](reasonsCount);
        jweights = new uint256[](reasonsCount);
        rweights = new uint256[](reasonsCount);

        for (uint256 i = 0; i < reasonsCount; i++) {
            Reason storage reason = context.reasons[i];
            grounds[i] = reason.ground;
            options[i] = reason.choice[0];
            aoptions[i] = reason.choice[1];
            jweights[i] = reason.weights[0];
            rweights[i] = reason.weights[1];
        }
    }

// -------------- voting and balancing / detachment ----------------------------------------------------------------


    // maybe allow new options to be added to the context through voting on reasons
    // what to do with grounds that are introduced for o1 vs o2 but not in relation to option o3.
    function voteOnReason
    (
        string memory ground, 
        string memory option1, 
        string memory option2, 
        uint256 justifyingWeight,
        uint256 requiringWeight
    ) 
        public
        returns (int256 retReason)
    {
        Context storage context = contexts[1];

        retReason = -1;
        // check that reason is not known yet.
        for (uint256 j = 0; j < context.reasons.len + 1; j++) {
            Reason storage reason = context.reasons[j];
            if (compareStrings(reason.ground, ground) && compareStrings(reason.choice[0], option1) && compareStrings(reason.choice[1], option2)) {
                // conclude reason is already in reasons
                // increase weights
                reason.weight[0] = reason.weight[0] + justifyingWeight; // todo multiply by reputation/expertise
                reason.weight[1] = reason.weight[1] + requiringWeight;

                // HitchensUnorderedKeySetLib.Set storage source = sources[msg.sender];
                source = sources[msg.sender];
                source.insert(bytes32(j));

                retReason = j;

                break;
            }
        }

        if (retReason == -1) {// reason is new add reason and set weights
            uint256 reasonID = context.reasons.len;
            Reason storage reason = context.reasons[reasonID];
            reason.ground = ground;
            reason.choice = (option1, option2);
            reason.weights = (justifyingWeight, requiringWeight);
            
            context.reasons.push(reason);

            // HitchensUnorderedKeySetLib.Set storage source = sources[ msg.sender];
            source = sources[ msg.sender];
            source.insert(bytes32(reasonID));
            
            retReason = int256(reasonID);
        }
    }



    // this function is not used yet, but it is a placeholder for the future.
    // it is supposed to be used for dual scale detachment, where the decision is made using 4 scales jwo1, jwo2, rwo1, rwo2.
    // possibly the shape of the weight system needs to be changed to allow for this.
    function dualScaleDetachment
    (
        string option,
        string aoption
    )
        public
        view 
        returns (string memory dec)
    {
        Context storage context = contexts[1];

        Reason storage reason = context.reasons[0];

        uint256 jwo = 0;
        uint256 rwo = 0;
        uint256 jwao = 0;
        uint256 rwao = 0;
        uint256[2] weights = [0,0];

        for (uint256 k = 0; j < context.reasons.len; j++) {
            reason = context.reasons[k];
            if (reason.choice[0] == option && reason.choice[1] == aoption) {
                weights = context.reasons[k].weights;
                jwo += weights[0];
                rwo += weights[1];
            }
            if (reason.choice[1] == option && reason.choice[0] == aoption) {
                weights = context.reasons[k].weights;
                jwao += weights[0];
                rwao += weights[1];
            }
        }

        return (jwo-rwao, jwao-rwo);
    }

 
    function dynamicScale()
        public
        view 
        returns (bool[] permissions)
    {
        Context storage context = contexts[1];

        results = [];
        permissions = new uint256[](context.options.len);

        for (uint256 i = 0; i < context.options.len; i++) {
            permissions[i] = true;
            for (uint256 j = 0; j < context.options.len; j++) {

                result = dualScaleDetachment(context.options[i], context.options[j]);
                results.push(result);

                if (result[0] < 0) {
                    permissions[i] = false;
                    break;
                }
                //if (result[0] < 0 && result[1] >= 0) {
                //    permissions[i] = false;
                //    break;
                //}

            }
        }

        return permissions;
    }

}
