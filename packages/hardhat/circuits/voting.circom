pragma circom 2.0.0;

// Include required circom libraries
include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template VoteVerifier() {
    // Public inputs
    signal input pollId;
    signal input optionIndex;
    signal input nullifier; // Random value to prevent double voting
    
    // Private inputs
    signal input privateKey; // User's private key
    signal input randomness; // Random value for generating commitment
    
    // Public outputs
    signal output voteHash; // Hash of the vote
    signal output nullifierHash; // Hash to prevent double voting
    
    // Components
    component poseidonVote = Poseidon(3);
    component poseidonNullifier = Poseidon(2);
    component validOption = LessThan(32); // Assuming max 2^32 options
    
    // Verify option index is valid (implemented in the contract)
    validOption.in[0] <== optionIndex;
    validOption.in[1] <== 1000; // Max number of options
    validOption.out === 1;
    
    // Calculate vote hash
    poseidonVote.inputs[0] <== pollId;
    poseidonVote.inputs[1] <== optionIndex;
    poseidonVote.inputs[2] <== randomness;
    voteHash <== poseidonVote.out;
    
    // Calculate nullifier hash to prevent double voting
    poseidonNullifier.inputs[0] <== pollId;
    poseidonNullifier.inputs[1] <== privateKey;
    nullifierHash <== poseidonNullifier.out;
}

component main = VoteVerifier();