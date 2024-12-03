"use client";

import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { ProviderNotFoundError, useAccount } from "wagmi";
import { randomBytes } from "crypto";
import { poseidon } from 'circomlib';
import { utils } from 'ffjavascript';
import snarkjs from 'snarkjs';

// Interface for vote inputs
interface VoteInputs {
    pollId: number | null;
    optionIndex: number | null;
    voterCommitment: string;
    secretSalt: string;
    randomness: string;
}

// Utility to generate Poseidon hash
export function generatePoseidonHash(inputs: any[]) {
    return utils.stringifyBigInts(poseidon(inputs));
}
// Generate voter commitment
export function generateVoterCommitment(voterAddress: string | undefined, secretSalt: string) {
    return generatePoseidonHash([voterAddress, secretSalt]);
}

// Witness generation process
export async function generateWitness(circuitInputs: VoteInputs) {
    // 1. Prepare input object with all signals
    const witnessInputs = {
      // Public inputs
      pollId: circuitInputs.pollId,
      optionIndex: circuitInputs.optionIndex,
      
      // Private inputs (witness)
      voterCommitment: circuitInputs.voterCommitment,
      secretSalt: circuitInputs.secretSalt,
      randomness: circuitInputs.randomness
    };
  
    // 2. Use circuit wasm to generate witness
    const witnessCalculator = require('../../../hardhat/circuits/build/voting_js/witness_calculator');
    
    const witness = await witnessCalculator.calculateWitness(witnessInputs);
  
    // 3. Witness typically starts with 1 as the first element (constraint system constant)
    // and contains all computed intermediate and output signals
    return witness;
}
  
// Integrated proof generation with explicit witness step
export async function generateProofWithWitness(circuitInputs : VoteInputs) {
    try {
        // Verify inputs are valid
        if (!circuitInputs.pollId || circuitInputs.optionIndex === undefined || 
            !circuitInputs.voterCommitment || !circuitInputs.secretSalt || !circuitInputs.randomness) {
          throw new Error('Invalid inputs for vote proof');
        }
    
        // Generate witness first
        const witness = await generateWitness(circuitInputs);
        console.log(witness);

        // Use witness to generate proof
        const { proof, publicSignals } = await snarkjs.groth16.prove(
        '../../../hardhat/circuits/build/voting_js/voting.wasm',  // WASM file
        '../../../hardhat/circuits/vote_final.zkey',  // Proving key
        witness          // Witness generated in previous step
        );
        console.log(proof);
        console.log(publicSignals);

        // Verify the proof locally (optional but recommended)
        const verificationKey = await snarkjs.zKey.exportVerificationKey(
        './vote_verifier.zkey'
      );
      
      const isValid = await snarkjs.groth16.verify(
        verificationKey, 
        publicSignals, 
        proof
      );
  
      if (!isValid) {
        throw new Error('Proof generation failed verification');
      }
  
      return {proof, publicSignals};
    
    }catch (error) {
        console.error('Error in prepareVoteProof:', error);
        throw error;
    }
}
 
// Utility to generate secure random salt
export function generateRandomSalt() {
    return randomBytes(32).toString();
}

export function formatProofForSubmission(proof: any) {
    return {
      a: [
        proof.pi_a[0],  // First coordinate of first group element
        proof.pi_a[1]   // Second coordinate of first group element
      ],
      b: [
        [
          proof.pi_b[0][1],  // First coordinate of second group element
          proof.pi_b[0][0]   // Second coordinate of second group element
        ],
        [
          proof.pi_b[1][1],  // Third coordinate of second group element
          proof.pi_b[1][0]   // Fourth coordinate of second group element
        ]
      ],
      c: [
        proof.pi_c[0],  // First coordinate of third group element
        proof.pi_c[1]   // Second coordinate of third group element
      ],
    };
}


const VotePoll = () => {
  const [pollId, setPollId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();

  // Fetch poll data based on pollId
  const { data: pollData, isLoading, error } = useScaffoldReadContract({
    contractName: "VotingZKP",
    functionName: "getPollById",
    args: [pollId !== null ? BigInt(pollId) : undefined],
    // enabled: pollId !== null, // Only fetch when pollId is set
  });

  

  const { writeContractAsync, isPending } = useScaffoldWriteContract("VotingZKP");

  const handleVote = async () => {
    const { address: voterAddress } = useAccount();
    console.log(voterAddress);
    const secretSalt = generateRandomSalt(); // Generate secure random salt
    const randomness = generateRandomSalt();

    const voterCommitment = generateVoterCommitment(voterAddress, secretSalt);
    const voteInputs = {
        pollId: pollId, // Unique poll identifier
        optionIndex: selectedOption,
        voterCommitment,
        secretSalt,
        randomness
    };

    if (pollId !== null && selectedOption !== null) {
      try {
        const { proof, publicSignals } = await generateProofWithWitness(voteInputs);
        // const formattedProof = formatProofForSubmission(proof);
        const tx = await writeContractAsync({
          functionName: "castVoteWithProof",
          args: [
            [
                proof.pi_a[0],  // First coordinate of first group element
                proof.pi_a[1]   // Second coordinate of first group element
            ], 
            [
                [
                  proof.pi_b[0][1],  // First coordinate of second group element
                  proof.pi_b[0][0]   // Second coordinate of second group element
                ],
                [
                  proof.pi_b[1][1],  // Third coordinate of second group element
                  proof.pi_b[1][0]   // Fourth coordinate of second group element
                ]
            ], 
            [
                proof.pi_c[0],  // First coordinate of third group element
                proof.pi_c[1]   // Second coordinate of third group element
            ], 
            [BigInt(pollId), BigInt(selectedOption), publicSignals[0], publicSignals[1]]],
        });
        setTransactionHash(tx);
      } catch (error) {
        console.error("Error casting vote", error);
      }
    }

  };




  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl mb-4">Vote on Poll</h1>
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="number"
          placeholder="Enter Poll ID"
          value={pollId ?? ''}
          onChange={(e) => {
            const inputValue = e.target.value;
            setPollId(inputValue ? Number(inputValue) : null);
          }}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      {isLoading && <p>Loading poll information...</p>}
      
      {error && (
        <div className="alert alert-error">
          <p>Error fetching poll: {error.message}</p>
        </div>
      )}

      {pollData && (
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-3">{pollData.name}</h2>
          <p className="mb-3">{pollData.prompt}</p>

          <div className="space-y-2">
            {pollData.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="poll-options"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="radio mr-2"
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>

          <button 
            onClick={handleVote}
            disabled={selectedOption === null || isPending}
            className="btn btn-primary mt-4 w-full"
          >
            {isPending ? "Voting..." : "Cast Vote with Proof"}
          </button>

        {transactionHash && (
          <div className="alert alert-success mt-4">
            <p>Vote successfully cast! Transaction Hash: {transactionHash}</p>
          </div>
        )}

        </div>
      )}
    </div>
  );
};

export default VotePoll;