/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    Groth16Verifier: {
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      abi: [
        {
          inputs: [
            {
              internalType: "uint256[2]",
              name: "_pA",
              type: "uint256[2]",
            },
            {
              internalType: "uint256[2][2]",
              name: "_pB",
              type: "uint256[2][2]",
            },
            {
              internalType: "uint256[2]",
              name: "_pC",
              type: "uint256[2]",
            },
            {
              internalType: "uint256[2]",
              name: "_pubSignals",
              type: "uint256[2]",
            },
          ],
          name: "verifyProof",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    VotingZKP: {
      address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_verifierAddress",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "pollId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "creator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "prompt",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
          ],
          name: "PollCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "pollId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "nullifierHash",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "optionIndex",
              type: "uint256",
            },
          ],
          name: "VoteCast",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256[2]",
              name: "a",
              type: "uint256[2]",
            },
            {
              internalType: "uint256[2][2]",
              name: "b",
              type: "uint256[2][2]",
            },
            {
              internalType: "uint256[2]",
              name: "c",
              type: "uint256[2]",
            },
            {
              internalType: "uint256[4]",
              name: "input",
              type: "uint256[4]",
            },
          ],
          name: "castVoteWithProof",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
            {
              internalType: "string",
              name: "_prompt",
              type: "string",
            },
            {
              internalType: "string[]",
              name: "_options",
              type: "string[]",
            },
            {
              internalType: "uint256",
              name: "_durationInMinutes",
              type: "uint256",
            },
          ],
          name: "createPoll",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_pollId",
              type: "uint256",
            },
          ],
          name: "getPollById",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "prompt",
                  type: "string",
                },
                {
                  internalType: "string[]",
                  name: "options",
                  type: "string[]",
                },
                {
                  internalType: "uint256",
                  name: "endTime",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "exists",
                  type: "bool",
                },
                {
                  internalType: "address",
                  name: "creator",
                  type: "address",
                },
              ],
              internalType: "struct VotingZKP.Poll",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_creator",
              type: "address",
            },
          ],
          name: "getPollsByCreator",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_pollId",
              type: "uint256",
            },
          ],
          name: "getVoteCounts",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "nullifierHashes",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "pollCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "polls",
          outputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "prompt",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "exists",
              type: "bool",
            },
            {
              internalType: "address",
              name: "creator",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "pollsByCreator",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "verifier",
          outputs: [
            {
              internalType: "contract Groth16Verifier",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "voteCounts",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    YourContract: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "greetingSetter",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "newGreeting",
              type: "string",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "premium",
              type: "bool",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "GreetingChange",
          type: "event",
        },
        {
          inputs: [],
          name: "greeting",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "premium",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_newGreeting",
              type: "string",
            },
          ],
          name: "setGreeting",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "totalCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "userGreetingCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
