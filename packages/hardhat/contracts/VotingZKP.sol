// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./Groth16Verifier.sol"; // This will be generated from the circom circuit;
import "hardhat/console.sol";

contract VotingZKP {
    using ECDSA for bytes32;

    struct Poll {
        string name;
        string prompt;
        string[] options;
        uint256 endTime;
        bool exists;
    }
    
    // Verifier contract for ZKP
    Groth16Verifier public verifier;
    
    mapping(uint256 => Poll) public polls;
    mapping(bytes32 => bool) public nullifierHashes; // Track used nullifiers
    mapping(uint256 => mapping(uint256 => uint256)) public voteCounts;
    
    uint256 public pollCounter;
    
    event PollCreated(uint256 pollId, string name, string prompt);
    event VoteCast(uint256 pollId, bytes32 nullifierHash, uint256 optionIndex);
    
    constructor(address _verifierAddress) {
        verifier = Groth16Verifier(_verifierAddress);
    }
    
    function createPoll(
        string memory _name,
        string memory _prompt,
        string[] memory _options,
        uint256 _durationInMinutes
    ) public returns (uint256) {
        require(_options.length >= 2, "At least 2 options required");
        
        uint256 pollId = pollCounter++;
        polls[pollId] = Poll({
            name: _name,
            prompt: _prompt,
            options: _options,
            endTime: block.timestamp + (_durationInMinutes * 1 minutes),
            exists: true
        });
        
        emit PollCreated(pollId, _name, _prompt);
        console.log("poll name:", _name);
        return pollId;
    }
    
    function castVoteWithProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory input // [pollId, optionIndex, voteHash, nullifierHash]
    ) public {
        require(polls[input[0]].exists, "Poll does not exist");
        require(block.timestamp < polls[input[0]].endTime, "Poll has ended");
        require(input[1] < polls[input[0]].options.length, "Invalid option");
        
        // Verify the nullifier hasn't been used
        bytes32 nullifierHash = bytes32(input[3]);
        require(!nullifierHashes[nullifierHash], "Vote already cast");
        
        console.log(
            input[2],
            input[3]
        );

        // Verify the zero-knowledge proof
        require(verifier.verifyProof(a, b, c, [input[2], input[3]]), "Invalid proof");
        
        // Mark nullifier as used
        nullifierHashes[nullifierHash] = true;
        
        // Count the vote
        voteCounts[input[0]][input[1]]++;
        
        emit VoteCast(input[0], nullifierHash, input[1]);
    }
    
    function getPoll(uint256 _pollId) public view returns (
        string memory name,
        string memory prompt,
        string[] memory options,
        uint256 endTime,
        bool exists
    ) {
        require(polls[_pollId].exists, "Poll does not exist");
        Poll storage poll = polls[_pollId];
        return (
            poll.name,
            poll.prompt,
            poll.options,
            poll.endTime,
            poll.exists
        );
    }
    
    function getVoteCounts(uint256 _pollId) public view returns (uint256[] memory) {
        require(polls[_pollId].exists, "Poll does not exist");
        uint256[] memory counts = new uint256[](polls[_pollId].options.length);
        
        for (uint256 i = 0; i < polls[_pollId].options.length; i++) {
            counts[i] = voteCounts[_pollId][i];
        }
        
        return counts;
    }
}
