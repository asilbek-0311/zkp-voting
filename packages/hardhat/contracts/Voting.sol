// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Voting {

    struct Poll {
        string name;
        string prompt;
        string[] options;
        uint256 endTime;
        address nftAddress; // Address of the NFT contract for eligibility
        bool exists;
        address creator;
    }
    
    mapping(uint256 => Poll) public polls;
    mapping(address => uint256[]) public pollsByCreator;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Tracks if a user has voted in a poll
    mapping(uint256 => mapping(uint256 => uint256)) public voteCounts;
    
    uint256 public pollCounter;
    
    event PollCreated(
        uint256 indexed pollId, 
        address indexed creator, 
        string name, 
        string prompt,
        uint256 endTime,
        address nftAddress
    );

    event VoteCast(
        uint256 pollId, 
        address voter, 
        uint256 optionIndex
    );
    
    
    function createPoll(
        string memory _name,
        string memory _prompt,
        string[] memory _options,
        uint256 _durationInMinutes,
        address _nftAddress // Address of the NFT contract (can be zero address)
    ) public returns (uint256) {
        require(_options.length >= 2, "At least 2 options required");
        
        uint256 pollId = pollCounter++;
        polls[pollId] = Poll({
            name: _name,
            prompt: _prompt,
            options: _options,
            endTime: block.timestamp + (_durationInMinutes * 1 minutes),
            exists: true,
            creator: msg.sender,
            nftAddress: _nftAddress
        });
        pollsByCreator[msg.sender].push(pollId);
        
        emit PollCreated(pollId, msg.sender, _name, _prompt, block.timestamp + (_durationInMinutes * 1 minutes), _nftAddress);
        return pollId;
    }
    
    function castVote(uint256 pollId, uint256 optionIndex) public {
        require(polls[pollId].exists, "Poll does not exist");
        require(block.timestamp < polls[pollId].endTime, "Poll has ended");
        require(optionIndex < polls[pollId].options.length, "Invalid option");
        require(!hasVoted[pollId][msg.sender], "User has already voted");
        
        Poll memory poll = polls[pollId];

        // Check NFT ownership if an NFT address is set
        if (poll.nftAddress != address(0)) {
            IERC721 nftContract = IERC721(poll.nftAddress);
            require(
                nftContract.balanceOf(msg.sender) > 0,
                "User does not own the required NFT"
            );
        }

        // Mark user as voted and count the vote
        hasVoted[pollId][msg.sender] = true;
        voteCounts[pollId][optionIndex]++;

        emit VoteCast(pollId, msg.sender, optionIndex);
    }
    
    // Existing function to get individual poll by ID
    function getPollById(uint256 _pollId) public view returns (Poll memory) {
        require(polls[_pollId].exists, "Poll does not exist");
        return polls[_pollId];
    }
     // New function to get polls by creator
    function getPollsByCreator(address _creator) public view returns (uint256[] memory) {
        return pollsByCreator[_creator];
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
