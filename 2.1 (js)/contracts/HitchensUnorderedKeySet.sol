// pragma solidity 0.5.1;

/* 
Hitchens UnorderedKeySet v0.93

Library for managing CRUD operations in dynamic key sets.

https://github.com/rob-Hitchens/UnorderedKeySet

Copyright (c), 2019, Rob Hitchens, the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

THIS SOFTWARE IS NOT TESTED OR AUDITED. DO NOT USE FOR PRODUCTION.
*/

//----------------

// SPDX-License-Identifier: MIT
// pragma solidity ^0.6.0;
pragma solidity ^0.8.4;


// Hitchens UnorderedKeySet v0.93
// THIS SOFTWARE IS NOT TESTED OR AUDITED. DO NOT USE FOR PRODUCTION.

library HitchensUnorderedKeySetLib {

    error UnorderedKeySet100KeyCannotBe0x0();
    error UnorderedKeySet101KeyAlreadyExistsInSet();
    error UnorderedKeySet102KeyDoesNotExistInSet();

    struct Set {
        mapping(bytes32 => uint) keyPointers;
        bytes32[] keyList;
    }

    function insert(Set storage self, bytes32 key) internal {
        if(key == 0x0) {
            revert UnorderedKeySet100KeyCannotBe0x0();
        }
        if(exists(self, key)) {
            revert UnorderedKeySet101KeyAlreadyExistsInSet();
        }
        self.keyList.push(key);
        self.keyPointers[key] = self.keyList.length - 1;
    }

    function remove(Set storage self, bytes32 key) internal {
        if(!exists(self, key)) {
            revert UnorderedKeySet102KeyDoesNotExistInSet();
        }
        bytes32 keyToMove = self.keyList[count(self)-1];
        uint rowToReplace = self.keyPointers[key];
        self.keyPointers[keyToMove] = rowToReplace;
        self.keyList[rowToReplace] = keyToMove;
        delete self.keyPointers[key];
        self.keyList.pop();
    }
    function count(Set storage self) internal view returns(uint) {
        return(self.keyList.length);
    }
    function exists(Set storage self, bytes32 key) internal view returns(bool) {
        if(self.keyList.length == 0) return false;
        return self.keyList[self.keyPointers[key]] == key;
    }
    function keyAtIndex(Set storage self, uint index) internal view returns(bytes32) {
        return self.keyList[index];
    }
    function nukeSet(Set storage self) public {
        delete self.keyList;
    }
}

contract HitchensUnorderedKeySet {
    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;
    HitchensUnorderedKeySetLib.Set set;
    event LogUpdate(address sender, string action, bytes32 key);
    function exists(bytes32 key) public view returns(bool) {
        return set.exists(key);
    }
    function insert(bytes32 key) public {
        set.insert(key);
        emit LogUpdate(msg.sender, "insert", key);
    }
    function remove(bytes32 key) public {
        set.remove(key);
        emit LogUpdate(msg.sender, "remove", key);
    }
    function count() public view returns(uint) {
        return set.count();
    }
    function keyAtIndex(uint index) public view returns(bytes32) {
        return set.keyAtIndex(index);
    }
    function stringToBytes(string memory _string) external pure returns (bytes32) {
        return keccak256(abi.encode(_string));
    }
} 


